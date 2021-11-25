const Game = require("./game");
const socketEvent = require("../constants/socketEvents");

const key = process.env.DICTIONARY_KEY

console.log(key)

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
        this.players = {}
    }

    joinGame(socket, id){
        let player = new Player(socket, id);
        this.players[id] = player;
    }

    initializeSocketEvents(id, socket){
        console.log(socket + ' is entered');

        this.joinGame(socket, id);
    }
}