const gameList = {
  none: "none",
  bamb: "bamb",
  pencil: "pencil",
};

module.exports = class Room {
  constructor(code, readerId) {
    this.code = code;
    this.players = new Map();
    this.id = readerId;
    this.game = gameList.none; //게임 시작되면 game명으로 바꾸기
  }

  addPlayer(id, nickname) {
    let player = {
      //게임이 시작되면 게임 정보를 여기다가 추가해야되나..
      id: id, //userId
      nickname: nickname,
    };
    this.players.push(id, player);
  }

  removePlayer(id) {
    this.players.delete(id);
  }
};
