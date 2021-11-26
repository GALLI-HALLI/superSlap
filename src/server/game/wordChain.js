const Game = require("./game");
const socketEvent = require("../constants/socketEvents");
const request = require('request')

const key = process.env.DICTIONARY_KEY
const addr = "https://stdict.korean.go.kr/api/search.do?key=" + key + "&req_type=json&target=1&q="

class Player{
    constructor(socket, id){
        this.socket = socket;
        this.id = id;
        this.turn = false;

        this.wrongCount = 0;
    }
}

class WordChain extends Game{
    constructor(room) {
        super(room);
        this.players = {};
        this.playerSeq = [];
        this.wordList = [];
    }

    disconnect(id){
        if(this.players[id]){
            this.leftGame(id);
        }
        this.getRoomSocket().emit("leave_user", id);
    }

    joinGame(socket, id){
        let player = new Player(socket, id);
        this.players[id] = player;
        this.playerSeq.push(id);
    }

    leftGame(id){
        for(let i=0; i < this.playerSeq.length; i++){
            if(this.playerSeq[i] === id){
                this.playerSeq.splice(i,1);
                break;
            }
        }
        delete this.players[id];
    }

    checkWord_chain(word){
        if(word.length < 2) return false;
        if(word[0] !== this.wordList[-1][-1]) return false;
        request.get(addr+encodeURI(word),(err, resoponse, body) =>{
            if(err){
                console.log(err);
            }
            if(body) return true;
            return false;
        })
    }

    initializeSocketEvents(id, socket){
        console.log(socket + ' is entered');

        this.joinGame(socket, id);


    }
}

module.exports = WordChain;