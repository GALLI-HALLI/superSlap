const checkAuth = require("../middleware/checkAuth");

const lobby = require("./lobby");
const roomManager = lobby.roomManager;

const userConnect = (socket, gameSocket) => {
  let room;
  let id;
  let name;
  socket.on("enter", async (code, token) => {
    if (!roomManager.hasRoom(code)) {
      socket.emit("noRoom");
    } else {
      room = roomManager.rooms.get(code);
      let user = await checkAuth.tokenToUser(token);
      id = user.id;
      name = user.name;
      room.addPlayer(id, name);
      socket.join(code);
      gameSocket
        .in(code)
        .emit("member", room.id, Array.from(room.players.keys()));
    }
  });

  socket.on("disconnect", () => {
    gameSocket
      .in(room.code)
      .emit("member", room.id, Array.from(room.players.keys()));
    if (room) {
      room.removePlayer(id);
      if (id === room.id) {
        roomManager.destroyRoom(room.code);
      }
    }
  });
};

module.exports = userConnect;
