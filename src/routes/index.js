import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Students from '../pages/Students';
import Ocorrencias from '../pages/Ocorrencias';
import TipoOcorrencias from '../pages/TipoOcorrencias';
import Teachers from '../pages/Teachers';
import Estagio from '../pages/Estagio';

export default function Routes(){
  return(
    <Switch>
      <Route exact path="/" component={SignIn} />

      <Route exact path="/dashboard" component={Dashboard} isPrivate />
      <Route exact path="/profile" component={Profile} isPrivate />
      <Route exact path="/type" component={TipoOcorrencias} isPrivate />
      <Route exact path="/students" component={Students} isPrivate />
      <Route exact path="/ocorrencias/:id" component={Ocorrencias} isPrivate />
      <Route exact path="/teachers" component={Teachers} isPrivate />
      <Route exact path="/estagio" component={Estagio} isPrivate />
    </Switch>
  )
}