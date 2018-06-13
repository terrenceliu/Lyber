import React, { Component } from "react";
import ReactDOM from "react-dom";
import { relative } from 'path';

// UI
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
    wrapper: {
        height: '90vh',
        // backgroundColor: 'grey',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        height: '80vh',
        width: '1500px',
        // backgroundColor: 'purple',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    },
    container_left: {
        height: '100%',
        width: '35%',
        // backgroundColor: 'yellow',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        boxShadow: '0px 13px 40px -13px rgba(0,0,0,0.75)'
    },
    container_right: {
        height: '100%',
        width: '65%',
        // backgroundColor: 'red'
    },
    container_right_input: {
        width: '100%',
        height: '350px',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    },
    container_right_display: {
        width: '100%',
        height: 'calc(100% - 350px)',
    },
    display_card_container: {
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    },
    textField: {
        width: '650px',
    },
    map: {
        width: '100%',
        height: '100%'
    },
    display_card: {
        width: '100px',
        height: '100px'
    }
});

class MainFrame extends Component {

    constructor() {
        super();
        this.state = {
            deparAC: undefined,
            deparMarker: undefined,
            deparPlace: undefined,
            destAC: undefined,
            destMarker: undefined,
            destPlace: undefined,
            req: {
                deparLatLng: undefined,
                destLatLng: undefined
            },
            res: {
                uberData: undefined,
                lyftData: undefined
            }
        }
    }

    loadAutoComplete() {
        if (this.props && this.props.google) {
            // Find props
            const { google } = this.props;
            const maps = google.maps;

            // Find ref hooks
            // const mapRef = this.refs.mapRef;

            // Find hook nodes
            // const mapNode = ReactDOM.findDOMNode(mapRef);
            const mapNode = document.getElementById('mapRef');
            const deparNode = document.getElementById('deparRef');
            const destNode = document.getElementById('destRef');

            // Instantiate map components to the nodes
            var deparAC = new maps.places.Autocomplete(deparNode);
            var destAC = new maps.places.Autocomplete(destNode);
            var map = new maps.Map(mapNode, {
                // Set center to Jones College lol
                center: {
                    lat: 29.721482, 
                    lng: -95.396827
                },
                zoom: 13
            });
            
            var deparMarker = new maps.Marker({
                map: map,
                anchorPoint: new maps.Point(0, 0)
            });
            var destMarker = new maps.Marker({
                map: map,
                anchorPoint: new maps.Point(0, )
            })

            /**
             * TODO: Display directions between depar & dest
             */
            // var directionService = new maps.DirectionsService;
            // var directionDisplay = new maps.DirectionsRenderer;
            // directionDisplay.setMap(map);

            deparAC.addListener('place_changed', function() {
                var place = deparAC.getPlace();

                deparMarker.setVisible(false);

                if (!place.geometry) {
                    alert("Details unavailable for input: " + place.name + ".");
                    return;
                }

                if (place.geometry.viewport) {
                    const deparBounds = place.geometry.viewport.toJSON();

                    /**
                     * TODO: Includes depar & dest within viewport's bounds
                     * Does the algorithm look right for calculating bounds???
                     */
                    if (this.state.destPlace) {
                        
                        const destBounds = this.state.destAC.getPlace().geometry.viewport.toJSON();
                        
                        // console.log('[ViewBounds]');
                        // console.log(deparBounds);
                        // console.log(destBounds);

                        const resBounds = {
                            south: Math.max(deparBounds.south, deparBounds.north, destBounds.south, destBounds.north),
                            west:  Math.min(deparBounds.east, deparBounds.west, destBounds.east, destBounds.west),
                            north:  Math.min(deparBounds.south, deparBounds.north, destBounds.south, destBounds.north),
                            east: Math.max(deparBounds.east, deparBounds.west, destBounds.east, destBounds.west),
                        }
                        
                        map.fitBounds(resBounds);
                    } else {
                        map.fitBounds(deparBounds);
                    }

                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(16);
                }

                deparMarker.setPosition(place.geometry.location);
                deparMarker.setVisible(true);

                this.setState({
                    deparPlace: place
                })

                this.setLoc('depar', place.geometry.location);
            }.bind(this));

            destAC.addListener('place_changed', function() {
                var place = destAC.getPlace();

                destMarker.setVisible(false);

                if (!place.geometry) {
                    alert("Details unavailable for input: " + place.name + ".");
                    return;
                }

                if (place.geometry.viewport) {
                    const destBounds = place.geometry.viewport.toJSON();
                    if (this.state.deparPlace) {
                        const deparBounds = this.state.deparAC.getPlace().geometry.viewport.toJSON();
                        
                        // console.log('[ViewBounds]');
                        // console.log(deparBounds);
                        // console.log(destBounds);
                        
                        const resBounds = {
                            south: Math.max(deparBounds.south, deparBounds.north, destBounds.south, destBounds.north),
                            west:  Math.min(deparBounds.east, deparBounds.west, destBounds.east, destBounds.west),
                            north:  Math.min(deparBounds.south, deparBounds.north, destBounds.south, destBounds.north),
                            east: Math.max(deparBounds.east, deparBounds.west, destBounds.east, destBounds.west),
                        }
                        
                        map.fitBounds(resBounds);
                    } else {
                        map.fitBounds(destBounds);
                    }

                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(16);
                }

                destMarker.setPosition(place.geometry.location);
                destMarker.setVisible(true);

                this.setState({
                    destPlace: place
                });

                this.setLoc('dest', place.geometry.location);
            }.bind(this));


            this.setState({
                deparAC: deparAC,
                deparMarker: deparMarker,
                destAC: destAC,
                destMarker: destMarker
            });

        }
    }

    setLoc(tag, latlng) {
        if (tag == 'depar') {
            this.setState(function(prevState, props) {
                return {
                    req: {
                        destLatLng: prevState.req.destLatLng,
                        deparLatLng: latlng
                    }
                }
            });
        } else if (tag == 'dest') {
            this.setState(function(prevState, props) {
                return {
                    req: {
                        destLatLng: latlng,
                        deparLatLng: prevState.req.deparLatLng
                    }
                }
            });
        } else {
            console.log('[Err] Call back tag not found. Tag: ' + tag);
        }
    }

    estimateFare() {
        if (!this.state.req.deparLatLng || !this.state.req.destLatLng) {
            alert('Please set both departure address and destination address.');
            return;
        }

        var config = require('../../config.json');

        const deparLat = this.state.req.deparLatLng.lat();
        const deparLng = this.state.req.deparLatLng.lng();
        const destLat = this.state.req.destLatLng.lat();
        const destLng = this.state.req.destLatLng.lng();

        const uberAPI = `https://api.uber.com/v1.2/estimates/price?start_latitude=${deparLat}&start_longitude=${deparLng}&end_latitude=${destLat}&end_longitude=${destLng}`;
        const lyftAPI = `https://api.lyft.com/v1/cost?start_lat=${deparLat}&start_lng=${deparLng}&end_lat=${destLat}&end_lng=${destLng}`;
        const queryParam = `?depar_lat=${deparLat}&depar_lng=${deparLng}&dest_lat=${destLat}&dest_lng=${destLng}`;
        // console.log(uberAPI);
        // console.log(lyftAPI);
        console.log(queryParam);
        
        /**
         * TODO: Get token from .env or .config. Hide from public.
         */
        const uberToken = "Token " + config.uberToken;
        const uberData = fetch(uberAPI, {
            headers: {
                'Authorization': uberToken,
                'Accept-Language': 'en_US',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => this.setState({
            res: {
                uberData: data
            }
        }));

        /**
         * TODO: Set up server for post request.
         * Damn Lyft. Lyft API stops adding 'access-control-allow-origin; *' to the response.
         * Server is needed as a proxy for getting the data.
         * 
         */
        const lyftToken = "bearer " + config.lyftToken;
        const lyftData = fetch(lyftAPI, {
            headers: {
                'Authorization': lyftToken
            }
        }).then(resposne => resposne.json()).then(data => {
            console.log(data);
        });
    }

    cardFactory(name, distance, estimate_price) {
        
    }

    componentDidMount() {
        this.loadAutoComplete();
    }

    componentDidUpdate() {
        if (this.state.res.uberData) {
            console.log(this.state.res.uberData);
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.wrapper}>
                <Grid container className={classes.container}>
                    <Grid item className={classes.container_left}>
                        <div id="mapRef" className={classes.map}></div> 
                    </Grid>
                    <Grid item className={classes.container_right}>
                        <Grid container direction='column' spacing={24} className={classes.container_right_input}>
                            <Grid item>    
                                <TextField 
                                    id="deparRef"
                                    className={classes.textField}
                                    label="Departure"
                                    margin="normal"
                                    fullWidth />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="destRef"
                                    className={classes.textField}
                                    label="Destination"
                                    margin="normal"
                                    fullWidth />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.estimateFare.bind(this)}> Estimate Fare! </Button>
                            </Grid>
                        </Grid>
                        <div className={classes.container_right_display}>
                            <Grid container spacing={24} className={classes.display_card_container}>
                            {
                                this.state.res.uberData &&
                                this.state.res.uberData.prices.map(function(item, i) {
                                    const name = item.display_name;
                                    const estimate = item.estimate;
                                    const distance = item.distance;
                                    
                                    return (
                                        <Grid item>
                                            <Card className={classes.display_card}>
                                                <Typography color="textSecondary">
                                                    {name}
                                                </Typography>
                                                <Typography variant="headline" component="h2">
                                                    {estimate}
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    );
                                })
                            }
                            </Grid>
                        </div>

                    </Grid>
                </Grid>
            </div>
        )
    }
}

MainFrame.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(MainFrame);