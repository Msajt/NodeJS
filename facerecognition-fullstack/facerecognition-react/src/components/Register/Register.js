import React from 'react';

class Register extends React.Component {
    //! Variaveis para pegar o login e senha
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            name: ''
        }
    }

        //! Quando coloco o nome, pega o valor
    onNameChange = (event) => {
        this.setState({name: event.target.value});
    }

        //! Quando coloco o email, pega o valor
    onEmailChange = (event) => {
        this.setState({email: event.target.value});
    }

        //! Quando coloco o password, pega o valor
    onPasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    onSubmitSignIn = () => {
        //console.log(this.state); // Retornando login e senha para testes
        fetch('http://localhost:3000/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
                //? Passando os dados para o servidor
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        })
                //? Pega a resposta do servidor e se der certo, vai pra 'home'
            .then(response => response.json())
            .then(user => {
                if(user){
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                }
            })
    }

    render(){
        //const { onRouteChange } = this.props

        return(
            <div>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0">Register</legend>
                                    {/* Nome */}
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                    <input 
                                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                        type="text" 
                                        name="name" 
                                        id="name"
                                        onChange={this.onNameChange}
                                    />
                                </div>
                                    {/* Email */}
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                    <input 
                                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                        type="email" 
                                        name="email-address" 
                                        id="email-address"
                                        onChange={this.onEmailChange}
                                    />
                                </div>
                                    {/* Senha */}
                                <div className="mv3">
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
                                <input onClick= {this.onSubmitSignIn}
                                       className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                       type="submit"
                                       value="Register" />
                            </div>
                        </div>
                    </main>
                </article>
            </div>
        );
    }
}

export default Register;