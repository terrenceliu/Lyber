import React, { Component } from 'react';

import { GoogleApiWrapper } from 'google-maps-react';

// Components
import PlaceAutoComplete from './components/PlaceAutoComplete';

class App extends Component {
    render() {
        return (
            <div>
                <h1> Lyber </h1>
                <PlaceAutoComplete google={this.props.google}/>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCRkw7Lzkby2rK2AWoEenHlX_RQ19A_Hp0',
  })(App);