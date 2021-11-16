const Room = require("./room.js");

module.exports = class room_manager {
  constructor() {
    this.rooms = [];
    this.num_rooms = 0;
  }

  createRoom(code, id) {
    if (this.rooms.includes(code)) {
      return false;
    }
    this.rooms.push(new Room(code, id));
    this.num_rooms++;
    return true;
  }
};
