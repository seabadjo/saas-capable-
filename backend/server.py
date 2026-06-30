from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import uuid
import secrets
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, status
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, ConfigDict, BeforeValidator
from starlette.middleware.cors import CORSMiddleware

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 15
REFRESH_TOKEN_DAYS = 7

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("guegon")

app = FastAPI(title="GUEGON API")
api_router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_DAYS),
        "type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token", value=access_token, httponly=True, secure=True,
        samesite="none", max_age=ACCESS_TOKEN_MINUTES * 60, path="/",
    )
    response.set_cookie(
        key="refresh_token", value=refresh_token, httponly=True, secure=True,
        samesite="none", max_age=REFRESH_TOKEN_DAYS * 86400, path="/",
    )


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "company": user.get("company", ""),
        "plan": user.get("plan", "starter"),
        "role": user.get("role", "user"),
        "created_at": user.get("created_at").isoformat() if isinstance(user.get("created_at"), datetime) else user.get("created_at"),
    }


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Type de token invalide")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1, max_length=100)
    company: Optional[str] = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProspectCreate(BaseModel):
    company: str = Field(min_length=1, max_length=200)
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    website: Optional[str] = ""
    linkedin: Optional[str] = ""
    industry: Optional[str] = ""
    city: Optional[str] = ""
    status: Optional[str] = "new"  # new, contacted, qualified, won, lost
    score: Optional[int] = 50
    tags: List[str] = []
    notes: Optional[str] = ""


class Prospect(ProspectCreate):
    id: str
    user_id: str
    created_at: str


class CampaignCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    subject: str = Field(min_length=1, max_length=200)
    channel: str = "email"  # email, linkedin
    status: str = "draft"  # draft, active, paused, completed
    steps: List[dict] = []


class AIEmailRequest(BaseModel):
    prospect_name: str = ""
    company: str
    industry: str = ""
    role: str = ""
    context: str = ""
    tone: str = "professionnel"  # professionnel, amical, direct
    goal: str = "obtenir un rendez-vous"


class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    company: Optional[str] = ""
    message: str = Field(min_length=1, max_length=2000)


# ---------------------------------------------------------------------------
# Auth Endpoints
# ---------------------------------------------------------------------------
@api_router.post("/auth/register")
async def register(payload: RegisterRequest, response: Response):
    email = payload.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Un compte avec cet email existe déjà")
    doc = {
        "email": email,
        "password_hash": hash_password(payload.password),
        "name": payload.name,
        "company": payload.company or "",
        "plan": "starter",
        "role": "user",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    access = create_access_token(str(result.inserted_id), email)
    refresh = create_refresh_token(str(result.inserted_id))
    set_auth_cookies(response, access, refresh)
    return serialize_user(doc)


@api_router.post("/auth/login")
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    access = create_access_token(str(user["_id"]), email)
    refresh = create_refresh_token(str(user["_id"]))
    set_auth_cookies(response, access, refresh)
    return serialize_user(user)


@api_router.post("/auth/logout")
async def logout(response: Response):
    clear_auth_cookies(response)
    return {"ok": True}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return serialize_user(user)


@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Pas de refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Type invalide")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        access = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie(
            key="access_token", value=access, httponly=True, secure=True,
            samesite="none", max_age=ACCESS_TOKEN_MINUTES * 60, path="/",
        )
        return {"ok": True}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Refresh token invalide")


# ---------------------------------------------------------------------------
# Prospects
# ---------------------------------------------------------------------------
def _prospect_to_dict(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id", ""),
        "company": doc.get("company", ""),
        "name": doc.get("name", ""),
        "email": doc.get("email", ""),
        "phone": doc.get("phone", ""),
        "website": doc.get("website", ""),
        "linkedin": doc.get("linkedin", ""),
        "industry": doc.get("industry", ""),
        "city": doc.get("city", ""),
        "status": doc.get("status", "new"),
        "score": doc.get("score", 50),
        "tags": doc.get("tags", []),
        "notes": doc.get("notes", ""),
        "created_at": doc.get("created_at"),
    }


@api_router.get("/prospects")
async def list_prospects(user: dict = Depends(get_current_user)):
    docs = await db.prospects.find({"user_id": str(user["_id"])}).sort("created_at", -1).to_list(1000)
    return [_prospect_to_dict(d) for d in docs]


@api_router.post("/prospects")
async def create_prospect(payload: ProspectCreate, user: dict = Depends(get_current_user)):
    doc = payload.model_dump()
    doc["user_id"] = str(user["_id"])
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.prospects.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _prospect_to_dict(doc)


@api_router.delete("/prospects/{prospect_id}")
async def delete_prospect(prospect_id: str, user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(prospect_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")
    result = await db.prospects.delete_one({"_id": oid, "user_id": str(user["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prospect introuvable")
    return {"ok": True}


# ---------------------------------------------------------------------------
# Campaigns
# ---------------------------------------------------------------------------
def _campaign_to_dict(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id", ""),
        "title": doc.get("title", ""),
        "subject": doc.get("subject", ""),
        "channel": doc.get("channel", "email"),
        "status": doc.get("status", "draft"),
        "steps": doc.get("steps", []),
        "created_at": doc.get("created_at"),
        "stats": doc.get("stats", {"sent": 0, "opened": 0, "replied": 0, "clicked": 0}),
    }


@api_router.get("/campaigns")
async def list_campaigns(user: dict = Depends(get_current_user)):
    docs = await db.campaigns.find({"user_id": str(user["_id"])}).sort("created_at", -1).to_list(1000)
    return [_campaign_to_dict(d) for d in docs]


@api_router.post("/campaigns")
async def create_campaign(payload: CampaignCreate, user: dict = Depends(get_current_user)):
    doc = payload.model_dump()
    doc["user_id"] = str(user["_id"])
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["stats"] = {"sent": 0, "opened": 0, "replied": 0, "clicked": 0}
    result = await db.campaigns.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _campaign_to_dict(doc)


@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(campaign_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")
    result = await db.campaigns.delete_one({"_id": oid, "user_id": str(user["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campagne introuvable")
    return {"ok": True}


# ---------------------------------------------------------------------------
# AI Email Generation (Claude Sonnet 4.5)
# ---------------------------------------------------------------------------
@api_router.post("/ai/generate-email")
async def generate_email(payload: AIEmailRequest, user: dict = Depends(get_current_user)):
    from emergentintegrations.llm.chat import LlmChat, UserMessage

    system_msg = (
        "Tu es un expert en prospection B2B et copywriting. "
        "Tu écris des emails de prospection courts (max 120 mots), personnalisés, "
        "qui captent l'attention et incitent à la réponse. "
        "Tu réponds STRICTEMENT au format suivant, sans markdown ni explications :\n"
        "SUJET: <ligne de sujet ici>\n"
        "CORPS:\n<corps de l'email ici>"
    )
    prompt = (
        f"Cible:\n"
        f"- Entreprise: {payload.company}\n"
        f"- Nom du contact: {payload.prospect_name or 'inconnu'}\n"
        f"- Rôle: {payload.role or 'inconnu'}\n"
        f"- Secteur: {payload.industry or 'inconnu'}\n\n"
        f"Contexte additionnel: {payload.context or 'aucun'}\n"
        f"Ton: {payload.tone}\n"
        f"Objectif: {payload.goal}\n\n"
        f"Rédige l'email maintenant."
    )

    try:
        chat = LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=f"ai-email-{user['_id']}-{uuid.uuid4()}",
            system_message=system_msg,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        result = await chat.send_message(UserMessage(text=prompt))
        text = result if isinstance(result, str) else getattr(result, "content", str(result))
    except Exception as e:
        logger.exception("AI email generation failed: %s", e)
        raise HTTPException(status_code=500, detail="Échec de la génération IA")

    subject, body = "", text.strip()
    if "SUJET:" in text:
        try:
            after = text.split("SUJET:", 1)[1]
            if "CORPS:" in after:
                subject = after.split("CORPS:", 1)[0].strip()
                body = after.split("CORPS:", 1)[1].strip()
            else:
                lines = after.strip().split("\n", 1)
                subject = lines[0].strip()
                body = lines[1].strip() if len(lines) > 1 else ""
        except Exception:
            pass

    return {"subject": subject, "body": body, "raw": text}


# ---------------------------------------------------------------------------
# Contact form (public)
# ---------------------------------------------------------------------------
@api_router.post("/contact")
async def submit_contact(payload: ContactMessage):
    doc = payload.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contact_messages.insert_one(doc)
    return {"ok": True, "message": "Merci, nous vous recontactons sous 24h."}


# ---------------------------------------------------------------------------
# Stats (for dashboard overview)
# ---------------------------------------------------------------------------
@api_router.get("/stats/overview")
async def stats_overview(user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])
    total_prospects = await db.prospects.count_documents({"user_id": user_id})
    total_campaigns = await db.campaigns.count_documents({"user_id": user_id})
    active_campaigns = await db.campaigns.count_documents({"user_id": user_id, "status": "active"})
    qualified = await db.prospects.count_documents({"user_id": user_id, "status": "qualified"})
    won = await db.prospects.count_documents({"user_id": user_id, "status": "won"})
    return {
        "total_prospects": total_prospects,
        "total_campaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "qualified_prospects": qualified,
        "won_prospects": won,
        "open_rate": 42.8,
        "reply_rate": 14.2,
        "meetings_booked": won,
    }


@api_router.get("/")
async def root():
    return {"name": "GUEGON API", "status": "ok"}


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@guegon.io").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin123!")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin GUEGON",
            "company": "GUEGON",
            "plan": "enterprise",
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
        })
        logger.info("Admin seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info("Admin password updated")


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.prospects.create_index("user_id")
    await db.campaigns.create_index("user_id")
    await seed_admin()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# Include API router
app.include_router(api_router)

# CORS
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
cors_origins = os.environ.get("CORS_ORIGINS", frontend_url).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins if cors_origins != ["*"] else [frontend_url],
    allow_methods=["*"],
    allow_headers=["*"],
)
