import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class showDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      trips: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.trips().on('value', snapshot => {
      const tripsObject = snapshot.val();
      const trips = Object.keys(tripsObject).map(key => ({
        ...tripsObject[key],
        uid: key,
      }));
      this.setState(state => ({
        trips,
        loading: false,
      }));
    });
  }

  componentWillUnmount() {
    this.props.firebase.trips().off();
  }

  render() {
    const { trips, loading } = this.state;

    return (
      <div>
        <h1>Viajes de Compras</h1>
        {loading && <div>Loading ...</div>}
        <TripList trips={trips} onRemove={this.onRemove} />
      </div>
    );
  }

   onRemove = tripId => {
   this.props.firebase.trip(tripId).remove();
   //style="visibility:hidden" class="divOne"
  };
}



const TripList = ({ trips, onRemove,showDetails }) => (
  <table class='table '>
    <thead class='thead-dark'>
        <tr>
            <th>Id</th>
            <th></th>
            <th>Lugar</th>
            <th>Fecha</th>
            <th>articles</th>
            <th></th>
        </tr>
    </thead>
    {trips.map(trip => (
    <tbody>
      <tr>
          <td>{trip.uid}</td>
          <td><div class="btn-group mr-2">
          <button type="button" class="btn btn-primary" onClick={() => showDetails(trip.uid)}>Ver Detalles</button></div></td>
          <td>{trip.place}</td><td>{trip.dateTrip}</td>
          <td>{trip.articles}</td>
          <td><div class="btn-group mr-2">
          <button type="button" class="btn btn-primary" onClick={() => onRemove(trip.uid)}>Remove</button></div></td>
      </tr>
    </tbody>
    ))}
</table>
);
export default withFirebase(AdminPage);
