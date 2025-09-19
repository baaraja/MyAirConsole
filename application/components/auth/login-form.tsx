"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface LoginFormProps extends React.ComponentProps<"div"> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  
  const searchParams = useSearchParams();
  const isRoleUpdated = searchParams.get('message') === 'role-updated';

  // Restore email from localStorage if coming from onboarding
  useEffect(() => {
    if (isRoleUpdated) {
      const savedEmail = localStorage.getItem('onboardingEmail');
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }));
      }
    }
  }, [isRoleUpdated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Handle signup via API
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de l\'inscription');
        }

        // After successful registration, sign in the user
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false
        });

        if (signInResult?.error) {
          alert("Compte créé avec succès ! Veuillez vous connecter.");
        } else {
          window.location.href = "/profile";
        }
      } else {
        // Handle signin with credentials
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false
        });
        
        if (result?.error) {
          console.error("Login error:", result.error);
          alert("Erreur de connexion: Email ou mot de passe incorrect");
        } else {
          // Handle redirection after role update
          if (isRoleUpdated) {
            const redirectTo = localStorage.getItem('postLoginRedirect') || '/profile';
            // Clean up localStorage
            localStorage.removeItem('onboardingEmail');
            localStorage.removeItem('postLoginRedirect');
            window.location.href = redirectTo;
          } else {
            // Normal redirect to profile
            window.location.href = "/profile";
          }
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSignIn = async (providerId: string) => {
    setIsLoading(true);
    try {
      const callbackUrl = isRoleUpdated 
        ? (localStorage.getItem('postLoginRedirect') || "/profile")
        : "/profile";
      
      // Clean up localStorage if coming from onboarding
      if (isRoleUpdated) {
        localStorage.removeItem('onboardingEmail');
        localStorage.removeItem('postLoginRedirect');
      }
      
      await signIn(providerId, { callbackUrl });
    } catch (error) {
      console.error("Provider signin error:", error);
      alert("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <Link 
          href="/"
          className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors mb-1"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="text-xs">Retour</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-white to-neutral-300 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xs">AC</span>
          </div>
          <h1 className="text-lg font-bold text-white">MyAirConsole</h1>
        </div>
        
        <div className="text-center">
          <h2 className="text-base font-semibold text-white mb-1">
            {isRoleUpdated ? "Reconnexion requise" : (isSignUp ? "Créer compte" : "Connexion")}
          </h2>
          <p className="text-neutral-400 text-xs leading-tight">
            {isRoleUpdated 
              ? "Votre rôle a été mis à jour, reconnectez-vous"
              : (isSignUp 
                ? "Rejoignez notre écosystème"
                : "Accédez à votre profil"
              )
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name field for signup */}
        {isSignUp && (
          <div className="space-y-1">
            <Label htmlFor="name" className="text-white text-xs font-medium">
              Nom complet
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="bg-neutral-800/50 border-neutral-600/50 text-white placeholder-neutral-400 focus:border-white/50 focus:ring-1 focus:ring-white/20 h-8 text-xs"
            />
          </div>
        )}

        {/* Email field */}
        <div className="space-y-1">
          <Label htmlFor="email" className="text-white text-xs font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-neutral-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@exemple.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-neutral-800/50 border-neutral-600/50 text-white placeholder-neutral-400 focus:border-white/50 focus:ring-1 focus:ring-white/20 pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1">
          <Label htmlFor="password" className="text-white text-xs font-medium">
            Mot de passe
          </Label>
          <div className="relative">
            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-neutral-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="bg-neutral-800/50 border-neutral-600/50 text-white placeholder-neutral-400 focus:border-white/50 focus:ring-1 focus:ring-white/20 pl-8 pr-8 h-8 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full bg-white text-black hover:bg-neutral-200 font-semibold py-1 h-8 text-xs"
          disabled={isLoading}
        >
          {isLoading ? "..." : (isSignUp ? "Créer" : "Connexion")}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-neutral-900 px-2 text-neutral-400">Ou avec</span>
        </div>
      </div>

      {/* Social login buttons */}
      <div className="grid gap-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleProviderSignIn("google")}
          disabled={isLoading}
          className="w-full bg-neutral-800/50 border-neutral-600/50 text-white hover:bg-neutral-700/50 hover:border-neutral-500/50 h-8 text-xs"
        >
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
          Google
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => handleProviderSignIn("github")}
          disabled={isLoading}
          className="w-full bg-neutral-800/50 border-neutral-600/50 text-white hover:bg-neutral-700/50 hover:border-neutral-500/50 h-8 text-xs"
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </Button>
      </div>

      {/* Toggle between login/signup - Hide if coming from role update */}
      {!isRoleUpdated && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white hover:text-neutral-300 text-xs font-medium underline underline-offset-4"
          >
            {isSignUp ? "Se connecter" : "Créer un compte"}
          </button>
        </div>
      )}
    </div>
  );
}
