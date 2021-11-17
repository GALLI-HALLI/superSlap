const lobby = require("./lobby");
const Room = require("./room");
let roomManager = lobby.roomManager;

let userConnect = (socket) => {
  let room = new Room();
  socket.on("enter", (code) => {
    room = roomManager.rooms.get(code);
    room.addPlayer(socket.id);
  });
};

module.exports = userConnect;
