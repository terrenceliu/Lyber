import React, { Component } from 'react';
import { CardActions, IconButton } from "@material-ui/core";
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// UI
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    container: {
        // marginTop: '65px',
        height: '50%',
        width: '100%',
        boxShadow: '0px 5px 10px -5px rgba(0,0,0,0.75)'
    },
    map: {
        width: '100%',
        height: '100%'
    }
});

class Map extends Component {
    constructor() {
        super();
        this.map = undefined;
        this.deparMarker = undefined;
        this.destMarker = undefined;
        this.maps = undefined;
        this.locMarker = undefined;
        this.directionsService = undefined;
        this.directionsDisplay = undefined;
    }
    
    loadMap = () => {
        if (this.props && this.props.google) {
            // Define props
            const { google } = this.props;
            const maps = google.maps;

            // Add to local variable
            this.maps = maps;

            // Find hook nodes
            const mapNode = document.getElementById('mapRef');

            this.map = new maps.Map(mapNode, {
                // TODO: Set current location as default center
                center: {
                    lat: 29.721482, 
                    lng: -95.396827
                },
                zoom: 13
            })

            // Set up service & display
            this.directionsService = new maps.DirectionsService();
            this.directionsDisplay = new maps.DirectionsRenderer();

            this.locMarker = new maps.Marker({
                map: this.map,
                anchorPoing: new maps.Point(0, 0),
                title: "Current Location",
                icon: "https://www.materialui.co/materialIcons/maps/my_location_black_24x24.png",
                
            })

            this.deparMarker = new maps.Marker({
                map: this.map,
                anchorPoint: new maps.Point(0, 0),
                title: "Departure",
                draggable: true,
                icon: 'https://www.materialui.co/materialIcons/communication/location_on_black_48x48.png',
                animation: maps.Animation.DROP
            });

            this.destMarker = new maps.Marker({
                map: this.map,
                anchorPoint: new maps.Point(0, 0),
                title: "Destination",
                draggable: true,
                icon: 'https://www.materialui.co/materialIcons/communication/location_on_black_48x48.png',
                animation: maps.Animation.DROP
            })

            // Get current location
            navigator.geolocation.getCurrentPosition((position) => {
                var currentPosition = { 
                    lat: position.coords.latitude, 
                    lng: position.coords.longitude 
                }
                this.locMarker.setPosition(currentPosition)
                this.locMarker.setVisible(true);
            })

            this.deparMarker.addListener('click', () => {
                this.map.panTo(this.deparMarker.getPosition());
                this.map.setZoom(16);
            })

            this.destMarker.addListener('click', () => {
                this.map.panTo(this.destMarker.getPosition());
                this.map.setZoom(16);
            })

            // Draggable Marker Listener
            this.deparMarker.addListener('dragend', () => {
                // TODO: Update `InputField` formatted address.
                // Update location
                let newPosition = this.deparMarker.getPosition().toJSON();
                let updateLocation = this.props.updateLocation;
                updateLocation("depar", newPosition);                
            });
            
            this.destMarker.addListener('dragend', () => {
                // TODO: Update `InputField` formatted address.
                let newPosition = this.destMarker.getPosition().toJSON();
                let updateLocation = this.props.updateLocation;
                updateLocation("dest", newPosition);  
            });
        }
    }

    /**
     * Update the depar marker and/or dest marker given coordinates.
     * 
     * If (lat, lng) is `undefined`, remove the corresponding marker.
     * 
     * @param {var} deparLat        The latitude of departure
     * @param {var} deparLng        
     * @param {var} destLat
     * @param {var} destLng   
     * @param {Object} [viewport]   The viewport of depar / dest    
     */
    updateMarker = (deparLat, deparLng, destLat, destLng, deparViewPort, destViewPort) => {
        // Optional Paramters
        deparViewPort = deparViewPort || undefined;
        destViewPort = destViewPort || undefined;
        
        // console.log(deparLat, deparLng, destLat, destLng, deparViewPort, destViewPort);

        const maps = this.maps;

        if (deparLat && deparLng) {
            var latLng = new maps.LatLng({
                lat: deparLat,
                lng: deparLng
            })

            this.deparMarker.setVisible(false);
            this.deparMarker.setPosition(latLng);
            this.deparMarker.setVisible(true);

            if (deparViewPort) {
                this.map.fitBounds(deparViewPort);
            } else {
                this.map.setZoom(15.5);
                this.map.panTo(latLng);
            }

            // console.log(this.deparMarker, this.destMarker);
        } else {
            if (this.deparMarker) {
                this.deparMarker.setVisible(false);
            }
        }
        
        if (destLat && destLng) {
            var latLng = new maps.LatLng({
                lat: destLat,
                lng: destLng
            })
            
            this.destMarker.setVisible(false);
            this.destMarker.setPosition(latLng);
            this.destMarker.setVisible(true);
            // this.map.setCenter(latLng);
            
            if (destViewPort) {
                this.map.fitBounds(destViewPort);
            } else {
                this.map.setZoom(15.5);
                this.map.panTo(latLng);
            }

            // console.log(this.deparMarker, this.destMarker);
        }  else {
            if (this.destMarker) {
                this.destMarker.setVisible(false);
            }
        }

        if (deparLat && deparLng && destLat && destLng) {
            var deparBounds = new maps.LatLngBounds();
            deparBounds.extend({
                lat: deparLat,
                lng: deparLng
            });

            var destBounds = new maps.LatLngBounds();
            destBounds.extend({
                lat: destLat,
                lng: destLng
            });

            var bounds = deparBounds.union(destBounds);

            this.map.fitBounds(bounds);
        }

        // this.drawRoute(deparLat, deparLng, destLat, destLng);
    }

    drawRoute = (deparLat, deparLng, destLat, destLng) => {
        const { google } = this.props;
        const maps = google.maps;
        const map = this.map;
        var directionsDisplay = this.directionsDisplay;
        var directionsService = this.directionsService;

        
        
        if (deparLat && deparLng && destLat && destLng) {
            // Draw routes if both departure and destination have been set

            directionsDisplay.setMap(map);

            // Marker options
            directionsDisplay.setOptions({
                dragable: true,
                markerOptions: {
                    icon: 'https://www.materialui.co/materialIcons/communication/location_on_black_48x48.png',
                    // draggable: true
                }
            });

            // Disable markers
            this.deparMarker.setVisible(false);
            this.destMarker.setVisible(false);

            var request = {
                origin: this.deparMarker.getPosition(),
                destination: this.destMarker.getPosition(),
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            });
        } else {
            // Clear routes
            // console.log("[Route] Clear routes!");
            if (directionsDisplay) {
                directionsDisplay.setMap(null);
            }
        }
    }
    
    componentDidMount = () => {
        this.loadMap();
    }
    
    render() {
        const { classes } = this.props;

        const { deparLat, deparLng, destLat, destLng, deparViewPort, destViewPort } = this.props;

        this.updateMarker(deparLat, deparLng, destLat, destLng, deparViewPort, destViewPort);

        return (
            <Grid item className={classes.container}>
                <div id="mapRef" className={classes.map}></div> 
            </Grid>
        );
    }
}

Map.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withWidth()(withStyles(styles)(Map));

