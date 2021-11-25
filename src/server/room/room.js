const { GameList, GameStatus } = require("../constants/game");
const socketEvents = require("../constants/socketEvents");
const BombGame = require("../game/bombGame");
const { sendMetaData } = require("./utils");

const GameMap = {
  [GameList.Bomb]: BombGame,
};

class Room {
  constructor(code, leaderId, gameSocket) {
    this.code = code; // 방코드
    this.players = new Map(); // 게이머 리스트
    this.id = leaderId; // 방장 아이디
    this.type = GameList.None; //게임 시작되면 game명으로 바꾸기
    this.gameStatus = GameStatus.Idle; // 게임의 상태
    this.startTime = null; // 게임 시작시간
    this.gameInstance = null; // 게임 처리 인스턴스
    this.gameSocket = gameSocket; // 게임 소켓
  }

  destroy() {
    sendMetaData(this.gameSocket, this, this.code);
    this.getRoomSocket().emit(socketEvents.roomDestroyed);
  }

  getRoomSocket() {
    return this.gameSocket.in(this.code);
  }

  isStarted() {
    return this.gameStatus === GameStatus.Started;
  }

  // 소켓정보를 주는 이유는 게임인스턴스에 등록하려고
  addPlayer(id, nickname, socket) {
    this.players.set(id, { nickname, socket });
  }

  removePlayer(id) {
    this.players.delete(id);
    if (this.gameStatus === GameStatus.Started) {
      this.gameInstance.disconnect(id);
    }
  }

  startGame(type) {
    this.gameStatus = GameStatus.Started;
    this.type = type;
    this.startTime = Date.now();
    // 방정보를 보내준다.
    this.gameInstance = new GameMap[this.type](this);
    sendMetaData(this.gameSocket, this, this.code);
    // 오브젝트의 값들을 이터레이터로 만들어준다. 그것을 어레이로 만들어준다.
    // 방에 있는 플레이어들을 하나씩 돌면서 플레이어들의 소켓 인스턴스에 게임에서 설계한 소켓 로직들을 붙여준다.
    Array.from(this.players).forEach(([ key, value ]) => {
      this.gameInstance.initializeSocketEvents(key, value.socket);
    });
    this.gameInstance.start();
  }

  comebackRoom = () => {
    this.gameStatus = GameStatus.Idle;
    sendMetaData(this.gameSocket, this, this.code);
  };
}

module.exports = Room;
