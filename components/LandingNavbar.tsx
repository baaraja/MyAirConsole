'use client';

import { useState } from 'react';
import UserButton from '@/components/UserButton';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';

export default function LandingNavbar() {
  const navItems = [
    { name: 'Accueil', link: '/' },
    { name: 'Games', link: '#projects' },
    { name: 'Room', link: '/news' },
    { name: 'Événements', link: '/events' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative z-[110] pt-4 navbar-container">
      <Navbar>
        {/* Desktop */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const code = prompt("Code de session pour la manette :");
                if (code && code.trim()) {
                  window.open(`/sessions/${code.trim()}/controller`, '_blank');
                } else {
                  window.open("/sessions/join", '_blank');
                }
              }}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              title="Ouvrir contrôleur mobile"
            >
              🎮
            </button>
            <UserButton />
            <NavbarButton href="#contact" variant="secondary">
              Contact
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-white dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <button
                onClick={() => {
                  const code = prompt("Code de session pour la manette :");
                  if (code && code.trim()) {
                    window.open(`/sessions/${code.trim()}/controller`, '_blank');
                  } else {
                    window.open("/sessions/join", '_blank');
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg text-white"
              >
                🎮 Contrôleur Mobile
              </button>
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <UserButton className="w-full" />
              </div>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                href="#contact"
                variant="primary"
                className="w-full"
              >
                Contact
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}