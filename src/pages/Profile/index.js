import './profile.css';
import { useState, useContext} from 'react';
import firebase from '../../services/firebaseConnection';

import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Title from '../../components/Title';
import logo from '../../assets/logo.png';

import { MdAccountCircle } from "react-icons/md";
import { toast } from 'react-toastify';

export default function Profile(){
    
    const { user, signOut } = useContext(AuthContext);

    const [email] = useState(user && user.email);

    function PreviewText() {
        var oFReader = new FileReader();
        oFReader.readAsText(document.getElementById("uploadText").files[0]);
        oFReader.onload = function (oFREvent) {
            var conteudoArquivo= oFREvent.target.result;
            processData(conteudoArquivo);
        };
        toast.success('Aluno(s) cadastrados com sucesso!')
    };
    
    function processData(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = [];
        var matrizAlunos = [];
        for (var i=1; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(';');
            var tarr = [];
            var aluno= {"matricula":"", "nome":"", "turma":"", "curso":"", "emailResponsavel":"", "nomeResponsavel":"", "numeroResponsavel":"" }
            if(data[0] !== ""){
                aluno.matricula = data[0];
                aluno.nome = data[1];
                aluno.turma = data[2];
                aluno.curso = data[3];
                aluno.emailResponsavel = data[4];
                aluno.nomeResponsavel = data[5];
                aluno.numeroResponsavel = data[6];
                matrizAlunos.push(aluno);
                firebase.firestore().collection('alunos').doc(aluno.matricula).set({
                    matricula: aluno.matricula,
                    nome: aluno.nome,
                    turma: aluno.turma,
                    curso: aluno.curso,
                    emailResponsavel: aluno.emailResponsavel,
                    nomeResponsavel: aluno.nomeResponsavel,
                    numeroResponsavel: aluno.numeroResponsavel
                });
            }
            lines.push(tarr);
        }
    }

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Minha Conta">
                <MdAccountCircle color="#00488B" size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile">
                        <label className="label-logo">
                            <img src={logo} alt="Univap logo" width="250"/>
                        </label>

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />
                    </form>
                </div>
                
                <div className="container">
                    <form className="form-profile">
                        <label>Importar alunos</label>
                        <input id="uploadText" type="file" onChange={PreviewText}/>
                    </form>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={ () => signOut()}>
                        Sair
                    </button>
                </div>

            </div>
        </div>
    )
}