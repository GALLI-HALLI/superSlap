const checkAuth = require("../middleware/checkAuth");

const lobby = require("./lobby");
const Room = require("./room");
const roomManager = lobby.roomManager;

const userConnect = (socket) => {
  let room;
  let id;
  let name;
  socket.on("enter", (code, token) => {
    if (!roomManager.hasRoom(code)) {
      socket.emit("noRoom");
    } else {
      room = roomManager.rooms.get(code);
      let user = checkAuth.tokenToUser(token);
      id = user.id;
      name = user.name;
      room.addPlayer(id, name);
      socket.join(code);
    }
  });

  socket.on("disconnect", () => {
    if (room) {
      room.removePlayer(id);
      if (id === room.id) {
        roomManager.destroyRoom(room.code);
      }
    }
  });
};

module.exports = userConnect;
