const gameList = ["none", "bomb", "pencil"];

const GameStatus = {
  Idle: "Idle",
  Started: "Started",
  Ended: "Ended",
};

module.exports = class Room {
  constructor(code, leaderId) {
    this.code = code;
    this.players = [];
    this.id = leaderId;
    this.game = gameList[0]; //게임 시작되면 game명으로 바꾸기
    this.gameStatus = GameStatus.Idle;
    this.startTime = null;
    this.gameInstance = null;
  }

  addPlayer(id, nickname) {
    let player = {
      //게임이 시작되면 게임 정보를 여기다가 추가해야되나..
      id: id, //userId
      nickname: nickname,
    };
    this.players.push(player);
  }

  removePlayer(id) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        this.players.splice(i, 1);
        break;
      }
    }
  }

  startGame(type) {
    this.gameStatus = GameStatus.Started;
    this.game = gameList[type];
    this.startTime = Date.now();
  }
};
