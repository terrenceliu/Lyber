import React, { Component } from 'react';
import { CardActions, IconButton } from "@material-ui/core";
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// UI
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    container: {
        height: '30%',
        width: '100%',
        boxShadow: '0px 10px 20px -10px rgba(0,0,0,0.75)'
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

            this.deparMarker = new maps.Marker({
                map: this.map,
                anchorPoint: new maps.Point(0, 0),
                title: "Departure",
                draggable: true
            });

            this.destMarker = new maps.Marker({
                map: this.map,
                anchorPoint: new maps.Point(0, 0),
                title: "Destination",
                draggable: true
            })

            // Draggable Marker Listener
            this.deparMarker.addListener('dragend', () => {
                // TODO: Update `InputField` formatted address.
                
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
                this.map.setCenter(latLng);
                this.map.setZoom(16);
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
                this.map.setCenter(latLng);
                this.map.setZoom(16);
            }

            // console.log(this.deparMarker, this.destMarker);
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

