import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
    return(
        <div className='center'>
            {/* Algumas propriedades da biblioteca 'tachyons' */}
            <div className='absolute mt2'>
                {/* A imagem exibida é a que imageUrl pega no momento que é passada quando aperto o botão */}
                <img id='inputImage' alt='' src={imageUrl} width='500px' heigh='auto'/>
                <div className='bounding-box'
                     style={
                            {
                             /* Pontos para fazer a linha */
                             top: box.topRow,
                             right: box.rightCol,
                             bottom: box.bottomRow,
                             left: box.leftCol
                            }
                            }
                ></div>
            </div>
        </div>
    );
}

export default FaceRecognition;