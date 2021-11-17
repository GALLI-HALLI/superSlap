module.exports = class Room {
  constructor(code, readerId) {
    this.code = code;
    this.players = [];
    this.id = readerId;
  }

  addPlayer(id) {
    let player = {
      id: id,
      // username: username//닉네임 어디서 해야할지 모르겠다
    };
    this.players.push(player);
  }
};
