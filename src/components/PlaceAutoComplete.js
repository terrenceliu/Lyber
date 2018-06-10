import React, { Component } from "react";
import ReactDOM from "react-dom";
import { relative } from 'path';

class PlaceAutoComplete extends Component {
    
    constructor() {
        super();
        this.state = {
            posMarker: undefined,
            deparAC: undefined,
            deparPlace: undefined,
            destAC: undefined,
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

            // Instantiate Autocomplete to the nodes
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
            var posMarker = new maps.Marker({
                map: map,
                anchorPoint: new maps.Point(0, 0)
            });
            

            deparAC.addListener('place_changed', function() {
                var place = deparAC.getPlace();

                posMarker.setVisible(false);

                if (!place.geometry) {
                    alert("Details unavailable for input: " + place.name + ".");
                    return;
                }

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(16);
                }

                posMarker.setPosition(place.geometry.location);
                posMarker.setVisible(true);

                this.setState({
                    deparPlace: place
                })

                console.log(place);

            }.bind(this));

            destAC.addListener('place_changed', function() {
                var place = destAC.getPlace();

                posMarker.setVisible(false);

                if (!place.geometry) {
                    alert("Details unavailable for input: " + place.name + ".");
                    return;
                }

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(16);
                }

                posMarker.setPosition(place.geometry.location);
                posMarker.setVisible(true);

                this.setState({
                    destPlace: place
                })

                console.log(place);
            }.bind(this));


        }


        // if (this.props && this.props.google) {
            
        //     console.log("Has google!");

        //     const { google } = this.props;
        //     const maps = google.maps;
            
        //     const inputRef = this.refs.acinput;
        //     const node = ReactDOM.findDOMNode(inputRef);
            
        //     const autocomplete = new maps.places.Autocomplete(node)
            
        //     autocomplete.addListener('place_changed', function() {
        //         var place = autocomplete.getPlace();
                
        //         console.log(place);
                
        //         this.setState({
        //             addr: place.formatted_address
        //         })
                
        //         console.log(this.state);
        //     }.bind(this));

        //     this.setState({
        //         autocomplete: autocomplete
        //     });
        // }
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