import React, { Component } from 'react';

import { GoogleApiWrapper } from 'google-maps-react';

// Components
import PlaceAutoComplete from './components/PlaceAutoComplete';
import FareEstimator from './components/FareEstimator';

class App extends Component {
    constructor() {
        super();
        this.state = {
            deparLatLng: undefined,
            destLatLng: undefined
        }
    }

    setLoc(tag, latlng) {
        
        if (tag == 'depar') {
            this.setState({
                deparLatLng: latlng
            });
            console.log('[Depar] LatLng: ' + this.state.deparLatLng);
        } else if (tag == 'dest') {
            this.setState({
                destLatLng: latlng
            });
            console.log('[Dest] LatLng: ' + this.state.destLatLng);
        } else {
            console.log('[Err] Call back tag not found. Tag: ' + tag);
        }
    }

    render() {
        return (
            <div>
                <h1> Lyber </h1>
                <PlaceAutoComplete google={this.props.google} setLoc={this.setLoc.bind(this)}/>
                <FareEstimator deparLatLng={this.state.deparLatLng} destLatLng={this.state.destLatLng} />
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCRkw7Lzkby2rK2AWoEenHlX_RQ19A_Hp0',
  })(App);