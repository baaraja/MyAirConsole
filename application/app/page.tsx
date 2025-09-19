import LandingNavbar from "@/components/LandingNavbar";
import Beams from "@/components/Beams";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { ModernFooter } from "@/components/modern-footer";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#0f051a] to-black text-white overflow-hidden">
      {/* Full page beams background - extended to cover entire page */}
      <div className="fixed inset-0 z-0 w-screen h-screen">
        <Beams
          beamWidth={8}
          beamHeight={60}
          beamNumber={16}
          lightColor="#C174F2"
          speed={1.2}
          noiseIntensity={0.6}
          scale={0.08}
          rotation={45}
        />
      </div>

      {/* Additional beams layer for more density */}
      <div className="fixed inset-0 z-0 w-screen h-screen opacity-30">
        <Beams
          beamWidth={4}
          beamHeight={80}
          beamNumber={12}
          lightColor="#F18585"
          speed={0.8}
          noiseIntensity={0.4}
          scale={0.12}
          rotation={-30}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <LandingNavbar />

        {/* Hero Section */}
        <section className="relative flex items-center justify-center min-h-screen px-6">
          {/* Spotlight overlay */}
          <Spotlight />

          <div className="relative z-20 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-5 text-white drop-shadow-2xl">
              Bienvenue sur notre
              <span className="block bg-gradient-to-r from-[#F18585] via-[#F49C9C] to-[#C174F2] bg-clip-text text-transparent">
                Console en ligne
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#F8CACF] mb-7 max-w-2xl mx-auto drop-shadow-[0_0_18px_rgba(241,133,133,0.35)]">
              Nous vous proposons une gamme variée de jeux multijoueurs et solo, accessibles directement depuis votre navigateur et jouable depuis votre téléphone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default" 
                size="lg" 
                className="px-8 bg-gradient-to-r from-[#F18585] to-[#F49C9C] hover:from-[#F49C9C] hover:to-[#F6AEAE] text-white font-semibold shadow-lg hover:shadow-[#F18585]/25 transition-all duration-300"
              >
                Voir le catalogue
              </Button>
              <LiquidButton 
                variant="glass" 
                size="lg" 
                className="rounded-full px-8 gap-2 bg-gradient-to-r from-[#C174F2]/20 to-[#D5A8F2]/20 border border-[#CB90F1]/30 text-[#EED5FB] hover:bg-gradient-to-r hover:from-[#CB90F1]/30 hover:to-[#E4BEF8]/30 transition-all duration-300"
              >
                Commencer à jouer
                <ArrowRight className="size-4" />
              </LiquidButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <ModernFooter />
      </div>
    </div>
  );
}