const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const sessions = {};

io.on("connection", (socket) => {
  console.log("Un client est connecté :", socket.id);
  socket.on("joinSession", (code, player) => {
    if (!player || !player.id) {
      console.log("Impossible de rejoindre, player non défini !");
      return;
    }
    const playerId = player.id;
    const playerName = player.name || `Invité-${playerId.slice(0,4)}`;
    if (!sessions[code]) {
      sessions[code] = { players: [], hostId: null };
    }
    const session = sessions[code];
    const exists = session.players.some(p => p.id === playerId);
    if (!exists) {
      session.players.push({ id: playerId, name: playerName });
      socket.join(code);
      socket.to(code).emit("player_joined", { id: playerId, name: playerName });
      console.log(`${playerName} rejoint la session ${code}`);
    } else {
      console.log(`${playerName} est déjà dans la session ${code}`);
      socket.join(code);
    }
  });

  socket.on("controller_input", (data) => {
    io.to(data.code).emit("controller_input", data);
  });

  socket.on("leaveSession", (code, playerId) => {
    const session = sessions[code];
    if (!session) return;
    session.players = session.players.filter(p => p.id !== playerId);
    socket.to(code).emit("player_left", playerId);
    socket.leave(code);
    console.log(`${playerId} a quitté la session ${code}`);
  });

  socket.on("disconnect", () => {
    console.log("Client déconnecté :", socket.id);
    // Optionnel : retirer ce socket de toutes les sessions côté serveur
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
