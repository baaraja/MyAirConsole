'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signInSchema, signUpSchema } from '@/lib/schemas';

type FieldErrors = Partial<Record<'email' | 'password' | 'confirmPassword', string>>;

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValid = useMemo(() => {
    if (isSignUp) {
      const result = signUpSchema.safeParse({ email, password, confirmPassword });
      if (!result.success) return false;
      return true;
    }
    const result = signInSchema.safeParse({ email, password });
    return result.success;
  }, [email, password, confirmPassword, isSignUp]);

  const validate = useCallback(() => {
    if (isSignUp) {
      const result = signUpSchema.safeParse({ email, password, confirmPassword });
      if (!result.success) {
        const issue = result.error.issues[0];
        setErrors({ [issue.path[0] as 'email' | 'password' | 'confirmPassword']: issue.message });
        return false;
      }
    } else {
      const result = signInSchema.safeParse({ email, password });
      if (!result.success) {
        const issue = result.error.issues[0];
        setErrors({ [issue.path[0] as 'email' | 'password']: issue.message });
        return false;
      }
    }
    setErrors({});
    return true;
  }, [email, password, confirmPassword, isSignUp]);

  useEffect(() => {
    // Clear form errors when switching mode
    setErrors({});
    setFormError(null);
    setPassword('');
    setConfirmPassword('');
  }, [isSignUp]);

  function handleGoogleSignIn() {
    // Use direct redirect for maximum reliability
    void signIn('google', { callbackUrl: '/profile' });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          setFormError(data.error || "Erreur lors de l'inscription");
          return;
        }
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setFormError(isSignUp ? 'Compte créé, mais connexion impossible. Essayez de vous connecter.' : 'Email ou mot de passe incorrect');
      } else {
        // Rediriger vers le profil pour les nouveaux utilisateurs
        router.push('/');
      }
    } catch {
      setFormError(isSignUp ? "Erreur lors de l'inscription" : 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200/60">
      <h2 className="text-xl font-semibold mb-5 text-slate-900 text-center">
        {isSignUp ? 'Créer un compte' : 'Se connecter'}
      </h2>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full mb-5 border border-slate-300 bg-white text-slate-900 py-2.5 px-4 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-3"
        aria-label="Continuer avec Google"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading ? 'Connexion…' : 'Continuer avec Google'}
      </button>

      <div className="relative mb-5" aria-hidden="true">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-slate-500">ou</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validate}
            required
            autoComplete="email"
            className={`w-full px-3 py-2 border rounded-md text-neutral-800 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-300 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-200'}`}
            placeholder="votre@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            {!isSignUp && (
              <a href="#" className="text-xs text-blue-600 hover:underline" onClick={(e) => e.preventDefault()}>
                Mot de passe oublié ?
              </a>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validate}
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none text-neutral-900 focus:ring-2 pr-10 ${errors.password ? 'border-red-300 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-200'}`}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? (
                // eye-off
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l1.473 1.473A11.967 11.967 0 0 0 .75 12s3.75 7.5 11.25 7.5a11.22 11.22 0 0 0 5.403-1.383l3.067 3.067a.75.75 0 0 0 1.06-1.06L3.53 2.47Zm7.217 8.277 2.506 2.506a2.25 2.25 0 0 1-2.506-2.506ZM12 6.75c-1.063 0-2.063.242-2.965.674l1.233 1.233A3.75 3.75 0 0 1 15.343 13.7l1.243 1.243A11.227 11.227 0 0 0 20.25 12S16.5 4.5 9 4.5c-1.03 0-2.004.15-2.917.426l1.22 1.22A11.34 11.34 0 0 1 12 6.75Z"/></svg>
              ) : (
                // eye
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 4.5C4.5 4.5.75 12 .75 12S4.5 19.5 12 19.5 23.25 12 23.25 12 19.5 4.5 12 4.5Zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"/></svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        {isSignUp && (
          <>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validate}
                required
                autoComplete="new-password"
                className={`w-full px-3 py-2 border text-neutral-800 rounded-md focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-200'}`}
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </>
        )}

        {formError && (
          <div role="alert" className="text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded-md">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isValid}
          className={`w-full py-2.5 px-4 rounded-md text-white transition ${loading || !isValid ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? (isSignUp ? 'Inscription…' : 'Connexion…') : (isSignUp ? "S'inscrire" : 'Se connecter')}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
        <button
          onClick={() => setIsSignUp((v) => !v)}
          className="text-blue-600 hover:underline"
        >
          {isSignUp ? 'Se connecter' : "S'inscrire"}
        </button>
      </p>
    </div>
  );
}
