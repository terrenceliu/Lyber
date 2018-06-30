import React, { Component } from 'react';
import queryString from 'query-string';
import { GoogleApiWrapper } from 'google-maps-react';

// MUI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Components
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
    },
    padding: {
        height: '15px',
        width: '100%',
        // backgroundColor: 'grey'
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
            estData: undefined,
            loading: true,
            userProfile: undefined
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
        // console.log(tag, location, displayName);
        
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

                this.geocodeLatLng("deparAddr", location);
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
                this.geocodeLatLng("destAddr", location);
                this.setState({
                    destLat: location.lat, 
                    destLng: location.lng,
                });
            }
        } else {
            console.log("[Err] Undefined tag/place");
        }
    }

    geocodeLatLng(name, latlng) {
        var { google } = this.props;
        var geocoder = new google.maps.Geocoder;

        geocoder.geocode({'location': latlng}, function (results, status) {
            this.setState({
                [name]: results[0]
            })
        }.bind(this));
    }
    
    setCurrentLocation() {
        if (navigator.geolocation) {
            // TODO: Hanlde failed case
            // var res = undefined
            // navigator.geolocation.getCurrentPosition((position) => {
            //     this.updateLocation("depar", { lat: position.coords.latitude, lng: position.coords.longitude });
            //     res =  { lat: position.coords.latitude, lng: position.coords.longitude }
            // });
            
            var getPosition = new Promise(function (resolve, reject) {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                }).then((position) => {
                    this.updateLocation("depar", { lat: position.coords.latitude, lng: position.coords.longitude });
                    return position;
                });
            
            return getPosition;

        } else {
            return "";
        }
    }
    
    searchFare = () => {
        if (!this.state.deparLat || !this.state.deparLng || !this.state.destLat || !this.state.destLng) {
            alert('Please set both departure address and destination address.');
            return;
        }

        // Set loading status
        this.setState({
            loading: true
        });

        // Set query param
        const deparLat = this.state.deparLat;
        const deparLng = this.state.deparLng;
        const destLat = this.state.destLat;
        const destLng = this.state.destLng;
        
        const queryParam = `?depar_lat=${deparLat}&depar_lng=${deparLng}&dest_lat=${destLat}&dest_lng=${destLng}`;

        const estimateAPI = "https://lyber-server.herokuapp.com/api/estimate" + queryParam;

        fetch(estimateAPI, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
            estData: data.prices,
            loading: false
            });
        });
    }

    /**
     * Life Cycle Hooks
     */
    componentDidMount() {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        
        if (!accessToken) {
            return;
        }

        console.log("AccessToken", accessToken);

        fetch("https://api.uber.com/v1.2/me", {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Accept-Language': 'en_U',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => this.setState({
            userProfile: data
        }))
        .then(() => console.log(this.state.userProfile))
        .catch(e => console.log(e));
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="appContainer">
                <MuiThemeProvider theme={theme}> 
                    <ToolBar disableGutters="true"/>
                    {
                        this.state.userProfile &&
                        <Typography variant="body1" color="inherit" className={classes.flex}>
                            Hello, {this.state.userProfile.first_name} {this.state.userProfile.last_name}
                        </Typography>
                    }
                    <div className={classes.wrapper}>
                        <Grid container direction="row" className={classes.container}>
                            <Map
                                google={this.props.google} 
                                deparLat={this.state.deparLat} 
                                deparLng={this.state.deparLng}
                                destLat={this.state.destLat}
                                destLng={this.state.destLng}
                                deparViewPort={this.state.deparPlace ? this.state.deparPlace.geometry.viewport : undefined}
                                destViewPort={this.state.destPlac ? this.state.destPlace.geometry.viewport : undefined} 
                                // updateLocation={this.updateLocation}
                            />
                            <div className={classes.padding}>
                            </div>
                            <InputField
                                className={classes.inputField} 
                                google={this.props.google} 
                                updateLocation={this.updateLocation}
                                handleCurrentLocation={this.setCurrentLocation.bind(this)}
                                handleSearch={this.searchFare.bind(this)}
                                deparAddr={this.state.deparAddr}
                                destAddr={this.state.destAddr}
                            />
                            <CardTable 
                                estData={this.state.estData}
                                deparLat={this.state.deparLat} 
                                deparLng={this.state.deparLng}
                                destLat={this.state.destLat}
                                destLng={this.state.destLng}
                                deparAddr={this.state.deparAddr}
                                destAddr={this.state.destAddr}
                            />
                                
                            {/* {
                                this.state.estData
                                ? <CardTable 
                                    estData={this.state.estData}
                                    deparLat={this.state.deparLat} 
                                    deparLng={this.state.deparLng}
                                    destLat={this.state.destLat}
                                    destLng={this.state.destLng}
                                    deparAddr={this.state.deparAddr}
                                    destAddr={this.state.destAddr}
                                />
                                : <InputField
                                    className={classes.inputField} 
                                    google={this.props.google} 
                                    updateLocation={this.updateLocation}
                                    handleCurrentLocation={this.setCurrentLocation}
                                    handleSearch={this.searchFare.bind(this)}
                                />
                                
                            } */}
                        </Grid>
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}

var googleToken = undefined;
if (process.env.googleToken) {
    googleToken = process.env.googleToken
} else {
    googleToken = require('../config.json').googleToken;
}


export default GoogleApiWrapper({
    apiKey: googleToken,
  })(withStyles(styles)(App));