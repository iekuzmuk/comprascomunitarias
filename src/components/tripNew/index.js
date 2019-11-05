import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization } from '../Session';//lo del email//
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { guid } from '../../utils';

let mensaje = '';

const SignUpPage = () => (
  <div>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	isAdmin: false,
	error: null,
	place: '',
	dateTrip: '',
	articles: '',
	spaceAvailable: '',
	paymentMethod: '',
	delivery: '',
	dateLimitPurchase: '',
	dateLimitDelivery: '',
	fee: '',
	comments: '',
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

	submitTrip = () => {
    const trip = {
      id: guid(),
      idUser: '',
      userScore:0,
      datePub: Date(),
      place: document.getElementById('place').value,
      dateTrip: document.getElementById('dateTrip').value,
      articles: document.getElementById('articles').value,
      spaceAvailable: document.getElementById('spaceAvailable').value,
      paymentMethod: document.getElementById('paymentMethod').value,
      delivery: document.getElementById('delivery').value,
      dateLimitPurchase: document.getElementById('dateLimitPurchase').value,
      dateLimitDelivery: document.getElementById('dateLimitDelivery').value,
      fee: document.getElementById('fee').value,
      comments: document.getElementById('comments').value,
    };
    console.log(trip);
    this.props.firebase
    .trip(guid())
    .set({
    	idUser: trip.idUser,
    	userScore: trip.userScore,
    	datePub: trip.datePub,
    	place: trip.place,
    	dateTrip: trip.dateTrip,
    	articles: trip.articles,
    	spaceAvailable: trip.spaceAvailable,
    	paymentMethod: trip.paymentMethod,
    	delivery: trip.delivery,
    	dateLimitPurchase: trip.dateLimitPurchase,
    	dateLimitDelivery: trip.dateLimitDelivery,
    	fee: trip.fee,
    	comments: trip.comments,
  	})
  	.then(() => {mensaje = 'Viaje de compras guardado correctamente!';
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
  });
};

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = [];

    if (isAdmin) {
      roles.push(ROLES.ADMIN);
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase Realtime Database too
        this.props.firebase
          .user(authUser.user.uid)
          .set({ username, email, roles })
          .then(() => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
          })
          .catch(error => { this.setState({ error }); });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    	const {
	      	username,
	      	email,
	      	passwordOne,
	      	passwordTwo,
	      	isAdmin,
	      	error,
	      	place,
	  		dateTrip,
	  	    articles,
	      	spaceAvailable,
	      	paymentMethod,
	      	delivery,
	      	dateLimitPurchase,
	      	dateLimitDelivery,
	      	fee,
	      	comments,
    	} = this.state;

    const isInvalid = passwordOne !== passwordTwo ||  passwordOne === '' || username === '' || email === '';

      return (
      <form action="" class='form' onSubmit={this.onSubmit}>
      <AuthUserContext.Consumer>{authUser => (<h1>Account: {authUser.email}</h1>)}</AuthUserContext.Consumer>
    <div class="form-group">
        <label for="">Lugar de Viaje</label>
        <input class="form-control" placeholder='' type="text" name='place' id='place' onChange={this.onChange} value={place}/>
    </div>
    <div class="form-group">
        <label for="">Fecha de Viaje</label>
        <input class="form-control" placeholder='' type="date" name='dateTrip' id='dateTrip' onChange={this.onChange} value={dateTrip}/>
    </div>
    <div class="form-group">
  		<label for="">Articulos posibles en Pedidos</label>
  		<textarea class="form-control" placeholder='' rows="5" name='articles' id='articles' onChange={this.onChange} value={articles}></textarea>
	</div>
    <div class="form-group">
        <label for="">Espacio disponible para Pedidos</label>
        <input class="form-control" placeholder='' type="text" name='spaceAvailable' id='spaceAvailable' onChange={this.onChange} value={spaceAvailable}/>
    </div>
    <div class="form-group">
        <label for="">Modalidad de pago de Pedido</label>
        <input class="form-control" placeholder='' type="text" name='paymentMethod' id='paymentMethod' onChange={this.onChange} value={paymentMethod}/>
    </div>
    <div class="form-group">    
        <label for="">Forma de Entrega de Pedido</label>
        <input class="form-control" placeholder='' type="text" name='delivery' id='delivery' onChange={this.onChange} value={delivery}/>
    </div>
    <div class="form-group">    
        <label for="">Fecha limite para Hacer de Pedido</label>
        <input class="form-control" placeholder='' type="date" name='dateLimitPurchase' id='dateLimitPurchase' onChange={this.onChange} value={dateLimitPurchase}/>
    </div>
    <div class="form-group">    
        <label for="">Fecha limite para Entrega de Pedido</label>
        <input class="form-control" placeholder='' type="date" name='dateLimitDelivery' id='dateLimitDelivery' onChange={this.onChange} value={dateLimitDelivery}/>
    </div>
    <div class="form-group">    
        <label for="">Comision</label>
        <input class="form-control" placeholder='' type="text" name='fee' id='fee' onChange={this.onChange} value={fee}/>
    </div>
     <div class="form-group">    
        <label for="">Comentarios Extra</label>
        <input class="form-control" placeholder='' type="text" name='comments' id='comments' onChange={this.onChange} value={comments}/>
    </div>
    <div class="actions">
        <button id='boton-nuevo' class='btn btn-primary' onClick={this.submitTrip} type="button">Ingresar Viaje de Compras</button>
        {error && <p>{error.message}</p>}
    </div>
</form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
