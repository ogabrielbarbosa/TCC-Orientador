import './signin.css';
import { useState, useContext } from 'react';
import firebase from '../../services/firebaseConnection';

import { AuthContext } from '../../contexts/auth'; 

import logo from '../../assets/logo.png';

import { toast } from 'react-toastify';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();
    if(email !== '' && password !== ''){
      signIn(email, password)
    }
  }

  function resetPassword(e){
    e.preventDefault();
    if(email == ''){
      toast.error('Digite no campo "Email" o endereço de email!');
    }else{
      firebase.auth().sendPasswordResetEmail(email).then(()=>{
        toast.success('Email enviado para redefinição de senha.');
      })
      .catch(()=>{
        toast.error('Ocorreu um erro, tente novamente mais tarde!');
      });
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Sistema Logo" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <input type="text" placeholder="Email" value={email} onChange={ (e) => setEmail(e.target.value) }/>
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value) } />
          <button type="submit">{loadingAuth ? 'Carregado...' : 'Acessar'}</button>
        </form>  

        <a onClick={resetPassword}>Esqueci minha senha</a>

      </div>
    </div>
  );
}

export default SignIn;