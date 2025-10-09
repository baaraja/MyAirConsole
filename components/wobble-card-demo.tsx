"use client";

import React from "react";
import { WobbleCard } from "./ui/wobble-card";
import { Globe } from "./magicui/globe";

const Noise = () => {
  return (
    <div className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 bg-noise"></div>
  );
};

const TextureNoise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-30"
      style={{
        backgroundImage: "url(/noise-texture.jpg)",
        backgroundSize: "400px 400px",
        backgroundRepeat: "repeat",
      }}
    ></div>
  );
};

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-5xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-black/20 backdrop-blur-md border border-gray-700/20 min-h-[300px] lg:min-h-[250px]"
        className=""
      >
        <Noise />
        <div className="max-w-xs relative z-10">
          <h2 className="text-left text-balance text-base md:text-lg lg:text-xl font-semibold tracking-[-0.015em] text-white">
            EcoTech révolutionne l'agriculture durable
          </h2>
          <p className="mt-3 text-left text-sm/5 text-gray-200">
            Solutions IoT intelligentes pour une agriculture respectueuse de l'environnement. Série A réussie avec 5M€ levés.
          </p>
          <span className="inline-block bg-gray-700/30 backdrop-blur text-gray-200 text-xs px-2 py-1 rounded mt-3">
            Série A • Environnement
          </span>
        </div>
        
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[250px] bg-black/20 backdrop-blur-md border border-gray-700/20">
        <Noise />
        <h2 className="max-w-80 text-left text-balance text-base md:text-lg lg:text-xl font-semibold tracking-[-0.015em] text-white relative z-10">
          HealthAI : IA médicale précise
        </h2>
        <p className="mt-3 max-w-[20rem] text-left text-sm/5 text-gray-200 relative z-10">
          Diagnostic médical précoce grâce à l'intelligence artificielle. Révolutionnons la santé ensemble.
        </p>
        <span className="inline-block bg-gray-700/30 backdrop-blur text-gray-200 text-xs px-2 py-1 rounded mt-3 relative z-10">
          Seed • Santé
        </span>
        
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-black/20 backdrop-blur-md border border-gray-700/20 min-h-[300px] lg:min-h-[400px] xl:min-h-[250px] overflow-hidden">
        <TextureNoise />
        <div className="max-w-sm relative z-10">
          <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-lg lg:text-xl font-semibold tracking-[-0.015em] text-white">
            FinanceBot : Assistant financier intelligent pour PME
          </h2>
          <p className="mt-3 max-w-[24rem] text-left text-sm/5 text-gray-200">
            Automatisez votre gestion financière avec notre IA spécialisée. Accompagnement personnalisé pour entrepreneurs.
          </p>
          <span className="inline-block bg-gray-700/30 backdrop-blur text-gray-200 text-xs px-2 py-1 rounded mt-3">
            Pré-seed • Fintech
          </span>
        </div>
        <div className="absolute -right-24 -bottom-24 w-64 h-64">
          <Globe className="w-full h-full" />
        </div>
      </WobbleCard>
    </div>
  );
}
