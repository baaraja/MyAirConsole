"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  speakers: string;
  image: string;
  ctaText: string;
  content: () => React.ReactNode;
}

const events: Event[] = [
  {
    title: "Workshop : Lever des fonds",
    date: "22 Déc 2024",
    time: "14h00",
    location: "Paris",
    description: "Masterclass avec 3 VCs reconnus",
    speakers: "3 VCs reconnus",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    ctaText: "S'inscrire",
    content: () => (
      <div className="space-y-4">
        <p>
          Rejoignez notre workshop exclusif sur la levée de fonds avec trois investisseurs de renom. 
          Apprenez les secrets d'une levée réussie, de la préparation du pitch à la négociation.
        </p>
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Programme :</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>14h00 - 15h00 : Préparer son pitch deck</li>
            <li>15h00 - 16h00 : Valorisation et négociation</li>
            <li>16h00 - 17h00 : Q&A avec les VCs</li>
            <li>17h00 - 18h00 : Networking</li>
          </ul>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm"><strong>Prérequis :</strong> Avoir un projet en phase de développement</p>
          <p className="text-sm"><strong>Places limitées :</strong> 30 participants</p>
        </div>
      </div>
    ),
  },
  {
    title: "Networking Startups x Investisseurs",
    date: "28 Déc 2024",
    time: "18h30",
    location: "Lyon",
    description: "Soirée networking premium",
    speakers: "50+ participants",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
    ctaText: "S'inscrire",
    content: () => (
      <div className="space-y-4">
        <p>
          Une soirée exclusive pour connecter entrepreneurs et investisseurs dans un cadre convivial. 
          L'occasion parfaite pour présenter votre projet et rencontrer votre futur partenaire financier.
        </p>
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Au programme :</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>18h30 - 19h00 : Accueil et cocktail</li>
            <li>19h00 - 20h00 : Pitchs flash (2 min par startup)</li>
            <li>20h00 - 22h00 : Networking libre</li>
            <li>22h00 - 23h00 : After-party</li>
          </ul>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm"><strong>Dress code :</strong> Business casual</p>
          <p className="text-sm"><strong>Participation :</strong> Sur sélection de dossier</p>
        </div>
      </div>
    ),
  },
  {
    title: "Bootcamp Entrepreneuriat",
    date: "5 Jan 2025",
    time: "9h00",
    location: "Marseille",
    description: "Formation intensive de 3 jours",
    speakers: "Formation intensive 3 jours",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    ctaText: "S'inscrire",
    content: () => (
      <div className="space-y-4">
        <p>
          Un bootcamp complet de 3 jours pour transformer votre idée en business model viable. 
          De la validation du concept au lancement, tous les aspects de l'entrepreneuriat seront abordés.
        </p>
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Programme détaillé :</h4>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-white">Jour 1 - Idéation & Validation</p>
              <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                <li>Design thinking et créativité</li>
                <li>Étude de marché express</li>
                <li>Validation du concept</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white">Jour 2 - Business Model & Stratégie</p>
              <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                <li>Business Model Canvas</li>
                <li>Stratégie commerciale</li>
                <li>Pricing et positionnement</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-white">Jour 3 - Pitch & Financement</p>
              <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                <li>Construction du pitch</li>
                <li>Préparation à la levée de fonds</li>
                <li>Pitch final devant jury</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm"><strong>Prix :</strong> 299€ (repas inclus)</p>
          <p className="text-sm"><strong>Certification :</strong> Attestation de formation délivrée</p>
        </div>
      </div>
    ),
  },
];

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export function ExpandableEventsDemo() {
  const [active, setActive] = useState<Event | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.style.overflow = "auto";
      document.body.classList.remove("modal-open");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md h-full w-full z-[998]"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[999]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[700px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-neutral-900/95 backdrop-blur-lg border border-neutral-700/50 sm:rounded-2xl overflow-hidden shadow-2xl"
            >
              <motion.div layoutId={`image-${active.title}-${id}`} className="relative">
                <img
                  width={700}
                  height={300}
                  src={active.image}
                  alt={active.title}
                  className="w-full h-64 lg:h-64 sm:rounded-tr-2xl sm:rounded-tl-2xl object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <motion.h3
                    layoutId={`title-${active.title}-${id}`}
                    className="font-bold text-2xl mb-1"
                  >
                    {active.title}
                  </motion.h3>
                  <div className="flex items-center gap-4 text-neutral-200 text-sm">
                    <span>📅 {active.date}</span>
                    <span>⏰ {active.time}</span>
                    <span>📍 {active.location}</span>
                  </div>
                </div>
              </motion.div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <motion.p
                    layoutId={`description-${active.description}-${id}`}
                    className="text-neutral-300 text-base"
                  >
                    {active.description}
                  </motion.p>

                  <motion.button
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-4 px-6 py-3 text-sm rounded-full font-semibold bg-white text-black hover:bg-neutral-200 transition-colors"
                  >
                    {active.ctaText}
                  </motion.button>
                </div>
                
                <div className="relative">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-300 text-sm max-h-80 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {active.content()}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      
      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            layoutId={`card-${event.title}-${id}`}
            key={event.title}
            onClick={() => setActive(event)}
            className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-xl p-4 hover:bg-neutral-800/40 hover:border-neutral-700/50 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              {/* Event Image/Icon */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-700 to-neutral-800 flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              
              {/* Event Info */}
              <div className="flex-1 min-w-0">
                <motion.h3
                  layoutId={`title-${event.title}-${id}`}
                  className="text-lg font-semibold text-white group-hover:text-neutral-200 truncate"
                >
                  {event.title}
                </motion.h3>
                <div className="flex items-center gap-3 text-neutral-400 text-sm mt-1">
                  <span>{event.date}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-neutral-400">{event.time}</p>
                  <p className="text-xs text-neutral-500">{event.speakers}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(event);
                  }}
                  className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors"
                >
                  Détails
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
