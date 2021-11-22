const Room = require("./room.js");

module.exports = class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(code, id, gameSocket) {
    // 방을만들때 방에 있는 인원에게 전체 소켓을 관리하는 소켓 인스턴스를 전달한다.
    // 방에있는 인원에게 메시지를 보내주기 위해서.
    this.rooms.set(code, new Room(code, id, gameSocket));
  }

  hasRoom(code) {
    return this.rooms.has(code);
  }

  destroyRoom(code) {
    const room = this.rooms.get(code);
    room.destroy();
    this.rooms.delete(code);
  }
};
