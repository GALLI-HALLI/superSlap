const checkAuth = require("../middleware/checkAuth");

const lobby = require("./lobby");
const socketEvents = require("../constants/socketEvents");
const { sendMetaData } = require("./utils");
const roomManager = lobby.roomManager;

module.exports = (socket, gameSocket) => {
  let room;
  let id;
  let name;
  socket.on(socketEvents.enter, async (code, token) => {
    if (!roomManager.hasRoom(code)) {
      socket.emit("noRoom"); // => 여기서도 메인으로
    } else {
      room = roomManager.rooms.get(code);

      if (room.isStarted()) {
        socket.emit("gameAlreadyStarted"); // 여기서도 메인으로
        return; // 게임
      }

      let user = await checkAuth.tokenToUser(token);
      id = user.id;
      name = user.name;
      room.addPlayer(id, name, socket);
      socket.join(code);
      sendMetaData(gameSocket, room, code);
    }
  });

  // 연결이 해제되었을때 방장이 나갔는지 체크하고 나갔다면 방을 없앤다.
  socket.on(socketEvents.disconnect, (reason) => {
    console.log(socket.id + " has left because of " + reason + " " + Date());
    if (room) {
      room.removePlayer(id);
      if (id === room.id) {
        roomManager.destroyRoom(room.code);
      }
    }
    sendMetaData(gameSocket, room, room.code);
  });

  // 게임시작시 게임시작했다고 정보를 바꿔준다.
  socket.on(socketEvents.gameStart, (type) => {
    room.startGame(type);
    sendMetaData(gameSocket, room, room.code);
  });
};
