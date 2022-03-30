import './modal.css';

import { FiArrowLeft } from 'react-icons/fi';

export default function ModalDetalhes({conteudo, close}){
    return(
        <div className="modal">
            <div className="container">
                <button className="close" onClick={ close }>
                    <FiArrowLeft color="#000" size={25}/>
                </button>

                <div>
                    <h2>Dados do Responsável</h2>

                    <div className="row">
                        <span>
                            Nome: <a>{conteudo.nomeResponsavel}</a>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Email: <a>{conteudo.emailResponsavel}</a>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Numero: <a>{conteudo.numeroResponsavel}</a>
                        </span>
                    </div>

                </div>
            </div>
        </div>
    )
}