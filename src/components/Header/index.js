import './header.css';
import logo from '../../assets/logo.png';

import { Link } from 'react-router-dom';
import { MdPeopleOutline, MdAccountCircle, MdPeople } from "react-icons/md";
import { FiHome, FiArchive, FiClipboard } from "react-icons/fi";

export default function Header(){

    return(
        <div className="sidebar">
            <div>
                <img src={logo} alt="Univap logo"/>
            </div>

            <Link to="/dashboard">
                <FiHome color="#fff" size={25}/>
                Início
            </Link>

            <Link to="/students">
                <MdPeopleOutline color="#fff" size={25}/>
                Alunos
            </Link>
            
            <Link to="/type">
                <FiArchive color="#fff" size={25}/>
                Ocorrências
            </Link>

            <Link to="/teachers">
                <MdPeople color="#fff" size={25}/>
                Professores
            </Link>

            <Link to="/estagio">
                <FiClipboard color="#fff" size={25}/>
                Estágios
            </Link>

            <Link to="/profile">
                <MdAccountCircle color="#fff" size={25}/>
                Conta
            </Link>
        </div>
    )
}