'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthCTA() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  if (status === 'loading') {
    return (
      <div className="h-10 w-28 rounded bg-gray-800/60 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link href="/auth" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors">
        Connexion
      </Link>
    );
  }

  const displayName = session.user.name || session.user.email?.split('@')[0] || 'Utilisateur';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-2 rounded hover:bg-gray-800 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {session.user.image ? (
          <Image src={session.user.image} alt="Avatar" width={28} height={28} className="rounded-full" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-semibold">
            {initial}
          </div>
        )}
        <span className="hidden sm:block text-sm">{displayName}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-md border border-gray-800 bg-black text-white shadow-lg z-20"
        >
          <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-900" role="menuitem">
            Profil
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-900"
            role="menuitem"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
