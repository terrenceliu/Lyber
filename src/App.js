import React, { Component } from 'react';

import { GoogleApiWrapper } from 'google-maps-react';

// MUI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';

// Components
import MainFrame from './components/MainFrame';
import PlaceAutoComplete from './components/stale/PlaceAutoComplete';
import FareEstimator from './components/stale/FareEstimator';
import ToolBar from './components/ToolBar';

const theme = createMuiTheme({
    palette: {
        // primary: {
        //     // light: will be calculated from palette.primary.main,
        //     main: '#03A9F4',
        //     // dark: will be calculated from palette.primary.main,
        //     // contrastText: will be calculated to contast with palette.primary.main
        //   },
        //   secondary: {
        //     light: '#0066ff',
        //     main: '#352384',
        //     // dark: will be calculated from palette.secondary.main,
        //     contrastText: '#000000',
        //   },
        //   // error: will use the default color

        type: 'light'
    }
});

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
            <div className="appContainer">
                <MuiThemeProvider theme={theme}>
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
            </div>
        )
    }
}

var config = require('../config.json');
const googleToken = config.googleToken;
export default GoogleApiWrapper({
    apiKey: googleToken,
  })(App);