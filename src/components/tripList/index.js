import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization } from '../Session';//lo del email//
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { guid } from '../../utils';

class tripList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: '',
      trips: [],
      tripId : '',
      pedidos: [],
    };
  }

  componentDidMount() {
    this.setState({ mode: 'loading' });
    this.props.firebase.trips().on('value', snapshot => {
      const tripsObject = snapshot.val();
      const trips = Object.keys(tripsObject).map(key => ({
        ...tripsObject[key],
        uid: key,
      }));
      this.setState(state => ({
        trips,
        mode: 'listing',
      }));
    });
  }
  onShowDetails = tripId => {
      this.setState({ tripId: tripId });
      this.setState({ mode: 'bshowDetails' });
  };
  onShowPedidos = tripId => {
      this.setState({ tripId: tripId });

      //busca pedidos del viaje:
      this.props.firebase.pedidos().on('value', snapshot => {
      const pedidosObject = snapshot.val();
      const pedidos = Object.keys(pedidosObject).map(key => ({
        ...pedidosObject[key],
        uid: key,
      }));
      this.setState(state => ({
        pedidos,
        mode: 'bshowPedidos',
      }));
      });
      //busca pedidos del viaje:
      //this.setState({ mode: '' });
  };

  componentWillUnmount() {
    this.props.firebase.trips().off();
  }

  render() {
    const { trips, tripId, mode, pedidos  } = this.state;
    return (
      <div>
        <h1>Viajes de Compras</h1>
        {(this.state.mode === 'loading') && <div>Loading ...</div>}
        {(this.state.mode === 'listing') && <TripList trips={trips} onRemove={this.onRemove} onShowDetails={this.onShowDetails}  onShowPedidos={this.onShowPedidos} />}
        {(this.state.mode === 'bshowDetails') && <TripList1 trips={trips} tripId={this.state.tripId} onUnirse={this.onUnirse} />}
        {(this.state.mode === 'bJoining') && <TripJoinForm tripId={this.state.tripId}/>}
        {(this.state.mode === 'bshowPedidos') && <TripShowPedidos pedidos={pedidos} tripId={this.state.tripId}  onRemovePedido={this.onRemovePedido} onAprobePedido={this.onAprobePedido}/>}
      </div>
    );
  }

  onRemove = tripId => {
    this.props.firebase.trip(tripId).remove();
    //style="visibility:hidden" class="divOne"       
  };

  onRemovePedido = pedidoId => {
    this.props.firebase.pedido(pedidoId).remove();
    //style="visibility:hidden" class="divOne"       
  };

  onAprobePedido = pedidoId => {
    //this.props.firebase.pedido(pedidoId).remove();
    //style="visibility:hidden" class="divOne"       
  };
  onUnirse = tripId => {
      this.setState({ tripId: tripId });
      this.setState({ mode: 'bJoining' });
  };
}

const TripShowPedidos = ({ pedidos, tripId, onRemovePedido, onAprobePedido }) => (

  <table class='table '>
    <thead class='thead-dark'>
        <tr>
            <th>Id</th>
            <th>Articulos Pedidos</th>
            <th>Precio Aproximacion</th>
            <th>Comentarios</th>
            <th></th>
        </tr>
    </thead>
    {pedidos.map(pedido => (
    <tbody>
      <tr>
          <td>{pedido.uid}</td>
           <td>{pedido.pedido_articles}</td>
          <td>{pedido.pedido_aproxMinMaxPrice}</td>
          <td>{pedido.pedido_comments}</td>
          <td>
          <div class="btn-group mr-2"><button type="button" class="btn btn-success" onClick={() => onAprobePedido(pedido.uid)}>Aprobar</button></div>
          <div class="btn-group mr-2"><button type="button" class="btn btn-danger" onClick={() => onRemovePedido(pedido.uid)}>Eliminar</button></div></td>
      </tr>
    </tbody>
    ))}
</table>
);

const TripList = ({ trips, onShowDetails, onShowPedidos, onRemove }) => (

  <table class='table '>
    <thead class='thead-dark'>
        <tr>
            <th>Fecha</th>            
            <th>Lugar</th>
            <th>articulos</th>
            <th></th>
        </tr>
    </thead>
    {trips.map(trip => (
    <tbody>
      <tr>
          <td>{trip.dateTrip}</td>
          <td>{trip.place}</td>
          <td>{trip.articles}</td>
          <td>
          <div class="btn-group mr-2"><button type="button" class="btn btn-primary" onClick={() => onShowDetails(trip.uid)}>Ver Detalles</button></div>
          <div class="btn-group mr-2"><button type="button" class="btn btn-success" onClick={() => onShowPedidos(trip.uid)}>Ver Pedidos</button></div>
          <div class="btn-group mr-2"><button type="button" class="btn btn-danger" onClick={() => onRemove(trip.uid)}>Eliminar</button></div>
          </td>
      </tr>
    </tbody>
    ))}
</table>
);


const TripList1 = ({ trips, tripId, onUnirse }) => (
    <div>
    {trips.filter(trip => {return trip.uid === tripId;}).map(trip => (
    	<div>
         <b>Lugar:</b>{' '}{trip.place}<br />
         <b>Fecha:</b>{' '}{trip.dateTrip}<br />
         <b>Articulos:</b>{' '}{trip.articles}<br />
         <b>Espacio Disponible:</b>{' '}{trip.spaceAvailable}<br />
         <b>Forma de Pago:</b>{' '}{trip.paymentMethod}<br />
         <b>Forma de Entrega:</b>{' '}{trip.delivery}<br />
         <b>Fecha Limite Para Unirse:</b>{' '}{trip.dateLimitPurchase}<br />
         <b>Fecha Limite para la entrega:</b>{' '}{trip.dateLimitDelivery}<br />
         <b>Comision:</b>{' '}{trip.fee}<br />
         <b>comentarios:</b>{' '}{trip.comments}<br />
         <div class="btn-group mr-2">
          <button type="button" class="btn btn-success" onClick={() => onUnirse(trip.uid)}>Unirse</button></div>
         </div>
    ))}
	</div>
    );

export default withFirebase(tripList);

var PEDIDO_INITIAL_STATE = {
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


let mensaje = '';
class TripJoinFormBase extends Component {
    constructor(props) {
    super(props);
    this.state = { ...PEDIDO_INITIAL_STATE };
    console.log("tripID_porfin: "+this.props.tripId);
     this.setState({ pedido_tripUid: 'this.props.tripId' });
    
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
      let {
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


    console.log("state.pedido_tripUid: "+this.state.pedido_tripUid);
    pedido_tripUid = this.props.tripId;
    return (
    <form action="" class='form' onSubmit={this.onSubmit}>
    <div class="form-group" >
        <label >Trip ID Viaje de Compras</label>
        <input class="form-control" placeholder='' type="text" name='pedido_tripUid' id='pedido_tripUid' onChange={this.onChange} value={pedido_tripUid}/>
    </div>
    <div class="form-group">
        <label >uid</label>
        <input class="form-control" placeholder='' type="text" name='pedido_uid' id='pedido_uid' onChange={this.onChange} value={pedido_uid}/>
        <AuthUserContext.Consumer>{pedido_uid = authUser => (authUser.email)}</AuthUserContext.Consumer>
    </div>
    <div class="form-group">
        <label >Articulos pedidos</label>
        <input class="form-control" placeholder='' type="text" name='pedido_articles' id='pedido_articles' onChange={this.onChange} value={pedido_articles}/>
    </div>
    <div class="form-group">
        <label >Aproximacion a los articulos pedidos</label>
        <input class="form-control" placeholder='' type="text" name='pedido_aproxArticles' id='pedido_aproxArticles' onChange={this.onChange} value={pedido_aproxArticles}/>
    </div>
    <div class="form-group">    
        <label >Aproximacion Precio (min - max)</label>
        <input class="form-control" placeholder='' type="text" name='pedido_aproxMinMaxPrice' id='pedido_aproxMinMaxPrice' onChange={this.onChange} value={pedido_aproxMinMaxPrice}/>
    </div>
     <div class="form-group">    
        <label >Comentarios Extra</label>
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


const TripJoinForm = compose(
  withRouter,
  withFirebase,
)(TripJoinFormBase);

export { TripJoinForm };