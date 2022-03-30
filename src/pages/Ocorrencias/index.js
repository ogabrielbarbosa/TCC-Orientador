import './ocorrencias.css';
import { useState, useEffect } from 'react';
import firebase from '../../services/firebaseConnection';
import { useHistory, useParams } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { toast } from 'react-toastify';

import { FiHome } from 'react-icons/fi';

import jsPDF from 'jspdf';
import emailjs from 'emailjs-com';

import univap from '../../assets/univap.png';
import fve from '../../assets/fve.png';

export default function Ocorrencia(){
  const { id } = useParams();
  const history = useHistory();

  const [aluno, setAluno] = useState('');
  const [turma, setTurma] = useState('');
  const [curso, setCurso] = useState('');
  const [matricula, setMatricula] = useState('');
  const [professor, setProfessor] = useState('');
  const [materiaProfessor, setMateriaProfessor] = useState('');
  const [ocorrido, setOcorrido] = useState('');
  const [data, setData] = useState('');
  const [status, setStatus] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [comentariosOrientador, setComentariosOrientador] = useState('');
  const [emailResponsavel, setEmailResponsavel] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataenvio, setDataEnvio] = useState('');
  const [idAluno, setIdAluno] = useState(false);

  useEffect(()=> {
    async function loadAlunos(){
      await firebase.firestore().collection('ocorrencias')
      .get()
      .then((snapshot)=>{
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            aluno: doc.data().aluno,
            curso: doc.data().curso,
            matricula: doc.data().matricula,
            turma: doc.data().turma,
            professor: doc.data().professor,
            ocorrido: doc.data().ocorrido,
            data: doc.data().data,
            comentarios: doc.data().comentarios,
            comentariosOrientador: doc.data().comentariosOrientador,
            emailResponsavel: doc.data().emailResponsavel,
            tipo: doc.data().tipo
          })
        })

        if(id){
          loadId(lista);
        }

      })
      .catch((error)=>{
        console.log('DEU ALGUM ERRO!', error);
      })

    }

    loadAlunos();

    var monthNames = [ '01', '02', '03', '04', '05','06',
    '07', '08', '09', '10', '11', '12'];
    var date = new Date().getDate(); 
    var month = monthNames[new Date().getMonth()];
    var year = new Date().getFullYear(); 
    setDataEnvio(
      date + '/' + month + '/' + year
    );
  }, [id]);

  async function loadId(lista){
    await firebase.firestore().collection('ocorrencias').doc(id)
    .get()
    .then((snapshot) => {
      setAluno(snapshot.data().aluno);
      setTurma(snapshot.data().turma);
      setCurso(snapshot.data().curso);
      setMatricula(snapshot.data().matricula);
      setProfessor(snapshot.data().professor);
      setMateriaProfessor(snapshot.data().materiaProfessor);
      setOcorrido(snapshot.data().ocorrido);
      setData(snapshot.data().data);
      setStatus(snapshot.data().status);
      setComentarios(snapshot.data().comentarios);
      setComentariosOrientador(snapshot.data().comentariosOrientador);
      setEmailResponsavel(snapshot.data().emailResponsavel);
      setTipo(snapshot.data().tipo);
      setIdAluno(true);
    })
    .catch((err)=>{
      console.log('ERRO NO ID PASSADO: ', err);
      setIdAluno(false);
    })
  }

  async function handleRegister(e){
    e.preventDefault();

    if(idAluno){
      await firebase.firestore().collection('ocorrencias')
      .doc(id)
      .update({
        status: status,
        comentariosOrientador: comentariosOrientador,
        tipo: tipo
      })
      .then(()=>{
        toast.success('Ocorrência editada com sucesso!');
        history.push('/dashboard');
      })
      .catch((err)=>{
        toast.error('Ops erro ao registrar, tente mais tarde.');
      })

      return;
    }

  }

  //Chamado quando troca o status
  function handleOptionChange(e){
    setStatus(e.target.value);
  }

  function handleChangeSelect(e){
    setTipo(e.target.value);
  }

  function Imprimir(e){
    e.preventDefault();

    var imgUnivap = new Image()
    imgUnivap.src = univap;

    var imgFVE = new Image()
    imgFVE.src = fve;

    var doc = new jsPDF('p', 'pt', 'a4');

    doc.addImage(fve, 'png', 30, 30, 150, 40)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(230,60, 'REGISTRO DE ATENDIMENTO');

    doc.setFont('helvetica', 'normal')
    doc.text(240,72, 'Orientação / Coordenação')

    doc.addImage(univap, 'png', 470, 30, 90, 42)

    doc.setLineWidth(1)
    doc.line(30, 90, 560, 90)
    
    doc.text(465,120, 'Data: '+ dataenvio)

    doc.text(30,160, 'Nome do Aluno(a): '+ aluno)
    doc.text(30,180, 'Matrícula do Aluno(a): '+ matricula)
    doc.text(30,200, 'Turma: '+ turma)
    doc.text(250,200, 'Curso: '+ curso)

    doc.text(30,250, 'Atendimento:')
    doc.text(30,270, comentarios,{
      maxWidth: 530
    })

    doc.line(330, 565, 500, 565)
    doc.text(400, 580, 'Aluno')

    doc.line(30, 565, 200, 565)
    doc.text(80, 580, 'Responsável')

    doc.line(30, 665, 200, 665)
    doc.text(50, 680, 'Orientação Educacional')

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(30, 760, 'Colégios UNIVAP - Unidade Centro')
    doc.setFont('helvetica', 'normal')
    doc.text(30, 772, 'Rua Paraibuna, n.º 75 - Jardim São Dimas - São José dos Campos - SP - CEP: 12245-020')
    doc.text(30, 784, 'Tel.:(12) 3928 - 9816')
    doc.text(30, 794, 'www.univap.br')
    doc.line(30, 796, 95, 796)
    
    doc.save("ocorrencia.pdf");

    handleRegister(e);
  }

  function sendEmail(e) {
    e.preventDefault();

    emailjs.sendForm('service_6wd9m86', 'template_db2pavb', e.target, 'user_yRf5bczZvlSrGDevfRv7S')
      .then(() => {
          toast.success('Email enviado com sucesso!')
      }, (error) => {
          toast.error('Email não enviado!')
      });
    e.target.reset();
    handleRegister(e);
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name={tipo}>
          <FiHome color="#00488B" size={25}/>
        </Title>

        <div className="container">

          <form className="form-profile" onSubmit={handleRegister} >
            
            <label>Aluno</label>
            <input
              type="text"
              value={aluno}
              disabled={true}
              onChange={ (e) => setAluno(e.target.value) }
            />

            <label>Turma</label>
            <input
              type="text"
              value={turma}
              disabled={true}
              onChange={ (e) => setTurma(e.target.value) }
            />
            
            <input
              type="text"
              value={curso}
              disabled={true}
              onChange={ (e) => setCurso(e.target.value) }
            />

            <label>Matricula</label>
            <input
              type="text"
              value={matricula}
              disabled={true}
              onChange={ (e) => setMatricula(e.target.value) }
            />

            <label>Professor</label>
            <input
              type="text"
              value={professor}
              disabled={true}
              onChange={ (e) => setProfessor(e.target.value) }
            />
            <input
              type="text"
              value={materiaProfessor}
              disabled={true}
              onChange={ (e) => setMateriaProfessor(e.target.value) }
            />

            <label>Ocorrido</label>
            <input
              type="text"
              value={ocorrido}
              disabled={true}
              onChange={ (e) => setOcorrido(e.target.value) }
            />
            
            <label>Tipo</label>
            <select value={tipo} onChange={handleChangeSelect}>
              <option value="Ocorrência">Ocorrência</option>
              <option value="Advertência">Advertência</option>
            </select>

            <label>Data</label>
            <input
              type="text"
              value={data}
              disabled={true}
              onChange={ (e) => setData(e.target.value) }
            />

            <label>Status</label>
            <div className="status">
              <input 
              type="radio"
              name="radio"
              value="Aberto"
              onChange={handleOptionChange}
              checked={ status === 'Aberto' }
              />
              <span>Em Aberto</span>

              <input 
              type="radio"
              name="radio"
              value="Processamento"
              onChange={handleOptionChange}
              checked={ status === 'Processamento' }
              />
              <span>Processamento</span>

              <input 
              type="radio"
              name="radio"
              value="Concluido"
              onChange={handleOptionChange}
              checked={ status === 'Concluido' }
              />
              <span>Concluido</span>
            </div>

            <label>Comentários</label>
            <textarea
              type="text"
              placeholder="Nenhum comentário."
              value={comentarios}
              disabled={true}
              onChange={ (e) => setComentarios(e.target.value) }
            />

            <label>Comentários do orientador:</label>
            <textarea
              type="text"
              placeholder="Nenhum comentário."
              value={comentariosOrientador}
              onChange={ (e) => setComentariosOrientador(e.target.value) }
            />

            <button type="submit" className="buttons" >Salvar</button>

            <button onClick={Imprimir} className="buttons" >Imprimir ocorrência</button>

          </form>
          
        </div>

        <div className="container">
          <form className="form-profile" onSubmit={sendEmail}>
            <input 
              type="hidden" 
              value={ocorrido}
              name="ocorrido"
            />
            <input 
              type="hidden" 
              value={dataenvio}
              name="data_dia"
            />
            <input 
              type="hidden" 
              value={aluno}
              name="aluno"
            />
            <input 
              type="hidden" 
              value={comentarios}
              name="comentarios"
            />
            <input 
              type="hidden" 
              value={comentariosOrientador}
              name="comentariosOrientador"
            />
            <input 
              type="hidden" 
              value={emailResponsavel}
              name="emailResponsavel"
            />
            <button className="button-enviar">Enviar email</button>
          </form>
        </div>
      </div>
    </div>
  )
}