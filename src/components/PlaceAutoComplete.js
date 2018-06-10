import React, { Component } from "react";
import ReactDOM from "react-dom";
import { relative } from 'path';

class PlaceAutoComplete extends Component {
    
    /**
     * TODO: Seperate PlaceAutoComplete
     */
    constructor() {
        super();
        this.state = {
            deparAC: undefined,
            deparMarker: undefined,
            deparPlace: undefined,
            destAC: undefined,
            destMarker: undefined,
            destPlace: undefined
        }
    }

    loadAutoComplete() {
        if (this.props && this.props.google) {
            // Find props
            const { google } = this.props;
            const maps = google.maps;

            // Find ref hooks
            const deparRef = this.refs.deparRef;
            const destRef = this.refs.destRef;
            const mapRef = this.refs.mapRef;

            // Find hook nodes
            const deparNode = ReactDOM.findDOMNode(deparRef);
            const destNode = ReactDOM.findDOMNode(destRef);
            const mapNode = ReactDOM.findDOMNode(mapRef);

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
                        
                        console.log('[ViewBounds]');
                        console.log(deparBounds);
                        console.log(destBounds);

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

                this.props.setLoc('depar', place.geometry.location);
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
                        
                        console.log('[ViewBounds]');
                        console.log(deparBounds);
                        console.log(destBounds);
                        
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

                destMarker.setPosition(place.geometry.location);
                destMarker.setVisible(true);

                this.setState({
                    destPlace: place
                });

                this.props.setLoc('dest', place.geometry.location);
            }.bind(this));


            this.setState({
                deparAC: deparAC,
                deparMarker: deparMarker,
                destAC: destAC,
                destMarker: destMarker
            });

        }
    }

    componentDidMount() {
        this.loadAutoComplete();
    }

    render() {
        const style = {
            width: '50vw',
            height: '50vh',
            position: relative
        }

        return (
            <div>
                
                <input ref="deparRef" />
                <input ref="destRef" />

                <div>
                {    
                    this.state.deparPlace && 
                    <p>
                        [Test] Departure Address: { this.state.deparPlace.formatted_address } 
                    </p>
                }
                </div>
                <div>
                {
                    this.state.destPlace && 
                    <p>
                        [Test] Destination Address: { this.state.destPlace.formatted_address }
                    </p>
                }    
                </div>
                
                
                <div ref="mapRef" style={style}> Map Place Holder </div>
            </div>
        )
    }
}

export default PlaceAutoComplete;