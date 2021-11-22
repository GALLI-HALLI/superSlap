const checkAuth = require("../middleware/checkAuth");

const lobby = require("./lobby");
const roomManager = lobby.roomManager;

const send = (gameSocket, room, code) => {
  gameSocket.in(code).emit("metadata", room);
};

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
      send(gameSocket, room, code);
    }
  });

  socket.on("disconnect", () => {
    if (room) {
      room.removePlayer(id);
      if (id === room.id) {
        roomManager.destroyRoom(room.code);
      }
    }
    send(gameSocket, room, room.code);
  });

  socket.on("gameStart", (gameNum) => {
    room.startGame(gameNum);
    send(gameSocket, room, room.code);
  });
};

module.exports = userConnect;
