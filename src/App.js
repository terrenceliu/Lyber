import React, { Component } from 'react';

import { GoogleApiWrapper } from 'google-maps-react';


// MUI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

// Components
import MainFrame from './components/MainFrame';
import PlaceAutoComplete from './components/PlaceAutoComplete';
import FareEstimator from './components/FareEstimator';
import ToolBar from './components/ToolBar';

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
            <MuiThemeProvider>
                <div className="wrapper">
                    <div className="main">
                        <div className="container"> 
                            <ToolBar disableGutters="true"/>                
                            <MainFrame google={this.props.google} />
                            {/* <PlaceAutoComplete google={this.props.google} setLoc={this.setLoc.bind(this)}/> */}
                            {/* <FareEstimator deparLatLng={this.state.deparLatLng} destLatLng={this.state.destLatLng} /> */}
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

var config = require('../config.json');
const googleToken = config.googleToken;
export default GoogleApiWrapper({
    apiKey: googleToken,
  })(App);