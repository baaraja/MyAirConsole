"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Github, ArrowRight, ExternalLink } from "lucide-react";

export function ModernFooter() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic here
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-neutral-900 border-t border-neutral-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-white to-neutral-300 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">AC</span>
              </div>
              <h3 className="text-xl font-bold text-white">MyAirConsole</h3>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Jouer à des jeux ensemble n'a jamais été aussi facile ! Utilise tes smartphones comme manettes de jeu et commence à jouer instantanément.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Github, href: "#", label: "GitHub" }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all duration-200 group"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Navigation</h4>
            <div className="space-y-3">
              {[
                { label: "Accueil", href: "#home" },
                { label: "Nos projets", href: "#projects" },
                { label: "Actualités", href: "#news" },
                { label: "Événements", href: "#events" },
                { label: "À propos", href: "#about" },
                { label: "Contact", href: "#contact" }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-neutral-400 hover:text-white transition-colors duration-200 text-sm group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <div className="space-y-3">
              {[
                { label: "Incubation", href: "#incubation" },
                { label: "Accélération", href: "#acceleration" },
                { label: "Mentorat", href: "#mentoring" },
                { label: "Financement", href: "#funding" },
                { label: "Networking", href: "#networking" },
                { label: "Formation", href: "#training" }
              ].map((service) => (
                <a
                  key={service.label}
                  href={service.href}
                  className="block text-neutral-400 hover:text-white transition-colors duration-200 text-sm group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                    {service.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Restons connectés</h4>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-neutral-400" />
                <a href="mailto:contact@moi.fr" className="text-neutral-400 hover:text-white transition-colors">
                  contact@moi.fr
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-neutral-400" />
                <a href="tel:+33123456789" className="text-neutral-400 hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-neutral-400" />
                <span className="text-neutral-400">
                  123 Avenue de l'Innovation, Paris
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
              <h5 className="text-white font-medium mb-3 text-sm">Newsletter</h5>
              <p className="text-neutral-400 text-xs mb-3">
                Recevez nos dernières actualités et opportunités
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-neutral-700/50 border border-neutral-600/50 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-400 focus:border-white/50 focus:ring-1 focus:ring-white/10 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-3 py-2 rounded-md text-sm hover:bg-neutral-200 transition-colors duration-200 group"
                >
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

      
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 bg-neutral-950/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-neutral-400 text-sm">
              © 2024 MyAirConsole. Tous droits réservés.
            </div>
            <div className="flex gap-6">
              {[
                { label: "Mentions légales", href: "#legal" },
                { label: "Politique de confidentialité", href: "#privacy" },
                { label: "Cookies", href: "#cookies" }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
