//! Oauth 2.0

//! Encrypted Connections - SSL/TLS
    //? HTTPS
    //? TLS >> SSL
        //* => Certificado digital, usado para verificar a posse 
        //*    do servidor antes para enviar os dados encriptados
        //* => Certificate Authority, uma organização que lida com
        //*    os certificados digitais
        //? Let's Encrypt
        //* => Self-Signed Certificate, enable HTTPS but not trusted
        //*    by others. Useful for development
        //* => CA-Signed Certificate, Trusted by most clients on
        //*    the web. Useful for production

//! Helmet.js
    //? Middleware para express para proteger o servidor
    //* npm install helmet

//! Authetication vs. Authorization (AUTH)
    //? => Autenticação valida quem o usuário diz ser
    //? => Autorização checa se o usuário tem a permissão para acessar
    //?    determinado recurso que foi autenticado

//! Social SignIn
    //? Use data from other sites to sign in

//! API keys
    //? Unique identifier for your project
//! JWT - JSON Web Tokens
    //? => Type of access token, they are like API, but they act as
    //?    a set of credentials for that user to grant access to an
    //?    API
    //? => Parece como se fosse uma session
    //? => Opaque tokens
//! OAuth
    //? Resource Owner --> Client --> Resource Server --> Authorization Server
    //*     (user)    (www.myapp.com) (api.myapp.com)    (accounts.google.com)

//! Cookies
    //? Strings of data set by the server and stored in the browser

//! Sessions
    //? Stores data of the current active user
    //? Server-side sessions
        //* express-session (require database)
    //? Client-side sessions (cookies)
        //* cookie-session
    //? Serializing / Deserializing
        //* => Salvar os dados do usuário em um cookie que vai ser 
        //*    passado ao browser
        //* => Carregar os dados dos cookies desse usuário em um
        //*    valor que pode ser lido no API do 'express'