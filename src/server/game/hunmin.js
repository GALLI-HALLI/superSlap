const Game = require("./game");
const socketEvent = require("../constants/socketEvents");
const request = require('request')

const key = process.env.DICTIONARY_KEY
const addr = "https://stdict.korean.go.kr/api/search.do?key=" + key + "&req_type=json&target=1&q="

const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const wrongReason = {
    length: '글자 수를 맞춰주세요',
    already: '이미 사용한 단어입니다',
    initial: '초성이 맞지 않습니다',
    word: '없는 단어입니다',
}

class Hunmin extends Game{
    constructor(room) {
        super(room);
        this.playerSeq = [];
        this.turn = 0;
        this.nowWord = ''
        this.wordList = [];
    }
    start(){
        let suggest = consonants[parseInt(Math.random()*14)] + consonants[parseInt(Math.random()*14)];
        this.nowWord = suggest
        this.playerSeq.sort((a,b)=>{return a[1]-b[1]});
        this.getRoomSocket().emit('suggestInitial', suggest);

        setTimeout(()=>{
            let loser = this.playerSeq[this.turn];
            this.getRoomSocket().emit(socketEvent.gameEnd, loser);
            this.comebackRoom();
        }, 2000);
    }

    disconnect(id){
        if(this.room.players[id]){
            this.leftGame(id);
        }
        this.getRoomSocket().emit("leave_user", id);
    }

    joinGame(socket, id){
        this.playerSeq.push(id, Math.random())
    }

    leftGame(id){
        for(let i=0; i < this.playerSeq.length; i++){
            if(this.playerSeq[i][0] === id){
                // this.playerSeq.splice(i,1);
                this.playerSeq[i] = false;
                break;
            }
        }
    }

    getInitialConstant(kor) {
        const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
                   'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
                   'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    
        const ga = 44032;
        let uni = kor.charCodeAt(0);
    
        uni = uni - ga;
    
        let fn = parseInt(uni / 588);
    
        return f[fn]
    }

    checkWord(word){
        if(word.length !== 2) return [false, wrongReason.length];
        if(this.wordList.includes(word)) return [false, wrongReason.already];
        let initial = this.getInitialConstant(word[0]) + this.getInitialConstant(word[1]) 
        if(initial !== this.nowWord) return [false, wrongReason.initial];
        request.get(addr+encodeURI(word),(err, resoponse, body) =>{
            if(err){
                console.log(err);
            }
            if(body) return [true, ''];
            return [false, wrongReason.word];
        })
    }

    initializeSocketEvents(id, socket){
        console.log(socket + ' is entered');

        this.joinGame(socket, id);

        socket.on('word', data=>{
            let result = this.checkWord(data)
            if(result[0]){
                this.wordList.push(data)
                
                if(this.turn < this.playerSeq.length - 1){
                    this.turn++
                }else{
                    this.turn = 0;
                }
                while(!this.playerSeq[this.turn]){
                    if(this.turn < this.playerSeq.length - 1){
                        this.turn++
                    }else{
                        this.turn = 0;
                    }   
                }
                this.getRoomSocket.emit('pass',this.turn);
            }else{
                this.getRoomSocket.emit('fail', result[1])
            }
        })
    }
}

module.exports = Hunmin;