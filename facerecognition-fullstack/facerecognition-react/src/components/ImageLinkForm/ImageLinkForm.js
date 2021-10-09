import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return(
        <div>
                {/* Título */}
            <p className='f3'>
                {'O cérebro irá detectar as faces na figura, faça uma tentativa.'}
            </p>
            <div className = 'center'>
                <div className='form center pa4 br3 shadow-3'>
                        {/* Entrada do link da imagem */}
                    <input className='f4 pa2 w-70 center'
                           type='text'
                           onChange={onInputChange}
                    />
                        {/* Botão para fazer a detecção */}
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple pointer'
                            onClick={onButtonSubmit}
                    >
                        Detectar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;