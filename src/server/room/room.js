module.exports = class Room {
  constructor(code, readerId) {
    this.code = code;
    this.players = [];
    this.id = readerId;
  }
};
