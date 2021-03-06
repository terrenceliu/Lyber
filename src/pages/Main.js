import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

// MUI
import { withStyles } from '@material-ui/core/styles';

// Components
import Map from '../components/Map';
import InputField from '../components/InputField';
import CardTable from '../components/CardTable';


// UI
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

// Router
import { BrowserRouter as Router,
        Route,
        Link } from 'react-router-dom'



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
        width: '93vw',
        // backgroundColor: 'cyan',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        justifyContent: 'flex-start'
    },
    padding: {
        height: '15px',
        width: '100%',
        // backgroundColor: 'grey'
    },
    modal: {
        margin: 'auto',
        position: 'relative',
        width: theme.spacing.unit * 30,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[0],
        padding: theme.spacing.unit * 4,
        textAlign: 'center'
    },
});

class Main extends Component {
    constructor() {
        super();
        // PUT STATE UPWARDS
        // ONLY PASS DOWN DATA TO CHILD COMPONENTS
        this.state = {
            deparLat: undefined,
            deparLng: undefined,
            deparAddr: undefined,
            deparPlace: undefined,
            destLat: undefined,
            destLng: undefined,
            destPlace: undefined,
            destAddr: undefined,
            estData: undefined,
            loading: false,
            estErr: false,
            userProfile: undefined,
            estNotSupport: false
        }
    }

    handleModalClose = () => {
        this.setState({
            estErr: false,
            estNotSupport: false
        })
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
    updateLocation = (tag, location, displayName, place_id) => {
        
        // Optional Param
        displayName = displayName || undefined;
        
        // console.log("[UpdateLocation]", tag, location, displayName);

        if (tag == "depar") {
            if (location) {
                // Set location
                if (displayName && place_id) {
                    this.setState({
                        deparLat: location.lat, 
                        deparLng: location.lng,
                        deparAddr: displayName,
                        deparPlace: place_id
                    });
                } else {
                    this.geocodeLatLng("deparAddr", location);
                    this.setState({
                        deparLat: location.lat, 
                        deparLng: location.lng
                    });
                }
            } else {
                // Clear location
                this.setState({
                    deparLat: undefined,
                    deparLng: undefined,
                    deparAddr: undefined
                })
            }
        } else if (tag == "dest") {
            if (location) {
                if (displayName && place_id) {
                    this.setState({
                        destLat: location.lat, 
                        destLng: location.lng,
                        destAddr: displayName,
                        destPlace: place_id
                    });
                } else {
                    this.geocodeLatLng("destAddr", location);
                    this.setState({
                        destLat: location.lat, 
                        destLng: location.lng,
                    });
                }
            } else {
                this.setState({
                    destLat: undefined,
                    destLng: undefined,
                    destAddr: undefined
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
            if (status === 'OK') {
                // console.log("[GeoCoding]");
                this.setState({
                    [name]: results[0].formatted_address
                })
            } else {
                console.log("Failed to retrieve information");
                return;
            }
            
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
                }, (reject) => {
                   return undefined;
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
            loading: true,
            estData: undefined
        });

        // Set query param
        const deparLat = this.state.deparLat;
        const deparLng = this.state.deparLng;
        const destLat = this.state.destLat;
        const destLng = this.state.destLng;
        
        const destPlace = this.state.destPlace;
        const deparPlace = this.state.deparPlace;
        
        // console.log(destPlace, deparPlace);
        
        const queryParam = `?depar_lat=${deparLat}&depar_lng=${deparLng}&dest_lat=${destLat}&dest_lng=${destLng}&dest_ref=${destPlace}`;

        // const estimateAPI = "http://localhost:8000/api/estimate/beta" + queryParam;
        
        const estimateAPI = "https://lyber.co/api/estimate/beta" + queryParam;

        // console.log("Estimate Fare", estimateAPI);

        // console.log("Search URL", estimateAPI);

        this.getEstimate(estimateAPI);
    }
    
    getEstimate = (estimateAPI) => {
        fetch(estimateAPI, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            // console.log("[EstData]", data);
            if (data.prices) {
                // Check if all prices has estimate
                for (var i = 0; i < data.prices.length; i++) {
                    if (!data.prices[i].fare_estimate) {
                        this.setState({
                            estData: data.prices,
                            loading: false,
                            estNotSupport: true

                        })
                        return;
                    }
                }
                this.setState({
                    estData: data.prices,
                    loading: false
                });
                return
            }
        })
        .catch(err => {
            console.log(err)
            this.setState({
                loading: false,
                estErr: true
            });
            // this.getEstimate()
        });
    };

    /**
     * Life Cycle Hooks
     */
    componentDidUpdate(prevProps, prevState) {
        /**
         * FIXME: 
         * Delete estData when tap either pick up or drop off
         */
        if (this.state.estData && 
            ((!this.state.deparLat && !this.state.deparLng && !this.state.deparAddr) ||
            (!this.state.destLat && !this.state.destLat && !this.state.destAddr))) {
            this.setState({
                estData: undefined
            });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="appContainer">
                    <div className={classes.wrapper}>
                        <Grid container direction="row" className={classes.container}>
                            <Map
                                google={this.props.google} 
                                deparLat={this.state.deparLat} 
                                deparLng={this.state.deparLng}
                                destLat={this.state.destLat}
                                destLng={this.state.destLng}
                                updateLocation={this.updateLocation}
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
                                loading={this.state.loading}
                            />
                            {
                                this.state.estData &&
                                <CardTable 
                                    estData={this.state.estData}
                                    deparLat={this.state.deparLat} 
                                    deparLng={this.state.deparLng}
                                    destLat={this.state.destLat}
                                    destLng={this.state.destLng}
                                    deparAddr={this.state.deparAddr}
                                    destAddr={this.state.destAddr}
                                    estNotSupport={this.state.estNotSupport}
                                />
                            }
                        </Grid>
                    </div>
                    <Modal
                        open={this.state.estErr}
                        onClose={this.handleModalClose}
                    >
                        <div className={classes.modal}>
                            <Typography variant="body1">
                                Sorry, we're unable to provide the estimation for this trip.
                            </Typography>
                        </div>
                    </Modal>
                    <Modal
                        open={this.state.estNotSupport}
                        onClose={this.handleModalClose}
                    >
                        <div className={classes.modal}>
                            <Typography variant="body1">
                                Currently the server only supports services in Houston area. <br/> For any other cities, the pricing estimation
                                could be not accurate. 
                            </Typography>
                        </div>
                    </Modal>
                    
            </div>
        )
    }
}

const googleToken = require('../../config.json').googleToken;

// var googleToken = undefined;
// if (process.env.googleToken) {
//     googleToken = process.env.googleToken
// } else {
//     googleToken = 
// }

export default GoogleApiWrapper({
    apiKey: googleToken,
  })(withStyles(styles)(Main));