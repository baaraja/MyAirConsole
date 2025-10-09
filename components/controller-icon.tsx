'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ControllerIconProps {
  sessionCode?: string;
  className?: string;
  size?: number;
}

export function ControllerIcon({ 
  sessionCode, 
  className = "",
  size = 24 
}: ControllerIconProps) {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (sessionCode) {
      // Aller directement au contrôleur de la session
      router.push(`/sessions/${sessionCode}/controller`);
    } else {
      // Demander le code de session ou aller vers la page de join
      const code = prompt("Code de session pour la manette :");
      if (code && code.trim()) {
        router.push(`/sessions/${code.trim()}/controller`);
      } else {
        router.push("/sessions/join");
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 ${className}`}
        title={sessionCode ? `Contrôleur pour ${sessionCode}` : "Ouvrir contrôleur mobile"}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          {/* Corps principal de la manette */}
          <path
            d="M6 10C6 8.89543 6.89543 8 8 8H16C17.1046 8 18 8.89543 18 10V14C18 15.1046 17.1046 16 16 16H8C6.89543 16 6 15.1046 6 14V10Z"
            fill="currentColor"
          />
          
          {/* Grips latéraux */}
          <path
            d="M4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H6V11H4Z"
            fill="currentColor"
          />
          <path
            d="M20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H18V11H20Z"
            fill="currentColor"
          />
          
          {/* D-Pad (croix directionnelle) */}
          <rect x="8" y="10.5" width="1.5" height="3" fill="white" rx="0.2" />
          <rect x="7.25" y="11.25" width="3" height="1.5" fill="white" rx="0.2" />
          
          {/* Boutons A/B */}
          <circle cx="15" cy="11" r="0.8" fill="white" />
          <circle cx="16.5" cy="12.5" r="0.8" fill="white" />
        </svg>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap z-50">
          {sessionCode ? `Contrôleur ${sessionCode}` : "Ouvrir contrôleur"}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
        </div>
      )}
    </div>
  );
}

export default ControllerIcon;