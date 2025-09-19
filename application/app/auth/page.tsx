import { LoginForm } from "@/components/auth/login-form";
import { Spotlight } from "@/components/ui/spotlight";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-neutral-900 relative overflow-hidden">
      {/* Spotlight effects */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(255, 255, 255, 0.1)"
      />
      <Spotlight
        className="h-screen top-10 left-full transform -translate-x-1/2"
        fill="rgba(255, 255, 255, 0.05)"
      />
      
      {/* Background noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-neutral-900 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-6">
        <div className="w-full max-w-xs">
          {/* Glass morphism container */}
          <div className="backdrop-blur-xl bg-neutral-800/20 border border-neutral-700/50 rounded-xl p-4 shadow-2xl">
            <LoginForm />
          </div>
        </div>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
    </div>
  );
}
