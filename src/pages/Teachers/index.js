import './profile.css';
import { useState, useEffect } from 'react';
import firebase from '../../services/firebaseConnection';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { MdAccountCircle } from "react-icons/md";
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';

export default function Teachers(){

    const [professores, setProfessores] = useState([]);
    const [codigo, setCodigo] = useState('');

    const [verify, setVerify] = useState(true);

    async function PreviewText() {
        var oFReader = new FileReader();
        oFReader.readAsText(document.getElementById("uploadText").files[0]);
        oFReader.onload = function (oFREvent) {
            var conteudoArquivo= oFREvent.target.result;
            processData(conteudoArquivo);
        };
        toast.success('Professor(es) cadastrados com sucesso!')
    };
    
    async function processData(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = [];
        var matrizProfesores = [];
        for (var i=1; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(';');
            var tarr = [];
            var professor = {"nome":"", "email":"", "cpf":""}
            if(data[0] !== ""){
                professor.nome = data[0];
                professor.email = data[1];
                professor.cpf = data[2];
                matrizProfesores.push(professor);
                await firebase.auth().createUserWithEmailAndPassword(professor.email , professor.cpf)
                .then(async (value)=>{
                    let uid = value.user.uid;
                    await firebase.firestore().collection('professores').doc(uid).set({
                        nome: professor.nome,
                        email: professor.email,
                        cpf: professor.cpf
                    });
                    await firebase.firestore().collection('suspensas')
                    .doc(uid).set({
                        disable: 'false'
                    });
                });
            }
            lines.push(tarr);
        }
    }

    useEffect(()=> {

        async function loadProfessores(){
          await firebase.firestore().collection('professores')
          .onSnapshot((doc)=>{
            let professores = [];
    
            doc.forEach((item)=>{
                professores.push({
                id: item.id,
                nome: item.data().nome,
                email: item.data().email
              })
            });
    
            setProfessores(professores);
    
          });
    
        }
    
        loadProfessores();
        
    }, []);

    function verifyCode(e){
        e.preventDefault();
        if(codigo == '0000'){
            setVerify(false);
        }else{
            toast.error('Senha de acesso errada!');
        }
    }

    async function excluirProfessor(id){
        await firebase.firestore().collection('professores').doc(id)
        .delete();
        await firebase.firestore().collection('suspensas').doc(id)
        .update({
            disable: 'true'
        })
        .then(()=>{
          toast.error('Professor excluido!');
        });
    }

    return(
        
        <div>
            <Header/>

            <div className="content">
                
                <Title name="Professores">
                    <MdAccountCircle color="#00488B" size={25}/>
                </Title>
                
                <div className="container">
                    <form className="form-student">
                        <label>Código de acesso:</label>
                        <input type="text" placeholder="Código" value={codigo} onChange={ (e) => setCodigo(e.target.value) } />
                        <button onClick={verifyCode}>Verificar</button>
                    </form>   
                </div>

                <div hidden={verify}>

                    <div className="container">
                        <input id="uploadText" type="file" onChange={PreviewText}/>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Email</th>
                            <th scope="col">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professores.map((item, index)=>{
                            return(
                                <tr key={index}>
                                <td data-label="Nome">{item.nome}</td>
                                <td data-label="Email">{item.email}</td>
                                <td data-label="#">
                                    <button className="action" style={{backgroundColor: '#f00'}} onClick={ () => excluirProfessor(item.id)} >
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
        </div>
    )
}