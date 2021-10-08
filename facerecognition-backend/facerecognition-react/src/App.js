import React, { Component } from 'react';
import Clarifai from 'clarifai'
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';

// function App() {
//   return (
//     <div className="App">
      
//     </div>
//   );
// }

//! Setando o Clarifai para carregar os modelos
const app = new Clarifai.App({
  apiKey: '216169d3088f43788f364c6224c35d5e'
 });

//! Parâmetros das partículas animadas no background
const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

//! Definindo a classe 'App', puxando propriedades de 'Component'
class App extends Component{
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
      //? Variável que contém os dados da posição da figura em %
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      //? Pega os dados da imagem colocada
    const image = document.getElementById('inputImage');
      //? Altura e largura da imagem de entrada
    const width = Number(image.width);
    const height = Number(image.height);
    //console.log(width, height);

      //? Retorno como um objeto com a posição dos quatro pontos
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  //! Fazendo a comunicação com o server
  // componentDidMount(){
  //     //? Fazendo a busca do servidor
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log);
  // }

  displayFaceBox = (box) => {
    //! Seta o novo valor da propriedade box
    //console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    //console.log(event.target.value);
    //! Setando o novo valor da propriedade 'input' de 'this.state'
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    //console.log('click');
    //! Quando eu clico no botão, a propriedade 'imageUrl' pega o valor de 'input'
    this.setState({imageUrl: this.state.input});
    //! Clarifai
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
        //? O modelo irá pegar o link da imagem que eu coloquei no input
      this.state.input)
      .then(response => {
            //? Exibe o resultado do modelo no console
          //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
            //? Função para enviar dados para fazer o quadrado
          if(response){
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
                //? Passando os dados para o servidor
              body: JSON.stringify({
                  id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count }));
              })
          }
          this.displayFaceBox(this.calculateFaceLocation(response));
        }
      )
      .catch(err => console.log(err));
  }

  //! Função que vai mudar a rota quando eu logar
  onRouteChange = (route) => {
      //? Verifica se o usuário está logado pra mudar a navigation bar
    if(route === 'signout'){
      this.setState({isSignedIn: false});
    } else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
      //? Muda entre as rotas do Register, Home e SignIn
    this.setState({route: route});
  }

  render(){
    //! Fazendo 'destructuring' para usar somente os nomes das propriedades
    const { imageUrl, box, route, isSignedIn } = this.state;

    return(
      <div className='App'>
        <Particles className='particle' params={particlesOptions}/> {/* Partículas que ficam no fundo */}
         
          {/* Defininindo os componentes que serão usados */}
        
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/> {/* Barra de navegação da página */}
        { 
            //! Verifica se a rota é 'home'
          route === 'home' 
          ? <div>
              <Logo /> {/* Logotipo animado com 'Tilt.js' */}
              <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries}
              /> {/* Rank dos uploads dos usuários */}
              <ImageLinkForm 
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
              /> {/* Input do link das fotos */}
              <FaceRecognition box={box} imageUrl={imageUrl} /> {/* Exibe a imagem com o modelo AI */}
            </div>
          : (
                //! Verifica se a rota é a 'signin'
              route === 'signin'
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
