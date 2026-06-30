"""
GUEGON Backend API regression tests.
Covers: auth, prospects CRUD, campaigns CRUD, AI email, contact, stats, refresh.
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://lead-finder-demo-3.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@guegon.io"
ADMIN_PASSWORD = "Admin123!"


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


# ---------- Health ----------
def test_root_ok():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# ---------- Auth ----------
def test_admin_login_sets_cookies(admin_session):
    # cookies set
    cookies = admin_session.cookies.get_dict()
    assert "access_token" in cookies
    assert "refresh_token" in cookies


def test_login_wrong_password_returns_string_detail():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=15)
    assert r.status_code == 401
    data = r.json()
    assert "detail" in data
    assert isinstance(data["detail"], str)
    assert "incorrect" in data["detail"].lower() or "mot de passe" in data["detail"].lower()


def test_login_invalid_payload_validation():
    # Pydantic validation: missing email -> 422 with list detail; frontend formatter handles list
    r = requests.post(f"{API}/auth/login", json={"password": "x"}, timeout=15)
    assert r.status_code == 422


def test_me_authenticated(admin_session):
    r = admin_session.get(f"{API}/auth/me", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "admin"
    assert "id" in data


def test_me_unauthenticated():
    r = requests.get(f"{API}/auth/me", timeout=15)
    assert r.status_code == 401


def test_register_and_duplicate():
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    s = requests.Session()
    payload = {"email": email, "password": "Passw0rd!", "name": "Test User", "company": "Acme"}
    r = s.post(f"{API}/auth/register", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == email
    assert body["name"] == "Test User"
    # cookies set
    assert "access_token" in s.cookies.get_dict()
    # me works
    me = s.get(f"{API}/auth/me", timeout=15)
    assert me.status_code == 200
    # duplicate
    r2 = requests.post(f"{API}/auth/register", json=payload, timeout=15)
    assert r2.status_code == 400


def test_refresh_token_flow():
    # Register a fresh user
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    s = requests.Session()
    s.post(f"{API}/auth/register", json={"email": email, "password": "Passw0rd!", "name": "Refresh User"}, timeout=15)
    # Drop access token, keep refresh
    s.cookies.pop("access_token", None)
    r = s.post(f"{API}/auth/refresh", timeout=15)
    assert r.status_code == 200
    assert "access_token" in s.cookies.get_dict()


def test_logout_clears_session(admin_session):
    s = requests.Session()
    s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    r = s.post(f"{API}/auth/logout", timeout=15)
    assert r.status_code == 200
    me = s.get(f"{API}/auth/me", timeout=15)
    assert me.status_code == 401


# ---------- Prospects ----------
def test_prospects_crud(admin_session):
    payload = {
        "company": "TEST_Acme Corp",
        "name": "Jean Dupont",
        "email": "jean@acme.test",
        "industry": "SaaS",
        "city": "Paris",
    }
    r = admin_session.post(f"{API}/prospects", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    created = r.json()
    assert created["company"] == payload["company"]
    assert "id" in created
    pid = created["id"]

    # GET list contains it
    r2 = admin_session.get(f"{API}/prospects", timeout=15)
    assert r2.status_code == 200
    ids = [p["id"] for p in r2.json()]
    assert pid in ids

    # Delete
    r3 = admin_session.delete(f"{API}/prospects/{pid}", timeout=15)
    assert r3.status_code == 200

    # Verify removed
    r4 = admin_session.get(f"{API}/prospects", timeout=15)
    ids_after = [p["id"] for p in r4.json()]
    assert pid not in ids_after


def test_prospects_unauthenticated():
    r = requests.get(f"{API}/prospects", timeout=15)
    assert r.status_code == 401


def test_prospects_delete_invalid_id(admin_session):
    r = admin_session.delete(f"{API}/prospects/not-an-objectid", timeout=15)
    assert r.status_code == 400


# ---------- Campaigns ----------
def test_campaigns_crud(admin_session):
    payload = {"title": "TEST_Campaign Q1", "subject": "Bonjour {{prenom}}"}
    r = admin_session.post(f"{API}/campaigns", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    created = r.json()
    assert created["title"] == payload["title"]
    assert created["subject"] == payload["subject"]
    assert created["stats"] == {"sent": 0, "opened": 0, "replied": 0, "clicked": 0}
    cid = created["id"]

    r2 = admin_session.get(f"{API}/campaigns", timeout=15)
    assert r2.status_code == 200
    ids = [c["id"] for c in r2.json()]
    assert cid in ids

    r3 = admin_session.delete(f"{API}/campaigns/{cid}", timeout=15)
    assert r3.status_code == 200


# ---------- Stats ----------
def test_stats_overview(admin_session):
    r = admin_session.get(f"{API}/stats/overview", timeout=15)
    assert r.status_code == 200
    data = r.json()
    for key in ["total_prospects", "total_campaigns", "open_rate", "meetings_booked"]:
        assert key in data


# ---------- Contact ----------
def test_contact_submission():
    payload = {
        "name": "TEST_John Doe",
        "email": "john@test.com",
        "company": "Acme",
        "message": "Bonjour, je suis intéressé par GUEGON.",
    }
    r = requests.post(f"{API}/contact", json=payload, timeout=15)
    assert r.status_code == 200
    assert r.json().get("ok") is True


# ---------- AI Email (Claude Sonnet 4.5) ----------
def test_ai_generate_email(admin_session):
    payload = {
        "company": "Renault",
        "prospect_name": "Marie Martin",
        "role": "Directeur Commercial",
        "industry": "Automobile",
        "context": "lancement d'un nouveau CRM",
        "tone": "professionnel",
    }
    r = admin_session.post(f"{API}/ai/generate-email", json=payload, timeout=90)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "subject" in data
    assert "body" in data
    assert "raw" in data
    # Ensure non-empty body
    assert len(data["body"]) > 20
