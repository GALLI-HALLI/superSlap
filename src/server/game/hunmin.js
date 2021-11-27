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

class Hunmin extends Game {
  constructor(room) {
    super(room);
    this.playerSeq = [];
    this.len = 0;
    this.turn = -1;
    this.nowWord = "";
    this.wordList = [];
    this.finish = false;
  }

  start() {
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
        seq: i,
      });
    }
    this.getRoomSocket().emit("suggestInitial", suggest);

    this.nextTurn();
    this.getRoomSocket().emit("nextTurn", this.turn);

    setTimeout(() => {
      if (this.finish) return;
      let loser = this.playerSeq[this.turn % this.len][0];
      this.getRoomSocket().emit(socketEvent.gameEnd, loser);
      this.comebackRoom(loser);
    }, 100000);
  }

  disconnect(id) {
    if (this.room.players[id]) {
      this.leftGame(id);
    }
    this.getRoomSocket().emit("leave_user", id);
  }

  joinGame(id) {
    this.playerSeq.push([id, Math.random()]);
  }

  leftGame(id) {
    for (let i = 0; i < this.len; i++) {
      if (this.playerSeq[i][0] === id) {
        // this.playerSeq.splice(i,1);
        this.playerSeq[i] = false;
        this.nextTurn();
        this.getRoomSocket().emit("nextTurn", this.turn);
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
    if (word.length !== 2) return [false, wrongReason.length];
    if (this.wordList.includes(word)) return [false, wrongReason.already];
    let initial =
      this.getInitialConstant(word[0]) + this.getInitialConstant(word[1]);
    if (initial !== this.nowWord) return [false, wrongReason.initial];
    request.get(addr + encodeURI(word), (err, resoponse, body) => {
      if (err) {
        console.log(err);
      }
      if (body) {
        return [true, ""];
      } else {
        return [false, wrongReason.word];
      }
    });
    return [true, ""];
  }

  nextTurn() {
    let cnt = 0;
    do {
      this.turn++;
      cnt++;
    } while (!this.playerSeq[this.turn % this.len] && cnt <= this.len);
    let now = this.turn;
    setTimeout(() => {
      if (now !== this.turn) return;
      this.finish = true;
      let loser = this.playerSeq[this.turn % this.len][0];
      this.getRoomSocket().emit(socketEvent.gameEnd, loser);
      this.comebackRoom(loser);
    }, 50000);
  }

  initializeSocketEvents(id, socket) {
    console.log(socket + " is entered");

    this.joinGame(id);

    socket.on("word", async (data) => {
      let result = await this.checkWord(data);
      if (result[0]) {
        this.wordList.push(data);
        this.nextTurn(data);
        this.getRoomSocket().emit("pass", {
          turn: this.turn % this.len,
          word: data,
        });
      } else {
        this.getRoomSocket().emit("fail", result[1]);
      }
    });
  }
}

module.exports = Hunmin;
