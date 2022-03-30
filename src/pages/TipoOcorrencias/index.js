import './tiposOcorrencias.css';
import { useState, useEffect } from 'react';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { toast } from 'react-toastify';

import { FiArchive, FiX } from 'react-icons/fi'

export default function TipoOcorrencias(){
  const [ocorrencia, setOcorrencia] = useState([]);
  const [tipoOcorrencia, setTipoOcorrencia] = useState('');
  
  const listRef = firebase.firestore().collection('tipoOcorrencia');

  async function cadastrarOcorrencia(e){
    e.preventDefault();

    if(tipoOcorrencia === ''){
      toast.error('Você deve fornecer o nome da ocorrência!');
    }else{
      await listRef.add({
        nomeOcorrencia: tipoOcorrencia
      });
      toast.success('Ocorrência cadastrada!');
    }

    setTipoOcorrencia('');

  }

  useEffect(()=> {

    async function loadOcorrencias(){
      await listRef
      .onSnapshot((doc)=>{
        let minhasOcorrencia = [];

        doc.forEach((item)=>{
          minhasOcorrencia.push({
            id: item.id,
            nomeOcorrencia: item.data().nomeOcorrencia
          })
        });

        setOcorrencia(minhasOcorrencia);

      });

    }

    loadOcorrencias();
    
  }, []);

  async function excluirOcorrencia(id){
    await listRef.doc(id)
    .delete()
    .then(()=>{
      toast.error('Ocorrência excluida!');
    });
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Ocorrências">
          <FiArchive color="#00488B" size={25}/>
        </Title>

        <div className="container">
          <form className="form-student">
            <label>Cadastrar Ocorrência:</label>
            <input type="text" placeholder="Nome da ocorrência" value={tipoOcorrencia} onChange={ (e) => setTipoOcorrencia(e.target.value) } />
            <button onClick={cadastrarOcorrencia}>Cadastrar</button>
          </form>
        </div>

        <table>
          <thead>
            <tr>
              <th scope="col">Ocorrências cadastradas</th>
              <th scope="col">#</th>
            </tr>
          </thead>
          <tbody>
            {ocorrencia.map((item, index)=>{
              return(
                <tr key={index}>
                  <td data-label="Ocorrências cadastrada">{item.nomeOcorrencia}</td>
                  <td data-label="#">
                    <button className="action" style={{backgroundColor: '#f00'}} onClick={ () => excluirOcorrencia(item.id) }>
                        <FiX color="#fff" size={17}/>
                    </button>
                  </td>
                </tr>
              )
            })}            
          </tbody>
        </table>
        
      </div>
    </div>
  )
}