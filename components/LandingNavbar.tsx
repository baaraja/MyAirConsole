'use client';

import { useState } from 'react';
import UserButton from '@/components/UserButton';
import ControllerIcon from '@/components/controller-icon';
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
            <ControllerIcon size={20} />
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
              <div className="flex justify-center">
                <ControllerIcon size={24} className="w-full" />
              </div>
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