import './estagio.css';
import { useState, useEffect } from 'react';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { toast } from 'react-toastify';

import InputMask from 'react-input-mask';

import { FiHome } from 'react-icons/fi';

export default function Estagio(){
  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [trabalhoInicio, setTrabalhoInicio] = useState('');
  const [trabalhoSaida, setTrabalhoSaida] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');
  
  const [estagiarios, setEstagiarios] = useState([]);

  const listRef = firebase.firestore().collection('estagiarios');

  async function cadastrarAluno(e){
    e.preventDefault();

    if(matricula === '' || nome === '' || dataInicio === '' || trabalhoInicio === '' || trabalhoSaida === '' || dataConclusao === ''){
      toast.error('Preencha todos os campos!');
    }else{
      await listRef.add({
        matricula: matricula,
        nome: nome,
        dataInicio: dataInicio,
        trabalhoInicio: trabalhoInicio,
        trabalhoSaida: trabalhoSaida,
        dataConclusao: dataConclusao
      });
      toast.success('Estágiario cadastrado!');
    }

    setMatricula('');
    setNome('');
    setDataInicio('');
    setTrabalhoInicio('');
    setTrabalhoSaida('');
    setDataConclusao('');

  }

  useEffect(()=> {  

    async function loadEstagiarios(){
      await listRef
      .onSnapshot((doc)=>{
        let meusEstagiarios = [];

        doc.forEach((item)=>{
          meusEstagiarios.push({
            id: item.id,
            matricula: item.data().matricula,
            nome: item.data().nome,
            dataInicio: item.data().dataInicio,
            trabalhoInicio: item.data().trabalhoInicio,
            trabalhoSaida: item.data().trabalhoSaida,
            dataConclusao: item.data().dataConclusao
          })
        });

        setEstagiarios(meusEstagiarios);

      });

    }

    loadEstagiarios();  

  }, []);


  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Estágio">
          <FiHome color="#00488B" size={25}/>
        </Title>

        <div className="container">

          <form className="form-profile">

            <label>Número de matrícula</label>
            <InputMask type="text" placeholder='Matrícula' value={matricula} onChange={ (e) => setMatricula(e.target.value) }/>

            <label>Nome</label>
            <InputMask type="text" placeholder='Nome' value={nome} onChange={ (e) => setNome(e.target.value) }/>

            <label>Data de ínicio</label>
            <InputMask type="text" mask="99/99/9999" placeholder='Data' value={dataInicio} onChange={ (e) => setDataInicio(e.target.value) }/>

            <label>Hora de trabalho ínicio</label>
            <InputMask type="text" mask="99:99" placeholder='Hora' value={trabalhoInicio} onChange={ (e) => setTrabalhoInicio(e.target.value) }/>
            
            <label>Hora de saida de trabalho</label>
            <InputMask type="text" mask="99:99" placeholder='Hora' value={trabalhoSaida} onChange={ (e) => setTrabalhoSaida(e.target.value) }/>
            
            <label>Data conclusão</label>
            <InputMask type="text" mask="99/99/9999" placeholder='Data' value={dataConclusao} onChange={ (e) => setDataConclusao(e.target.value) }/>

            <button className="buttons" onClick={cadastrarAluno}>
              Cadastrar
            </button>
          </form>

        </div>

        <table>
          <thead>
            <tr>
              <th scope="col">Matrícula</th>
              <th scope="col">Nome</th>
              <th scope="col">Data de ínicio</th>
              <th scope="col">Hora de trabalho ínicio</th>
              <th scope="col">Hora de saida de trabalho</th>
              <th scope="col">Data conclusão</th>
            </tr>
          </thead>
          <tbody>
            {estagiarios.map((item, index)=>{
              return(
                <tr key={index}>
                  <td data-label="Matrícula">{item.matricula}</td>
                  <td data-label="Nome">{item.nome}</td>
                  <td data-label="Data de ínicio">{item.dataInicio}</td>
                  <td data-label="Hora de trabalho ínicio">{item.trabalhoInicio}</td>
                  <td data-label="Hora de saida de trabalho">{item.trabalhoSaida}</td>
                  <td data-label="Data conclusão">{item.dataConclusao}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}