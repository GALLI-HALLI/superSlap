let ballSeq = [false, false, false, false, false, false, false, false]
let ballColor = ['red','blue','green','yellow','orange','purple','white','hotpink'] //8 color setting
let gameStart = false;
let startTime;

class PlayerBall{
    constructor(socket){
        this.socket = socket;
        this.seq;
        this.x = 0;
        this.y = 0;
        this.color = ballColor[0];
        this.bomb = false;
    }
    
    get id() {
        return this.socket.id;
    }
}

let balls = [];
let ballMap = {};

function joinGame(socket){
    let ball = new PlayerBall(socket);
    for(let i=0; i<8; i++){
        if(ballSeq[i] === false){
            ball.seq = i;
            ballSeq[i] = true;
            break
        }
    }
    let seq = ball.seq;
    ball.x = 140 + 80*(seq%2);
    ball.y = 100 + 100*parseInt(seq/2);
    ball.color = ballColor[seq];
    if(seq === 0)
        ball.bomb = true

    balls.push(ball);
    ballMap[socket.id] = ball;

    return ball;
}

function leftGame(socket){
    for(let i=0; i<balls.length; i++){
        if(balls[i].id === socket.id){
            balls.splice(i,1);
            break
        }
    }
    ballSeq[ballMap[socket.id].seq] = false
    delete ballMap[socket.id];
}

module.exports = (io, socket) => {
    console.log(`${socket.id} is entered ${Date()}`);

    //연결 종료시 작업
    socket.on('disconnect', (reason)=>{
        console.log(socket.id + ' has left because of ' + reason + ' ' + Date());
        leftGame(socket);
        socket.broadcast.emit('leave_user', socket.id); //떠날 때 socket.id 값 송신
    })

    //게임에 필요한 ball생성 작업
    let newBall = joinGame(socket);
    socket.emit('user_id', socket.id); //접속한 socket.id 송신

    //생성된 ball들의 기초 정보 전송
    for(let i=0; i < balls.length; i++){
        let ball = balls[i];
        socket.emit('join_user',{
            id: ball.id,
            x: ball.x,
            y: ball.y,
            color: ball.color,
            bomb: ball.bomb,
        });
    }
    socket.broadcast.emit('join_user',{
        id: newBall.id,
        x: newBall.x,
        y: newBall.y,
        color: newBall.color,
        bomb: newBall.bomb,
    })

    //게임시작 신호를 받으면
    socket.on('game_start', data => {
        gameStart = true;
        startTime = Date.now()/1000 + 60;
        //게임종료 신호
        setTimeout(function(){
            gameStart = false;
            let loser;
            for(let i=0; i<balls.length;i++){
                if(balls[i].bomb === true){
                    loser = balls[i].id;
                    break;
                }
            }
            let color = ballMap[loser].color;
            io.emit('game_end',{loser, color});
        }, 30000) //게임시작 30초 후 종료
    })

    socket.on('timer', data=>{
        let timer = startTime - Date.now()/1000;
    })

    
    //업데이트된 위치 정보 받아서
    socket.on('send_location', data =>{
            if(gameStart){ //게임시작 여부 판별
            let info = ballMap[data.id]
            info.x = data.x
            info.y = data.y
            //각 클라이언트로 위치 정보 전송
            io.emit('update_state',{
                id: data.id,
                x: info.x,
                y: info.y,
                bomb: info.bomb,
            })
        }
    });

        //폭탄 변경 상황 정보 받아서
    socket.on('bomb_change', data =>{
        let send = ballMap[data.send];
        let receive = ballMap[data.receive];
        send.bomb = false;
        receive.bomb = true;
        //폭탄 변경 ball 정보 전송
        io.emit('update_bomb',{
            sid: send.id,
            sbomb: send.bomb,

            rid: receive.id,
            rbomb: receive.bomb,
        })
    })
}