import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <ul>
    <li class="nav-item"><Link to={ROUTES.LANDING} class="nav-link active">Inicio</Link></li>
    <li class="nav-item"><Link to={ROUTES.TRIPLIST} class="nav-link active">Listar Viajes de Compras</Link></li>
    <li class="nav-item"><Link to={ROUTES.TRIPNEW} class="nav-link active">Ingresar Viaje de Compras</Link></li>
    <li class="nav-item"><Link to={ROUTES.HOME} class="nav-link active">Home</Link></li>
    <li class="nav-item"><Link to={ROUTES.ACCOUNT} class="nav-link active">Cuenta</Link></li>
    {authUser.roles.includes(ROLES.ADMIN) && (<li><Link to={ROUTES.ADMIN}>Admin</Link></li>)}
    <li><SignOutButton /></li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li class="nav-item"><Link to={ROUTES.LANDING} class="nav-link active">Inicio</Link></li>
    <li class="nav-item"><Link to={ROUTES.TRIPLIST} class="nav-link active">Listar Viajes de Compras</Link></li>
    <li class="nav-item"><Link to={ROUTES.TRIPNEW} class="nav-link active">Ingresar Viaje de Compras</Link></li>
    <li class="nav-item"><Link to={ROUTES.SIGN_IN} class="nav-link active">Ingresar / Registrarse</Link></li>
  </ul>
);

export default Navigation;
