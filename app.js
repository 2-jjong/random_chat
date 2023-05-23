const express = require('express'); // express 모듈 불러오기
const socket = require('socket.io'); // socket.io 모듈 불러오기
const http = require('http'); // Node.js 기본 내장 모듈 http 불러오기
const fs = require('fs'); // Nodes.js 기본 내장 모듈 fs 불러오기(파일과 관련된 처리하는 모듈)

const app = express(); // express 객체 생성

const server = http.createServer(app); // express http 서버 생성

const io = socket(server); // 생성된 서버를 socket.io에 바인딩

app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

// 서버에 Get방식으로 접속하면 실행
app.get('/', function(request, response){
    fs.readFile('./static/index.html', function(err, data){
        if(err){
            response.send('에러');
        } else{
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write(data);
            response.end();
        }
    })
})

io.sockets.on('connection', function(socket){
    socket.on('newUser', function(name){ // 새로운 유저가 접속했을 경우 다른 소켓에게도 알림
        console.log(name + '님이 접속하였습니다.');

        socket.name = name; // 소켓에 이름 저장

        // 모든 소켓에게 전송
        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'});
    })

    // 전송한 메시지 받기
    socket.on('message', function(data){
        data.name = socket.name; // 받은 데이터에 누가 보냈는지 이름 추가

        console.log(data);

        io.sockets.emit('update', data); // 모든 소켓에게 메시지 전송
    })

    // 접속 종료
    socket.on('disconnect', function(){
        console.log(socket.name + '님이 나가셨습니다.');

        // 나가는 사람을 제외한 모든 유저에게 메시지 전송
        socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
    })
})

server.listen(8080, function() {console.log('서버 실행 중...')}); // 서버를 8080포트로 설정, 서버 접속 시 출력