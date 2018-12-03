import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class AdminPage extends Component {
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
        <TripList trips={trips} />
      </div>
    );
  }
}

const TripList = ({ trips }) => (
  <ul>
    {trips.map(trip => (
      <li key={trip.uid}>
        <span>
          <strong>Place:</strong> {trip.place}
        </span>
        <span>
          <strong>Fecha:</strong> {trip.dateTrip}
        </span>
        <span>
          <strong>Articulos:</strong> {trip.articles}
        </span>
      </li>
    ))}
  </ul>
);
export default withFirebase(AdminPage);
