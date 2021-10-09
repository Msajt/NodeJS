import React from 'react';

class SignIn extends React.Component {
        //! Variaveis para pegar o login e senha
    constructor(){
        super();
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

        //! Quando coloco o email, pega o valor
    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value});
    }

        //! Quando coloco o email, pega o valor
    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value});
    }

        //! Enviando login para o servidor
    onSubmitSignIn = () => {
        //console.log(this.state); // Retornando login e senha para testes
        fetch('http://localhost:3000/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
                //? Passando os dados para o servidor
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
                //? Pega a resposta do servidor e se der certo, vai pra 'home'
            .then(response => response.json())
            .then(user => {
                if(user.id){
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                }
            })
    }

    render(){
        const { onRouteChange } = this.props;
        return(
            <div>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                                <div className="mt3">
                                        {/* Input email */}
                                    <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                    <input 
                                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                        type="email" name="email-address"  
                                        id="email-address"
                                        onChange={this.onEmailChange}
                                    />
                                </div>
                                <div className="mv3">
                                        {/* Input password */}
                                    <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                    <input 
                                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                        type="password" 
                                        name="password"  
                                        id="password"
                                        onChange={this.onPasswordChange}
                                    />
                                </div>
                            </fieldset>
                            <div className="">
                                {/* Sign In Button, quando clico nele eu ligo a função que muda o valor da string da rota */}
                                <input onClick= { this.onSubmitSignIn }
                                       className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                       type="submit"
                                       value="Sign in" />
                            </div>
                            <div className="lh-copy mt3 pointer">
                                <p onClick={() => onRouteChange('register')} className="f6 link dim black db">Register</p>
                            </div>
                        </div>
                    </main>
                </article>
            </div>
        );
    } 
}

export default SignIn;