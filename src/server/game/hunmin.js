const Game = require("./game");
const socketEvent = require("../constants/socketEvents");
const request = require("request");

const key = process.env.DICTIONARY_KEY;
const addr =
  "https://stdict.korean.go.kr/api/search.do?key=" + key + "&req_type=json&q=";

const consonants = [
  "ㄱ",
  "ㄴ",
  "ㄷ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅅ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const wrongReason = {
  length: "글자 수를 맞춰주세요",
  already: "이미 사용한 단어입니다",
  initial: "초성이 맞지 않습니다",
  word: "표준대국어사전에 없는 단어입니다",
};

//*추가
const SECOND = 1000;

const GAME_TIME_LIMIT = SECOND * 100;
const TURN_TIME_LIMIT = SECOND * 10;
//*

class Hunmin extends Game {
  constructor(room) {
    super(room);
    this.playerSeq = [];
    this.playerSocket = [];
    this.len = 0;
    this.turn = -1;
    this.nowWord = "";
    this.wordList = [];
    this.finish = false;
  }

  start() {
    setTimeout(() => {
      let suggest =
        consonants[parseInt(Math.random() * 14)] +
        consonants[parseInt(Math.random() * 14)];
      this.nowWord = suggest;
      this.len = this.playerSeq.length;
      this.playerSeq.sort((a, b) => {
        return a[1] - b[1];
      });
      for (let i = 0; i < this.len; i++) {
        this.getRoomSocket().emit("join_user", {
          id: this.playerSeq[i][0],
          nickname: this.playerSeq[i][2],
          seq: i,
        });
      }

      //*변경
      this.getRoomSocket().emit("setInitial", {
        suggest,
        gameTimeLimit: GAME_TIME_LIMIT,
        turnTimeLimit: TURN_TIME_LIMIT,
      });
      //*

      this.nextTurn();

      setTimeout(() => {
        if (this.finish) return;
        this.finish = true;
        this.gameEnd();
      }, GAME_TIME_LIMIT);
    }, 5000);
  }

  end() {
    this.playerSocket.forEach((socket) => {
      socket.removeAllListeners("word");
    });
    this.playerSocket = [];
    this.playerSeq = [];
    this.nowWord = "";
    this.wordList = [];
  }

  gameEnd() {
    let loserId = this.playerSeq[this.turn % this.len][0];
    this.getRoomSocket().emit(socketEvent.gameEnd);
    setTimeout(() => {
      this.comebackRoom({ loserId });
    }, 3 * SECOND);
  }

  disconnect(id) {
    if (this.room.players[id]) {
      this.leftGame(id);
    }
    this.getRoomSocket().emit("leave_user", id);
  }

  joinGame(id, nickname) {
    this.playerSeq.push([id, Math.random(), nickname]);
  }

  leftGame(id) {
    for (let i = 0; i < this.len; i++) {
      if (this.playerSeq[i][0] === id) {
        // this.playerSeq.splice(i,1);
        this.playerSeq[i] = false;
        this.nextTurn();
        break;
      }
    }
  }

  getInitialConstant(kor) {
    const f = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];

    const ga = 44032;
    let uni = kor.charCodeAt(0);

    uni = uni - ga;

    let fn = parseInt(uni / 588);

    return f[fn];
  }

  async checkWord(word) {
    if (word.length !== 2) return [false, wrongReason.length]; //두글자 아닐때
    if (this.wordList.includes(word)) return [false, wrongReason.already]; //이미 나온 단어일 때
    let initial =
      this.getInitialConstant(word[0]) + this.getInitialConstant(word[1]);
    if (initial !== this.nowWord) return [false, wrongReason.initial]; //초성이 맞지 않을 때

    //*수정
    return new Promise((resolve, reject) => {
      request.get(addr + encodeURI(word), (err, response, body) => {
        if (err) {
          console.log(err);
        }
        if (body) {
          resolve([true, JSON.parse(body).channel.item[0].sense.definition]);
        }
        resolve([false, wrongReason.word]);
      });
    });
    //*
  }

  nextTurn() {
    let cnt = 0;
    do {
      this.turn++;
      cnt++;
    } while (!this.playerSeq[this.turn % this.len] && cnt <= this.len);
    let now = this.turn;
    this.getRoomSocket().emit(
      "nextTurn",
      this.playerSeq[this.turn % this.len][0], //순서를 아이디로 보내주세요
    );
    setTimeout(() => {
      if (now !== this.turn) return;
      this.finish = true;
      this.gameEnd();
    }, TURN_TIME_LIMIT);
  }

  initializeSocketEvents(id, socket, nickname) {
    console.log(socket + " is entered");

    this.joinGame(id, nickname);

    socket.on("word", async (data) => {
      let result = await this.checkWord(data.word);
      console.log(result);
      if (this.finish) return;
      if (result[0]) {
        if(this.playerSeq[this.turn%this.len][0] !== data.turn) return;
        this.wordList.push(data.word);
        this.nextTurn();
        this.getRoomSocket().emit("hunminData", {
          success: true,
          nickname: this.playerSeq[this.turn % this.len][2],
          word: data.word,
          mean: result[1],
          msg: "성공이지롱~~~",
        });
        this.nextTurn();
      } else {
        this.getRoomSocket().emit("hunminData", {
          success: false,
          nickname: this.playerSeq[this.turn % this.len][2],
          word: data.word,
          mean: "",
          msg: result[1],
        });
      }
    });
    this.playerSocket.push(socket);
  }
}

module.exports = Hunmin;
