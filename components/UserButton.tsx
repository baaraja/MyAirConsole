'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// "User button" inspired by shadcn/ui (Avatar + Dropdown)
export default function UserButton({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 0);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (status === 'loading') {
    return <div className={cn('h-9 w-28 rounded-md bg-gray-800/60 animate-pulse', className)} />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth"
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-gray-200 relative z-50 cursor-pointer',
          className,
        )}
      >
        Se connecter
      </Link>
    );
  }

  const displayName = session.user.name || session.user.email?.split('@')[0] || 'Utilisateur';
  const displayEmail = session.user.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900 px-2.5 py-1.5 text-sm text-white shadow hover:bg-gray-800',
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Link href="/profile" className="focus:outline-none">
          {session.user.image ? (
            <Image src={session.user.image} alt="Avatar" width={28} height={28} className="rounded-full" />
          ) : (
            <div className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm font-semibold text-black">
              {initial}
            </div>
          )}
        </Link>
        {!scrolled && (
          <span className="hidden sm:block truncate max-w-[140px]">
            {displayName}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-md border border-gray-800 bg-black text-white shadow-xl z-50 hidden sm:block"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
            {session.user.image ? (
              <Image src={session.user.image} alt="Avatar" width={36} height={36} className="rounded-full" />
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-semibold text-black">
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-gray-400">{displayEmail}</p>
            </div>
          </div>
          <div className="py-1">
            <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-900" role="menuitem">
              Profil
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-900 hover:text-red-300"
              role="menuitem"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
