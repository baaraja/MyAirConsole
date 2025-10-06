'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSocket } from "@/lib/socket";

export default function ControllerPage() {
  const params = useParams();
  const code = params?.code || "";
  const [socket, setSocket] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = getSocket();
    setSocket(s);
    if (code) {
      s.emit('joinSession', code);
      setConnected(true);
    }
    return () => {
      if (s) s.disconnect();
    };
  }, [code]);

  const sendInput = (direction: string) => {
    if (socket && code) {
      socket.emit('controller_input', { code, direction });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Manette</h1>
      {!connected && <p>Connexion à la session...</p>}
      {connected && (
        <div className="relative w-64 h-64">
          <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {/* Haut */}
            <button
              onClick={() => sendInput("up")}
              className="absolute w-70 h-20 bg-purple-900 flex items-center justify-center"
              style={{
                clipPath: 'polygon(6% 0%, 94% 0%, 65% 100%, 35% 100%)',
                borderTopLeftRadius: '50%',
                borderTopRightRadius: '50%',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'white',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                }}
              />
            </button>
            {/* Droite */}
            <button
              onClick={() => sendInput("right")}
              className="absolute w-20 h-70 bg-purple-900 flex items-center justify-center"
              style={{
                clipPath: 'polygon(0% 35%, 0% 65%, 100% 94%, 100% 6%)',
                borderTopRightRadius: '50%',
                borderBottomRightRadius: '50%',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'white',
                  clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
                }}
              />
            </button>
            {/* Bas */}
            <button
              onClick={() => sendInput("down")}
              className="absolute w-70 h-20 bg-purple-900 flex items-center justify-center"
              style={{
                clipPath: 'polygon(35% 0%, 65% 0%, 94% 100%, 6% 100%)',
                borderBottomLeftRadius: '50%',
                borderBottomRightRadius: '50%',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'white',
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                }}
              />
            </button>
            {/* Gauche */}
            <button
              onClick={() => sendInput("left")}
              className="absolute w-20 h-70 bg-purple-900 flex items-center justify-center"
              style={{
                clipPath: 'polygon(0% 6%, 0% 94%, 100% 65%, 100% 35%)',
                borderTopLeftRadius: '50%',
                borderBottomLeftRadius: '50%',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'white',
                  clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)',
                }}
              />
            </button>
            {/* Centre */}
            <button
              onClick={() => sendInput("action")}
              className="absolute w-20 h-20 bg-purple-850 rounded top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold shadow-lg z-20"
            >
              ACTION
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
