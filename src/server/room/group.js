const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const lobby = require("./lobby");
const Room = require("./room");
let roomManager = lobby.roomManager;

let TokenToInfo = async (token) => {
  //현재 토큰에는 id만 들어있지만 곧 수정 예정
  try {
    let user = await JWT.verify(token, process.env.JWT_KEY);
    return user;
  } catch (error) {
    return false; //false일때 어떻게 처리해야할 지 생각해봐야할듯
  }
};

let userConnect = (socket) => {
  let room = new Room();
  let id;
  let name;
  socket.on("enter", (code, token) => {
    room = roomManager.rooms.get(code);
    let user = TokenToInfo(token);
    id = user.id;
    name = user.name;
    room.addPlayer(id, name);
    socket.join(code);
  });

  socket.on("disconnect", () => {
    room.removePlayer(id);
    if (id === room.id) {
      roomManager.destroyRoom(room.code);
    }
  });
};

module.exports = userConnect;
