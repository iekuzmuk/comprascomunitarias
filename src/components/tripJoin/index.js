import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization } from '../Session';//lo del email//
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { guid } from '../../utils';

let mensaje = '';


const SignUpPage = (props) => (
  <div>
    <TripJoinForm />
  </div>
);

const PEDIDO_INITIAL_STATE = {
	pedido_tripUid: '',
	pedido_uid: '',
 	pedido_error: null,
  pedido_userScore: '',
	pedido_articles: '',
	pedido_aproxArticles: '',
	pedido_aproxMinMaxPrice: '',
	pedido_comments: '',
  pedido_datePedido: '',
};

class TripJoinFormBase extends Component {
    constructor(props) {
    super(props);
    this.state = { ...PEDIDO_INITIAL_STATE };
    console.log("joiningComponent: " +this.props.tripId);  
  }

	submitPedido = () => {
    const pedido = {
      pedido_tripUid: document.getElementById('pedido_tripUid').value,
      pedido_userScore:0,
      pedido_datePedido: Date(),
      pedido_articles: document.getElementById('pedido_articles').value,
      pedido_aproxArticles: document.getElementById('pedido_aproxArticles').value,
      pedido_aproxMinMaxPrice: document.getElementById('pedido_aproxMinMaxPrice').value,
      pedido_comments: document.getElementById('pedido_comments').value,
    };
    console.log(pedido);
    this.props.firebase
    .pedido(guid())
    .set({
    	pedido_tripUid: pedido.pedido_tripUid,
    	pedido_userScore: pedido.pedido_userScore,
    	pedido_datePedido: pedido.pedido_datePedido,
    	pedido_articles: pedido.pedido_articles,
    	pedido_aproxArticles: pedido.pedido_aproxArticles,
    	pedido_aproxMinMaxPrice: pedido.pedido_aproxMinMaxPrice,
    	pedido_comments: pedido.pedido_comments,
  	})
  	.then(() => {mensaje = 'Pedido guardado correctamente!';
            this.setState({ ...PEDIDO_INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
  });
};

  onChange = event => {this.setState({ [event.target.name]: event.target.value });};


  render() {
    	const {
          pedido_tripUid,
          pedido_uid,
          pedido_userScore,
          pedido_articles,
          pedido_aproxArticles,
          pedido_aproxMinMaxPrice,
          pedido_comments,
          pedido_datePedido,
          pedido_error,
    	} = this.state;

    return (
    <form action="" class='form' onSubmit={this.onSubmit}>
    <AuthUserContext.Consumer>{authUser => (<h1>Account: {authUser.email}</h1>)}</AuthUserContext.Consumer>
    <div class="form-group">
        <label for="">Trip ID Viaje de Compras</label>
        <input class="form-control" placeholder='' type="text" name='pedido_tripUid' id='pedido_tripUid' onChange={this.onChange} value={pedido_tripUid}/>
    </div>
    <div class="form-group">
        <label for="">uid</label>
        <input class="form-control" placeholder='' type="text" name='pedido_uid' id='pedido_uid' onChange={this.onChange} value={pedido_uid}/>
    </div>
    <div class="form-group">
        <label for="">Articulos pedidos</label>
        <input class="form-control" placeholder='' type="text" name='pedido_articles' id='pedido_articles' onChange={this.onChange} value={pedido_articles}/>
    </div>
    <div class="form-group">
        <label for="">Aproximacion a los articulos pedidos</label>
        <input class="form-control" placeholder='' type="text" name='pedido_aproxArticles' id='pedido_aproxArticles' onChange={this.onChange} value={pedido_aproxArticles}/>
    </div>
    <div class="form-group">    
        <label for="">Aproximacion Precio (min - max)</label>
        <input class="form-control" placeholder='' type="text" name='pedido_aproxMinMaxPrice' id='pedido_aproxMinMaxPrice' onChange={this.onChange} value={pedido_aproxMinMaxPrice}/>
    </div>
     <div class="form-group">    
        <label for="">Comentarios Extra</label>
        <input class="form-control" placeholder='' type="text" name='pedido_comments' id='pedido_comments' onChange={this.onChange} value={pedido_comments}/>
    </div>
    <div class="actions">
        <button id='boton-nuevo' class='btn btn-primary' onClick={this.submitPedido} type="button">Ingresar Pedido</button>
        {pedido_error && <p>{pedido_error.message}</p>}
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

const TripJoinForm = compose(
  withRouter,
  withFirebase,
)(TripJoinFormBase);

export default SignUpPage;

export { TripJoinForm, SignUpLink };
