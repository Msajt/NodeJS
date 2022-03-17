let readyPlayerCount = 0;

function listen(io){
    //? Definindo um namespace
    const pongNamespace = io.of('/pong');

    //! Socket envia mensagem caso estiver conectado
        //? Também é definido um ID, que é o mesmo do frontend
    pongNamespace.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        let room;
        
        //? Quando houver 2 players conectados, o jogo poderá iniciar
        socket.on('ready', () => {
            //? Definindo um 'room'
                //* Agora é possivel fazer várias janelas com pessoas jogando
            room = 'room' + Math.floor(readyPlayerCount / 2);
            socket.join(room);
            
            console.log('Player ready', socket.id, room);
            
            //* O contador soma +1 a cada jogador conectado
            readyPlayerCount++;

            if(readyPlayerCount % 2 === 0){
                //* Emite sinal de que o game pode iniciar
                pongNamespace.in(room).emit('startGame', socket.id);
            }
        });
    
        //? Sincronizar o movimento dos paddles nos dois clientes
        socket.on('paddleMove', (paddleData) => {
            //* Enviando para o cliente, sem ser o que enviou
            socket.to(room).emit('paddleMove', paddleData);
        });
    
        //? Sincronizando o movimento da bola e pontos
        socket.on('ballMove', (ballData) => {
            //* Enviando para o cliente, sem ser o que enviou
            socket.to(room).emit('ballMove', ballData);
        });
    
        //? Quando o usuário se sair do jogo
        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
            
            //* Determinado usuário sai da sala
            socket.leave(room);
        });
    });
}

//! Exportando função
module.exports = {
    listen,
}