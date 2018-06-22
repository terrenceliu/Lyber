import React, { Component } from 'react';

import { GoogleApiWrapper } from 'google-maps-react';

// MUI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Components
import MainFrame from './components/MainFrame';
import PlaceAutoComplete from './components/stale/PlaceAutoComplete';
import FareEstimator from './components/stale/FareEstimator';
import ToolBar from './components/ToolBar';
import Map from './components/Map';
import InputField from './components/InputField';
import SearchButton from './components/SearchButton';
import CardTable from './components/CardTable';

// UI
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';


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

const styles = theme => ({
    wrapper: {
        height: '100vh',
        // backgroundColor: 'grey',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: '10px'
    },
    container: {
        height: '100%',
        width: '90vw',
        // backgroundColor: 'cyan',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        justifyContent: 'flex-start'
    }
});

class App extends Component {
    constructor() {
        super();
        // PUT STATE UPWARDS
        // ONLY PASS DOWN DATA TO CHILD COMPONENTS
        this.state = {
            deparLat: undefined,
            deparLng: undefined,
            deparAddr: undefined,
            destLat: undefined,
            destLng: undefined,
            deparAddr: undefined,
            uberData: undefined,
            lyftData: undefined
        }
    }

    /**
     * 
     * Update the position
     * 
     * Doc: {@link  https://developers.google.com/maps/documentation/javascript/reference/3/places-service#PlaceResult}
     * 
     * @param {String} tag              Tag of endpoint. `depar || dest`
     * @param {Object} location         {lat: , lng: }
     * @param {String} [displayName]    Address / Nickname of the location displayed on the text field
     */
    updateLocation = (tag, location, displayName) => {
        console.log(tag, location, displayName);

        // Optional Param
        displayName = displayName || undefined;
        
        if (tag == "depar" && location) {
            if (displayName) {
                this.setState({
                    deparLat: location.lat, 
                    deparLng: location.lng,
                    deparAddr: displayName
                });
            } else {
                // TODO: Reverse location lookup
                this.setState({
                    deparLat: location.lat, 
                    deparLng: location.lng,
                });
            }
        } else if (tag == "dest" && location) {
            if (displayName) {
                this.setState({
                    destLat: location.lat, 
                    destLng: location.lng,
                    destAddr: displayName
                });
            } else {
                // TODO: Reverse location lookup
                this.setState({
                    destLat: location.lat, 
                    destLng: location.lng,
                });
            }
        } else {
            console.log("[Err] Undefined tag/place");
        }
    }

    setCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.updateLocation("depar", { lat: position.coords.latitude, lng: position.coords.longitude });
            });
        }
    }

    searchFare = () => {
        if (!this.state.deparLat || !this.state.deparLng || !this.state.destLat || !this.state.destLng) {
            alert('Please set both departure address and destination address.');
            return;
        }

        const deparLat = this.state.deparLat;
        const deparLng = this.state.deparLng;
        const destLat = this.state.destLat;
        const destLng = this.state.destLng;

        const queryParam = `?depar_lat=${deparLat}&depar_lng=${deparLng}&dest_lat=${destLat}&dest_lng=${destLng}`;
        const uberAPI = "https://lyber-server.herokuapp.com/api/uber" + queryParam;
        const lyftAPI = "https://lyber-server.herokuapp.com/api/lyft" + queryParam;

        // TODO: 
        const uberData = fetch(uberAPI, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => this.setState({
            uberData: data
        }))
        // .then(() => {
        //     if (this.state.lyftData) {
        //         this.setState({
        //             loading: false
        //         })
        //     }
        // });

        // TODO: 
        const lyftData = fetch(lyftAPI, {
            method: 'GET'
        })
        .then(resposne => resposne.json())
        .then(data => this.setState({
            lyftData: data
        }))
        // .then(() => {
        //     if (this.state.uberData) {
        //         this.setState({
        //             loading: false
        //         });
        //     }
        // });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="appContainer">
                <MuiThemeProvider theme={theme}> 
                    <ToolBar disableGutters="true"/>

                    <div className={classes.wrapper}>
                        <Grid container direction="row" className={classes.container}>
                            <Map google={this.props.google} 
                                deparLat={this.state.deparLat} 
                                deparLng={this.state.deparLng}
                                destLat={this.state.destLat}
                                destLng={this.state.destLng}
                                deparViewPort={this.state.deparPlace ? this.state.deparPlace.geometry.viewport : undefined}
                                destViewPort={this.state.destPlac ? this.state.destPlace.geometry.viewport : undefined} 
                                // updateLocation={this.updateLocation}
                            />
                            <InputField 
                                google={this.props.google} 
                                updateLocation={this.updateLocation}
                            />
                            <Button onClick={this.setCurrentLocation} color="primary" style={{width: '100%', textAlign: "center"}}>
                                Current Loc
                            </Button>
                            <SearchButton 
                                onClick={ this.searchFare.bind(this) }
                            />
                            <CardTable 
                                uberData={ this.state.uberData }
                                lyftData={ this.state.lyftData }
                                deparLat={this.state.deparLat} 
                                deparLng={this.state.deparLng}
                                destLat={this.state.destLat}
                                destLng={this.state.destLng}
                                deparAddr={this.state.deparAddr}
                                destAddr={this.state.destAddr}
                            />
                        </Grid>
                    </div>                
                    {/* <MainFrame google={this.props.google} /> */}
                    {/* <PlaceAutoComplete google={this.props.google} setLoc={this.setLoc.bind(this)}/> */}
                    {/* <FareEstimator deparLatLng={this.state.deparLatLng} destLatLng={this.state.destLatLng} /> */}
                </MuiThemeProvider>
            </div>
        )
    }
}

var config = require('../config.json');
export default GoogleApiWrapper({
    apiKey: config.googleToken,
  })(withStyles(styles)(App));