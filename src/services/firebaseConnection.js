import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';

let firebaseConfig = {
  apiKey: "AIzaSyAs0hft-w7MbGvz_Y1sRUUxs-ULEfXMtIk",
  authDomain: "controleoco.firebaseapp.com",
  databaseURL: "https://controleoco-default-rtdb.firebaseio.com",
  projectId: "controleoco",
  storageBucket: "controleoco.appspot.com",
  messagingSenderId: "989427596131",
  appId: "1:989427596131:web:a051b8f12724cff82d7156",
  measurementId: "G-HV21D57ENJ"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;