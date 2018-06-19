import React, { Component } from "react";
import ReactDOM from "react-dom";
import { relative } from 'path';

// Component
import ReqRideButton from './ReqRideButton';

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
import { CardActions, IconButton } from "@material-ui/core";
import withWidth from '@material-ui/core/withWidth';
import CircularProgress from '@material-ui/core/CircularProgress';

import Search from '@material-ui/icons/Search';
import DirectionsCar from '@material-ui/icons/DirectionsCar';

const styles = theme => ({
    searchButtonWrapper: {
        position: 'relative',
    },
    searchProgress: {
        // color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
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
    container_left: {
        height: '30%',
        width: '100%',
        // backgroundColor: 'yellow',
        // alignItems: 'center',
        // alignContent: 'center',
        // justifyContent: 'center',
        boxShadow: '0px 10px 20px -10px rgba(0,0,0,0.75)'
        // [theme.breakpoints.down('sm')]: {
        //     backgroundColor: theme.palette.secondary.main,
        // },
    },
    container_right: {
        // height: '35%',
        width: '100%',
        // backgroundColor: 'red'
    },
    container_right_input: {
        // height: '50px',
        // backgroundColor: "yellow",
        // alignItems: 'center',
        // alignContent: 'center',
        // justifyContent: 'center'
    },
    container_right_button: {
        textAlign: 'center',
        marginTop: '20px'
    },
    container_down: {
        // height: '50%',
        width: '100%',
        // backgroundColor: 'blue'
        // height: 'calc(100% - 350px)',
    },
    display_card_container: {
        // height: '100%',
        // alignItems: 'center',
        // alignContent: 'center',
        // justifyContent: 'center'
    },
    
    textField: {
        // height: '20px',
        width: '100%'
    },
    map: {
        width: '100%',
        height: '100%'
    },

    display_item: {
        width: '100%',
        height: '90px'
    },
    display_card: {
        height: '90%',
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"

    },
    display_card_content: {
        width: "70%",
        // flexDirection: "row",
        // alignContent: "stretch",
        // alignItems: "stretch"
    },
    display_card_icon: {
        width: "10%"
    },
    display_card_name: {
        fontSize: 12,
        marginTop: 8
    },
    display_card_price: {
        fontSize: 20
        // marginButtom: 8
    },
    display_card_action: {
        textAlign: "center",
        // alignItems: "center",
        // alignContent: "center"
        // width: "30%"
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
            uberData: undefined,
            lyftData: undefined,
            loading: false
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
                anchorPoint: new maps.Point(0, 0),
                title: "Departure",
                draggable: true
            });
            var destMarker = new maps.Marker({
                map: map,
                anchorPoint: new maps.Point(0, 0),
                title: "Destination",
                draggable: true
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

        this.setState({
            loading: true
        });

        const deparLat = this.state.req.deparLatLng.lat();
        const deparLng = this.state.req.deparLatLng.lng();
        const destLat = this.state.req.destLatLng.lat();
        const destLng = this.state.req.destLatLng.lng();

        // const uberAPI = `https://api.uber.com/v1.2/estimates/price?start_latitude=${deparLat}&start_longitude=${deparLng}&end_latitude=${destLat}&end_longitude=${destLng}`;
        // const lyftAPI = `https://api.lyft.com/v1/cost?start_lat=${deparLat}&start_lng=${deparLng}&end_lat=${destLat}&end_lng=${destLng}`;
        
        const queryParam = `?depar_lat=${deparLat}&depar_lng=${deparLng}&dest_lat=${destLat}&dest_lng=${destLng}`;
        const uberAPI = "https://lyber-server.herokuapp.com/api/uber" + queryParam;
        const lyftAPI = "https://lyber-server.herokuapp.com/api/lyft" + queryParam;
        
        // console.log(uberAPI);
        // console.log(lyftAPI);
        // console.log(queryParam);
        
        console.log('Depar: ', deparLat, deparLng);
        console.log('Dest: ', destLat, destLng);

        const uberData = fetch(uberAPI, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => this.setState({
            uberData: data
        }))
        .then(() => {
            if (this.state.lyftData) {
                this.setState({
                    loading: false
                })
            }
        });

        const lyftData = fetch(lyftAPI, {
            method: 'GET'
        })
        .then(resposne => resposne.json())
        .then(data => this.setState({
            lyftData: data
        }))
        .then(() => {
            if (this.state.uberData) {
                this.setState({
                    loading: false
                });
            }
        });
    }

    componentDidMount() {
        this.loadAutoComplete();
    }

    componentDidUpdate() {
        if (this.state.uberData) {
            console.log(this.state.uberData);
        }

        if (this.state.lyftData) {
            console.log(this.state.lyftData);
        }
    }

    render() {
        const { loading } = this.state;

        const { classes } = this.props;

        const { width } = this.props;

        const isMobile = width == "xs" || width == "sm" || width == "md"
        
        console.log("width", width);


        /**
         * Generate test cards for permanent display
         */
        // var testCardsList = []
        // for (var i = 0; i < 2; i++) {
        //     testCardsList.push(
        //         <Grid item key={i} className={classes.display_item}>
        //             <Card className={classes.display_card}>
        //                 <CardContent className={classes.display_card_icon}>
        //                     <IconButton variant="contained" color="primary">
        //                         <DirectionsCar />
        //                     </IconButton>
        //                 </CardContent>
        //                 <CardContent className={classes.display_card_content}>
        //                     <Typography variant="headline" component="p" className={classes.display_card_price}>
        //                         $8 ~ $9
        //                     </Typography>
        //                     <Typography color="textSecondary" className={classes.display_card_name}>
        //                         Test Card
        //                     </Typography>
        //                 </CardContent>
        //                 <CardContent className={classes.display_card_action}>
        //                     <ReqRideButton/>
        //                     <Typography color="textSecondary" className={classes.display_card_name}>
        //                         ETA: 3mins
        //                     </Typography>
        //                 </CardContent>
        //             </Card>
        //         </Grid>
                
        //     );
        // }


        return (
            <div className={classes.wrapper}>
                <Grid container direction="row" className={classes.container}>
                    <Grid item className={classes.container_left}>
                        <div id="mapRef" className={classes.map}></div> 
                    </Grid>
                    <Grid item className={classes.container_right}>
                        <Grid container direction='row' className={classes.container_right_input}>
                            <Grid item xs={12} sm={12} className={classes.container_right_item}>    
                                <TextField 
                                    id="deparRef"
                                    className={classes.textField}
                                    label="Departure"
                                    margin="normal"
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={12} className={classes.container_right_item}>
                                <TextField
                                    id="destRef"
                                    className={classes.textField}
                                    label="Destination"
                                    margin="normal"
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={12} className={classes.container_right_button} >
                                {/* <Button variant="contained" color="primary" onClick={this.estimateFare.bind(this)}> Estimate Fare! </Button> */}
                                {
                                    loading ? <CircularProgress size={32}/> :   
                                        <IconButton variant="contained" color="primary" onClick={this.estimateFare.bind(this)}>
                                            <Search />
                                        </IconButton>
                                    
                                    
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.container_down}>
                        <Grid container spacing={16} className={classes.display_card_container}>
                        
                        {/* {
                            testCardsList
                        } */}

                        {
                            this.state.uberData && this.state.lyftData &&
                            this.state.uberData.prices.map(function(item, i) {
                                const name = item.display_name;
                                const estimate = item.low_estimate;
                                const distance = item.distance;
                                const deparLat = this.state.req.deparLatLng.lat();
                                const deparLng = this.state.req.deparLatLng.lng();
                                const destLat = this.state.req.destLatLng.lat();
                                const destLng = this.state.req.destLatLng.lng();
                                
                                console.log("Depar", deparLat, deparLng, "Dest", destLat, destLng);
                                
                                return (
                                    <Grid item key={i} className={classes.display_item}>
                                        <Card className={classes.display_card}>
                                            <CardContent className={classes.display_card_icon}>
                                                <IconButton variant="contained" color="primary">
                                                    <DirectionsCar />
                                                </IconButton>
                                            </CardContent>
                                            <CardContent className={classes.display_card_content}>
                                                <Typography variant="headline" component="p" className={classes.display_card_price}>
                                                    ${estimate}
                                                </Typography>
                                                <Typography color="textSecondary" className={classes.display_card_name}>
                                                    {name}
                                                </Typography>
                                            </CardContent>
                                            <CardContent className={classes.display_card_action}>
                                                <ReqRideButton company="uber" deparLat={deparLat} deparLng={deparLng} destLat={destLat} destLng={destLng} />
                                                <Typography color="textSecondary" className={classes.display_card_name}>
                                                    ETA: {distance}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>


                                    // <Grid item xs={4} className={classes.display_card}>
                                    //     <Card>
                                    //         <CardContent>
                                    //             <IconButton variant="contained" color="primary" className={classes.display_card_icon}>
                                    //                 <DirectionsCar />
                                    //             </IconButton>
                                    //             <Typography color="textSecondary" className={classes.display_card_name}>
                                    //                 {name}
                                    //             </Typography>
                                    //             <Typography variant="headline" align="center" component="h2" className={classes.display_card_content}>
                                    //                 ${estimate}
                                    //             </Typography>
                                    //         </CardContent>
                                    //         <CardActions>
                                    //             <ReqRideButton deparLat={deparLat} deparLng={deparLng} destLat={destLat} destLng={destLng}/>
                                    //             {/* <Button size="small" color="primary">
                                    //                 Schedule
                                    //             </Button> */}
                                    //         </CardActions>
                                    //     </Card>
                                    // </Grid>
                                );
                            }.bind(this))
                        }
                        {
                            this.state.lyftData && this.state.uberData && 
                            this.state.lyftData.cost_estimates.map(function(item, i) {
                                const name = item.display_name;
                                const estimate = item.estimated_cost_cents_min / 100.0;
                                const distance = item.estimated_distance_miles;

                                const deparLat = this.state.req.deparLatLng.lat();
                                const deparLng = this.state.req.deparLatLng.lng();
                                const destLat = this.state.req.destLatLng.lat();
                                const destLng = this.state.req.destLatLng.lng();
                                
                                return (
                                    <Grid item key={i} className={classes.display_item}>
                                        <Card className={classes.display_card}>
                                            <CardContent className={classes.display_card_icon}>
                                                <IconButton variant="contained" color="primary">
                                                    <DirectionsCar />
                                                </IconButton>
                                            </CardContent>
                                            <CardContent className={classes.display_card_content}>
                                                <Typography variant="headline" component="p" className={classes.display_card_price}>
                                                    ${estimate}
                                                </Typography>
                                                <Typography color="textSecondary" className={classes.display_card_name}>
                                                    {name}
                                                </Typography>
                                            </CardContent>
                                            <CardContent className={classes.display_card_action}>
                                                <ReqRideButton company="lyft" deparLat={deparLat} deparLng={deparLng} destLat={destLat} destLng={destLng}/>
                                                <Typography color="textSecondary" className={classes.display_card_name}>
                                                    ETA: {distance}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>


                                    // <Grid item>
                                    //     <Card className={classes.display_card}>
                                    //         <CardContent>
                                    //             <Typography color="textSecondary" className={classes.display_card_name}>
                                    //                 {name}
                                    //             </Typography>
                                    //             <Typography variant="headline" align="center" component="h2" className={classes.display_card_content}>
                                    //                 ${estimate}
                                    //             </Typography>
                                    //         </CardContent>
                                    //         <CardActions>
                                    //             <Button size="small" color="primary">
                                    //                 Schedule
                                    //             </Button>
                                    //         </CardActions>
                                    //     </Card>
                                    // </Grid>
                                );
                            }.bind(this))
                        }
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

MainFrame.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withWidth()(withStyles(styles)(MainFrame));