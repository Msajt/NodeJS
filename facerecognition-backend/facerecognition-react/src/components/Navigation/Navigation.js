import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
        //? Barra de navegação
            // * Adicionando CSS e tachyons para estilizar
        if(isSignedIn){
            return(
                <nav style={{
                    display: 'flex', // Flexbox
                    justifyContent: 'flex-end' // Justifica na parte direita da página
                }}>
                    {/** Parágrafo */}
                        {/**
                         * f3 -> font-size: 1.5rem
                         * link ->
                         * dim -> quando passo o mouse diminui a opacidade da fonte
                         * black -> cor da fonte
                         * underline -> sublinhado abaixo do texto
                         * pa3 -> padding
                         * pointer -> quando passo o mouse o ponteiro do mouse muda
                         */}
                    <p onClick={() => onRouteChange('signout')}
                    className='f3 link dim black underline pa3 pointer'>
                        Sign out
                    </p>
                </nav>
            );
        } else {
            return(
                <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <p onClick={() => onRouteChange('signin')}
                       className='f3 link dim black underline pa3 pointer'>
                        Sign in
                    </p>
                    <p onClick={() => onRouteChange('register')}
                       className='f3 link dim black underline pa3 pointer'>
                        Register
                    </p>
                </nav>
            );
        }
}

//! Para poder exportar a função para 'App.js'
export default Navigation;