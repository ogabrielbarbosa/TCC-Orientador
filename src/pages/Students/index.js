import './students.css';
import { useState, useEffect } from 'react';

import firebase from '../../services/firebaseConnection';
import Title from '../../components/Title';
import ModalDetalhes from '../../components/ModalDetalhes';
import Header from '../../components/Header';

import { toast } from 'react-toastify';

import { CSVLink } from "react-csv";

import { MdPeopleOutline } from "react-icons/md";
import { FiSearch, FiArrowRight } from "react-icons/fi";

import { Link } from 'react-router-dom';

export default function Students(){
    const [matriculaTurma, setMatriculaTurma] = useState('');
    const [tipo, setTipo] = useState('');
    const [tipoOcorrencia, setTipoOcorrencia] = useState('');
    const [ocorrencia, setOcorrencia] = useState([]);
    const [tiposDeOcorrencia, setTiposDeOcorrencia] = useState([]);
    const [showPostModalDetalhes, setShowPostModalDetalhes] = useState(false);
    const [detail, setDetail] = useState();
    const [total, setTotal] = useState();

    const listRef = firebase.firestore().collection('tipoOcorrencia');
    
    useEffect(async()=> {

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
      
              setTiposDeOcorrencia(minhasOcorrencia);
            });
       
        }
      
        loadOcorrencias();
        
    }); 

    function togglePostModalDetalhes(item){
        setShowPostModalDetalhes(!showPostModalDetalhes)
        setDetail(item);
    }

    async function loadOcorrencias(e){
        e.preventDefault();
        if(matriculaTurma === ''){
            toast.error('Digite uma matricula ou turma.')
        }else{
            if(tipoOcorrencia == 'Todas' || tipoOcorrencia == ''){
                firebase.firestore().collection('ocorrencias')
                .where(tipo, '==', matriculaTurma)
                .get()
                .then((snapshot)=>{
                    let lista = [];
                    let total_count = 0;
                    snapshot.forEach((doc)=>{
                        total_count = total_count + 1;
                        lista.push({
                            id: doc.id,
                            aluno: doc.data().aluno,
                            turma: doc.data().turma,
                            curso: doc.data().curso,
                            tipo: doc.data().tipo,
                            materiaProfessor: doc.data().materiaProfessor,
                            comentarios: doc.data().comentarios,
                            data: doc.data().data,
                            matricula: doc.data().matricula,
                            ocorrido: doc.data().ocorrido,
                            professor: doc.data().professor,
                            status: doc.data().status,
                            emailResponsavel: doc.data().emailResponsavel,
                            nomeResponsavel: doc.data().nomeResponsavel,
                            numeroResponsavel: doc.data().numeroResponsavel
                        });
                    });
                    setOcorrencia(lista);
                    setTotal(total_count);
                })
                .catch(()=>{
                    toast.error('Ops! Aconteceu algo inesperado.')
                });
            }else{
                var query = firebase.firestore().collection('ocorrencias');
                query = query.where(tipo, '==', matriculaTurma);
                query = query.where('ocorrido', '==', tipoOcorrencia);
                query.get()
                .then((snapshot)=>{
                    let lista = [];
                    let total_count = 0;
                    snapshot.forEach((doc)=>{
                        total_count = total_count + 1;
                        lista.push({
                            id: doc.id,
                            aluno: doc.data().aluno,
                            turma: doc.data().turma,
                            curso: doc.data().curso,
                            tipo: doc.data().tipo,
                            materiaProfessor: doc.data().materiaProfessor,
                            comentarios: doc.data().comentarios,
                            data: doc.data().data,
                            matricula: doc.data().matricula,
                            ocorrido: doc.data().ocorrido,
                            professor: doc.data().professor,
                            status: doc.data().status,
                            emailResponsavel: doc.data().emailResponsavel,
                            nomeResponsavel: doc.data().nomeResponsavel,
                            numeroResponsavel: doc.data().numeroResponsavel
                        });
                    });
                    setOcorrencia(lista);
                    setTotal(total_count);
                })
                .catch(()=>{
                    toast.error('Ops! Aconteceu algo inesperado.')
                });
            }
        }
    }

    function handleChangeSelect(e){
        setTipo(e.target.value);
    }

    function handleSelectOcorrencia(e){
        setTipoOcorrencia(e.target.value);
    }

    const headers = [
        { label: "Aluno", key: "aluno" },
        { label: "Turma", key: "turma" },
        { label: "Curso", key: "curso" },
        { label: "Professor", key: "professor" },
        { label: "Matéria", key: "materia" },
        { label: "Ocorrido", key: "ocorrido" },
        { label: "Tipo", key: "tipo" },
        { label: "Status", key: "status" },
        { label: "Data", key: "data" }
    ];

    const csvReport = {
        data: ocorrencia,
        headers: headers,
        filename: 'ocorrencias.csv'
    };

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Alunos">
                    <MdPeopleOutline color="#00488B" size={25} />
                </Title>

                <div className="container">
                    <form className="form-student">
                        <label>Pesquisa por ocorrências:</label>
                        <select value={tipo} onChange={handleChangeSelect} className="selected">
                            <option value="escolha">Escolha</option>
                            <option value="matricula">Matricula</option>
                            <option value="turma">Turma</option>
                        </select>
                        <input type="text" placeholder={tipo} value={matriculaTurma} onChange={ (e) => setMatriculaTurma(e.target.value) } />
                        <select value={tipoOcorrencia} onChange={handleSelectOcorrencia} className="selected">
                            <option value="Todas">Todas</option>
                            {tiposDeOcorrencia.map((item) => {
                                return(
                                    <option value={item.nomeOcorrencia} >
                                        {item.nomeOcorrencia}
                                    </option>
                                )
                            })}
                        </select>
                        <button onClick={loadOcorrencias}>Procurar</button>
                    </form>   
                </div>


                <i>Total de ocorrências: <strong>{total}</strong></i>
                <CSVLink {...csvReport} className="linkCSV">Exportar ocorrência</CSVLink>
                <table id="dataTable">
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
                            <td data-label="Curso">{item.curso}</td>
                            <td data-label="Professor">{item.professor}</td>
                            <td data-label="Matéria">{item.materiaProfessor}</td>
                            <td data-label="Ocorrido">{item.ocorrido}</td>
                            <td data-label="Tipo">{item.tipo}</td>
                            <td data-label="Status">
                                <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : item.status ==='Processamento' ? '#999' : '#00488B'}}>{item.status}</span>
                            </td>
                            <td data-label="Data">{item.data}</td>
                            <td data-label="#">
                                <button className="action" style={{backgroundColor: '#3583f6'}} onClick={ () => togglePostModalDetalhes(item) }>
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
            </div>

            {showPostModalDetalhes && (
            <ModalDetalhes
                conteudo={detail}
                close={togglePostModalDetalhes}
                />
            )}

        </div>
    )
}