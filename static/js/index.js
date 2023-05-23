var socket = io();

// 접속 되었을 때 실행
socket.on('connect', function(){
    // 이름 입력
    var name = prompt('반갑습니다!', '');

    if(!name){
        name = '익명';
    }

    socket.emit('newUser', name);
})

socket.on('update', function(data){
    console.log(`${data.name}: ${data.message}`);
})

// 전송 함수
function send(){
    // 입력 되어있는 데이터 가져오기
    var message = document.getElementById('talk').value;

    // 가져오고 데이터 다시 빈 데이터로 변경
    document.getElementById('talk').value = '';

    // 서버로 데이터와 함께 send 이벤트 전달
    socket.emit('message', {type: 'message', message: message});
}