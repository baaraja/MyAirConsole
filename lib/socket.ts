import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') {
      // Côté serveur, utiliser une URL par défaut
      return null as any;
    }
    
    // En production, utiliser le serveur Render
    // En développement, utiliser le serveur local
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? "https://myairconsole.onrender.com"  // Remplacez par votre URL Render
      : "http://localhost:4000";
    
    socket = io(socketUrl);
  }
  return socket;
};
