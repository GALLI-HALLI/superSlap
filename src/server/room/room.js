module.exports = class room {
  constructor(code, readerId) {
    this.code = code;
    this.players = [];
    this.id = readerId;
  }
};
