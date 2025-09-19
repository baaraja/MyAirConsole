'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trpc } from '@/lib/client/trpc';
import Link from 'next/link';
import { Shield, User, Mail, Settings } from 'lucide-react';

interface FilterState {
  sector: string;
  maturity: string;
  address: string;
  search: string;
}

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [filters, setFilters] = useState<FilterState>({
    sector: 'all',
    maturity: 'all',
    address: 'all',
    search: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || ''
      });
    }
  }, [status, router, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#0f051a] to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F18585] mx-auto"></div>
          <p className="text-[#F8CACF]">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleSave = async () => {
    try {
      // TODO: Implement profile update API
      console.log('Saving profile:', formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      });
      
      if (response.ok) {
        await update();
        window.location.reload();
      } else {
        console.error('Failed to refresh session');
        alert('Erreur lors de la mise à jour de la session');
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      alert('Erreur lors de la mise à jour de la session');
    } finally {
      setIsRefreshing(false);
    }
  };

  const isAdmin = session?.user?.role === 'ADMIN';
  const isInvestor = (session?.user?.role as any) === 'INVESTOR';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#0f051a] to-black text-white">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 bg-gradient-to-br from-black/80 via-[#C174F2]/5 to-[#F18585]/5 rounded-xl p-4 sm:p-6 backdrop-blur-md border border-[#F49C9C]/20 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#F18585] to-[#C174F2] rounded-xl flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F18585] to-[#F49C9C] bg-clip-text text-transparent mb-2">Mon Profil</h1>
              <p className="text-[#F8CACF]">
                Gérez vos informations personnelles
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-[#C174F2]/20 to-[#F18585]/20 hover:from-[#C174F2]/30 hover:to-[#F18585]/30 border border-[#CB90F1]/30 rounded-lg transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
            >
              ← Accueil
            </Link>
            {isAdmin && (
              <Link 
                href="/admin"
                className="px-4 py-2 bg-gradient-to-r from-[#C174F2] to-[#CB90F1] hover:from-[#CB90F1] hover:to-[#D5A8F2] rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#C174F2]/25 flex items-center gap-2"
              >
                <Shield size={18} />
                Panel Admin
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-400/20 text-red-300 hover:from-red-500/30 hover:to-red-400/30 border border-red-400/30 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            isAdmin 
              ? 'bg-gradient-to-r from-[#C174F2]/20 to-[#CB90F1]/20 text-[#EED5FB] border border-[#C174F2]/30'
              : isInvestor
              ? 'bg-gradient-to-r from-[#D5A8F2]/20 to-[#E4BEF8]/20 text-[#EED5FB] border border-[#D5A8F2]/30'
              : 'bg-gradient-to-r from-[#F8CACF]/20 to-[#F6AEAE]/20 text-[#F8CACF] border border-[#F8CACF]/30'
          }`}>
            <Shield size={16} />
            {isAdmin 
              ? 'Administrateur'
              : isInvestor
              ? 'Investisseur'
              : 'Utilisateur'
            }
          </div>
          <button
            onClick={handleRefreshSession}
            disabled={isRefreshing}
            className="px-3 py-1 bg-gradient-to-r from-[#F49C9C]/20 to-[#F6AEAE]/20 hover:from-[#F49C9C]/30 hover:to-[#F6AEAE]/30 border border-[#F49C9C]/30 rounded-lg transition-all duration-300 backdrop-blur-sm text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isRefreshing ? '🔄' : '🔄'} {isRefreshing ? 'Actualisation...' : 'Actualiser le rôle'}
          </button>
        </div>

        {/* Info notification */}
        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-[#F18585]/10 to-[#F49C9C]/10 border border-[#F49C9C]/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
          <p className="text-[#F6AEAE] text-sm">
            💡 <strong>Note :</strong> Si votre rôle a été modifié dans la base de données, cliquez sur "Actualiser le rôle" pour mettre à jour votre session et voir les nouveaux privilèges.
          </p>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <div className="bg-gradient-to-br from-black/80 via-[#C174F2]/5 to-[#F18585]/5 rounded-xl p-4 sm:p-6 backdrop-blur-md border border-[#F49C9C]/20">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                  <User size={20} />
                  Informations personnelles
                </h3>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#F18585] to-[#F49C9C] hover:from-[#F49C9C] hover:to-[#F6AEAE] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#F18585]/25 flex items-center gap-2"
                >
                  <Settings size={16} />
                  {isEditing ? 'Sauvegarder' : 'Modifier'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                <div>
                  <label className="block text-[#F8CACF] text-sm mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Adresse email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-black/30 border border-[#F49C9C]/30 rounded-lg text-white focus:border-[#F18585]/50 focus:ring-1 focus:ring-[#F18585]/20 focus:outline-none backdrop-blur-sm"
                      disabled
                    />
                  ) : (
                    <p className="text-white bg-black/30 border border-[#F49C9C]/20 px-4 py-3 rounded-lg backdrop-blur-sm">
                      {session?.user?.email || 'Non défini'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[#F8CACF] text-sm mb-2">
                    <User size={16} className="inline mr-2" />
                    Nom d'utilisateur
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-black/30 border border-[#F49C9C]/30 rounded-lg text-white focus:border-[#F18585]/50 focus:ring-1 focus:ring-[#F18585]/20 focus:outline-none backdrop-blur-sm"
                      placeholder="Votre nom"
                    />
                  ) : (
                    <p className="text-white bg-black/30 border border-[#F49C9C]/20 px-4 py-3 rounded-lg backdrop-blur-sm">
                      {session?.user?.name || 'Non défini'}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-300 hover:from-green-500/30 hover:to-green-400/30 border border-green-400/30 rounded-lg transition-all duration-300 backdrop-blur-sm"
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gradient-to-r from-[#C174F2]/20 to-[#F18585]/20 hover:from-[#C174F2]/30 hover:to-[#F18585]/30 border border-[#CB90F1]/30 rounded-lg transition-all duration-300 backdrop-blur-sm text-white"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="mt-4 sm:mt-0 space-y-4 sm:space-y-6">
            {/* Security */}
            <div className="bg-gradient-to-br from-black/80 via-[#C174F2]/5 to-[#F18585]/5 rounded-xl p-4 sm:p-6 backdrop-blur-md border border-[#F49C9C]/20">
              <h3 className="text-lg font-semibold mb-4 text-white">Sécurité</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#C174F2]/20 to-[#F18585]/20 hover:from-[#C174F2]/30 hover:to-[#F18585]/30 border border-[#CB90F1]/30 rounded-lg transition-all duration-300 text-left text-white backdrop-blur-sm">
                  Changer le mot de passe
                </button>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-red-400/20 hover:from-red-500/30 hover:to-red-400/30 border border-red-400/30 text-red-300 rounded-lg transition-all duration-300 text-left backdrop-blur-sm">
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}