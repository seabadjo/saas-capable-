import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-[#CDD4DD]/60 bg-[#FEF7F8] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-[#1F2937]/70 leading-relaxed">
            Automatisez votre prospection. Accélérez votre croissance.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22819A] mb-4">
            Produit
          </h4>
          <ul className="space-y-2.5 text-sm text-[#1F2937]/80">
            <li><Link to="/features" className="hover:text-[#22819A] transition-colors">Fonctionnalités</Link></li>
            <li><Link to="/solutions" className="hover:text-[#22819A] transition-colors">Solutions</Link></li>
            <li><Link to="/pricing" className="hover:text-[#22819A] transition-colors">Tarifs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22819A] mb-4">
            Ressources
          </h4>
          <ul className="space-y-2.5 text-sm text-[#1F2937]/80">
            <li><a href="#" className="hover:text-[#22819A] transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-[#22819A] transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-[#22819A] transition-colors">API</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22819A] mb-4">
            Entreprise
          </h4>
          <ul className="space-y-2.5 text-sm text-[#1F2937]/80">
            <li><Link to="/contact" className="hover:text-[#22819A] transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-[#22819A] transition-colors">Mentions légales</a></li>
            <li><a href="#" className="hover:text-[#22819A] transition-colors">Confidentialité</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#CDD4DD]/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 text-xs text-[#1F2937]/60 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} GUEGON. Tous droits réservés.</span>
          <span>Conçu pour les équipes B2B exigeantes.</span>
        </div>
      </div>
    </footer>
  );
}
