import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    function loadStorage(){
      const storageUser = localStorage.getItem('SistemaUser');

      if(storageUser){
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
  
      setLoading(false);
    }
    
    loadStorage();

  }, [])

  //Funcao para logar o usario
  async function signIn(email, password){
    setLoadingAuth(true);
    await firebase.auth().signInWithEmailAndPassword(email,password)
    .then(async (value)=>{
        let uid = value.user.uid;
        const userProfile = await firebase.firestore().collection('orientadores').doc(uid).get();
        
        let data = {
          uid: uid,
          nome: userProfile.data().nome,
          email: value.user.email,
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success('Bem vindo de volta!');
        
    })
    .catch((error)=> {
        toast.error('Ops algo deu errado!');
        setLoadingAuth(false);
    });
  }

  function storageUser(data){
    localStorage.setItem('SistemaUser', JSON.stringify(data));
  }

  async function signOut(){
    await firebase.auth().signOut();
    localStorage.removeItem('SistemaUser');
    setUser(null);
  }

  return(
    <AuthContext.Provider 
    value={{ 
      signed: !!user,  
      user, 
      loading,
      signOut,
      signIn,
      loadingAuth,
      setUser,
      storageUser
    }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;