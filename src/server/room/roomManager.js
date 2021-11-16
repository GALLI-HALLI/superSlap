const Room = require("./room.js");

module.exports = class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(code, id) {
    this.rooms.set(code, new Room(code, id));
  }

  hasRoom(code) {
    if (this.rooms.has(code)) {
      return false;
    } else {
      return true;
    }
  }
};
