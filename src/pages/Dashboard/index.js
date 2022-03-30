import './dashboard.css';
import { useState, useEffect } from 'react';

import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';
import ModalDetalhes from '../../components/ModalDetalhes';

import { FiHome, FiSearch, FiArrowRight } from "react-icons/fi";

import { Link } from 'react-router-dom';

const listRef = firebase.firestore().collection('ocorrencias').orderBy('data', 'desc');
 
export default function Dashboard(){

  const [ocorrencia, setOcorrencia] = useState([]);
  const [loading, setLoadgin] = useState(true);
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(()=> {

    async function loadOcorrencias(){
      await listRef
      .onSnapshot((doc)=>{
        let todasOcorrencias = [];

        doc.forEach((item)=>{
          todasOcorrencias.push({
            id: item.id,
            aluno: item.data().aluno,
            curso: item.data().curso,
            comentarios: item.data().comentarios,
            data: item.data().data,
            matricula: item.data().matricula,
            ocorrido: item.data().ocorrido,
            professor: item.data().professor,
            materiaProfessor: item.data().materiaProfessor,
            status: item.data().status,
            turma: item.data().turma,
            emailResponsavel: item.data().emailResponsavel,
            nomeResponsavel: item.data().nomeResponsavel,
            numeroResponsavel: item.data().numeroResponsavel,
            tipo: item.data().tipo
          })
        });
        
        setOcorrencia(todasOcorrencias);

      }); 
      
      setLoadgin(false);
    
    }

    loadOcorrencias();

  }, []);

  function togglePostModal(item){
    setShowPostModal(!showPostModal);
    setDetail(item);
  }
  
  if(loading){
    return(
      <div>
        <Header/>
        
        <div className="content">
          <Title name="Home">
            <FiHome color="#00488B" size={25}/>
          </Title>

          <div className="container dashboard">
            <span>Buscando ocorrencias...</span>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Início">
          <FiHome color="#00488B" size={25}/>
        </Title>

        {ocorrencia.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhuma ocorrência registrada...</span>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th scope="col">Aluno</th>
                  <th scope="col">Turma</th>
                  <th scope="col">Curso</th>
                  <th scope="col">Professor</th>
                  <th scope="col">Matéria</th>
                  <th scope="col">Ocorrido</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Status</th>
                  <th scope="col">Data</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {ocorrencia.map((item, index)=>{
                  return(
                    <tr key={index}>
                      <td data-label="Aluno">{item.aluno}</td>
                      <td data-label="Turma">{item.turma}</td>
                      <td data-label="Turma">{item.curso}</td>
                      <td data-label="Professor">{item.professor}</td>
                      <td data-label="Matéria">{item.materiaProfessor}</td>
                      <td data-label="Ocorrido">{item.ocorrido}</td>
                      <td data-label="Tipo">{item.tipo}</td>
                      <td data-label="Status">
                      <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : item.status ==='Processamento' ? '#999' : '#00488B'}}>{item.status}</span>
                      </td>
                      <td data-label="Data">{item.data}</td>
                      <td data-label="#">
                        <button className="action" style={{backgroundColor: '#3583f6'}} onClick={ () => togglePostModal(item) }>
                          <FiSearch color="#fff" size={17}/>
                        </button>
                        <Link className="action" style={{backgroundColor: '#F6a935'}} to={`/ocorrencias/${item.id}`}>
                          <FiArrowRight color="#fff" size={17}/>
                        </Link>
                      </td>
                    </tr>
                  )
                })}            
              </tbody>
            </table>
          </>
        )}
        
      </div>

      {showPostModal && (
        <ModalDetalhes
          conteudo={detail}
          close={togglePostModal}
        />
      )}

    </div>
  )
}