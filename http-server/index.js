//! Requirindo o módulo HTTP
const http = require('http');

//! Setando os PORTS
const PORT = 3000;

//! Criando o server, a função abriga 2 variaveis pro 'request' e 'response'
const server = http.createServer();

//! Variável para abrigar vários amigos de um determinado usuário
const friends = [
    {
        id: 0,
        name: 'Sir Isaac Newton',
    },
    {
        id: 1,
        name: 'Albert Einstein',
    },
    {
        id: 2,
        name: 'Nicola Tesla',
    }
]

//! Transformando em um Event Listener, quando há um 'request'
server.on('request', (req, res) => {
    //! Dividindo a url do request
    const items = req.url.split('/');
    //* /friends/2 => ['', 'friends', '2']

    //! Verificando se a url do request bate
    if(req.method === 'POST' && items[1] === 'friends'){
        req.on('data', data => {
            //? Pegando os dados do amigo adicionado
            const friend = data.toString();
            
            //? Exibindo no console
            console.log('Request: ', friend);

            //? Adicionando no array 'friends'
            friends.push(JSON.parse(friend));
            //TODO Fazendo o método POST no navegador
            //TODO fetch('http://localhost:3000/friends', {
            //TODO      method: 'post',   
            //TODO      body: JSON.stringfy({id: 3, name: 'Ryan Dahl'});   
            //TODO })
        });
        //? Fazendo ligação req -> res
        req.pipe(res);
        //TODO .then((response) => response.json())
        //TODO .then((friend) => console.log(friend));
    }
    else if(req.method === 'GET' && items[1] === 'friends'){
        //? Respondendo com um 'header' do tipo 200 (Successful)
        //? Quando acessar o localhost:300 no browser o servidor irá responder com a mensagem
        // res.writeHead(200, {
        //     //'Content-Type': 'text/plain',
        //     'Content-Type': 'application/json',
        // });

        //? Posso setar o status e o header da página diretamente
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')

        //? Finalizando o response com um texto
        //res.end('Hello! Sir Isaac Newton is your friend!');
        
        //? Finalizando o response com um JSON
        // res.end(JSON.stringify({
        //     id: 1,
        //     name: 'Hello! Sir Isaac Newton is your friend!',
        // }));

        //? Finalizando com URL parametrizadas
        //? Verificando a quantidade de ids
        if(items.length === 3){
            //* Transformando em número
            const friendIndex = Number(items[2]);
            //* Exibindo o amigo específico
            res.end(JSON.stringify(friends[friendIndex]));
        } else{
            //* Exibindo todos os amigos
            res.end(JSON.stringify(friends)); 
        }
        
    }
    else if(req.method === 'GET' && items[1] === 'messages'){
        //? Quando fizer o request, a página irá responder com esse HTML
        //* Para a página saber que eu quero que seja um HTML
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
            res.write('<body>');
                res.write('<ul>');
                    res.write('<li>Hello my friend Isaac!</li>');
                    res.write('<li>What are your thoughts about Physics?</li>');
                res.write('</ul>');
            res.write('</body>');
        res.write('</html>');
        
        res.end();
    }
    else{
        //? Caso o request não bata com nenhum dos acima
        res.statusCode = 404;
        res.end();
    }
    
});

//! Servidor vai captar as conexões
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});