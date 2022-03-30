import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/auth';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={2000}/>
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}