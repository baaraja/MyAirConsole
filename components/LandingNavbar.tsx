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
    { name: 'Games', link: '/games' },
    { name: 'Room', link: '/sessions/join' },
    { name: 'Controller', link: '#' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative z-[110] pt-4 navbar-container">
      <Navbar>
        {/* Desktop */}
        <NavBody>
          <NavbarLogo />
          <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-white transition duration-200 lg:flex lg:space-x-2">
            {navItems.map((item, idx) => {
              if (item.name === 'Controller') {
                return (
                  <button
                    key={`nav-${idx}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const code = prompt("Code de session pour la manette :");
                      if (code && code.trim()) {
                        window.open(`/sessions/${code.trim()}/controller`, '_blank');
                      }
                    }}
                    className="relative px-4 py-2 text-white transition-colors hover:bg-white/10 rounded-full bg-transparent border-0 cursor-pointer"
                  >
                    <span className="relative z-20">{item.name}</span>
                  </button>
                );
              }
              return (
                <a
                  key={`nav-${idx}`}
                  href={item.link}
                  className="relative px-4 py-2 text-white transition-colors hover:bg-white/10 rounded-full"
                >
                  <span className="relative z-20">{item.name}</span>
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
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
            {navItems.map((item, idx) => {
              if (item.name === 'Controller') {
                return (
                  <button
                    key={`mobile-link-${idx}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const code = prompt("Code de session pour la manette :");
                      if (code && code.trim()) {
                        window.open(`/sessions/${code.trim()}/controller`, '_blank');
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="relative text-white dark:text-neutral-300 bg-transparent border-0 text-left w-full cursor-pointer"
                  >
                    <span className="block">{item.name}</span>
                  </button>
                );
              }
              return (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-white dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              );
            })}
            <div className="flex w-full flex-col gap-4">
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
