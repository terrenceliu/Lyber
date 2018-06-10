import React, { Component } from "react";
import ReactDOM from "react-dom";
import { relative } from 'path';

class PlaceAutoComplete extends Component {
    
    constructor() {
        super();
        this.state = {
            deparAC: undefined,
            deparMarker: undefined,
            deparPlace: undefined,
            destAC: undefined,
            destMarker: undefined,
            destPlace: undefined,
            uberFare: undefined,
            lyftFare: undefined
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
                    map.fitBounds(place.geometry.viewport);
                    const deparBounds = place.geometry.viewport.toJSON();

                    /**
                     * TODO: Includes depar & dest within viewport's bounds
                     */
                    if (this.state.destPlace) {
                        const destBounds = this.state.destAC.getPlace().geometry.viewport.toJSON();
                        
                        const resBounds = {
                            south: undefined,
                            west: undefined,
                            north: undefined,
                            east: undefined

                        }
                        
                        // map.fitBounds(resBounds);
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
            }.bind(this));

            destAC.addListener('place_changed', function() {
                var place = destAC.getPlace();

                destMarker.setVisible(false);

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

                destMarker.setPosition(place.geometry.location);
                destMarker.setVisible(true);

                this.setState({
                    destPlace: place
                })
            }.bind(this));


            this.setState({
                deparAC: deparAC,
                deparMarker: deparMarker,
                destAC: destAC,
                destMarker: destMarker
            });

        }
    }

    estimateFare() {
        /**
         * TODO: Fetch fare estimates from uber api and lyft api.
         */
        this.setState({
            uberFare: 1,
            lyftFare: 1
        })
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
                <input ref="destRef" />  <button onClick={(e) => this.estimateFare(e)}> Estimate Fare! </button>

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
                <div>
                {
                    this.state.uberFare && this.state.lyftFare &&
                    <div>
                        <p>
                            Estimated Uber Fare: ${ this.state.uberFare }
                        </p>
                        <p>
                            Estimated Lyft Fare: ${ this.state.lyftFare }
                        </p>
                    </div>
                }
                </div>
                
                <div ref="mapRef" style={style}> Map Place Holder </div>
            </div>
        )
    }
}

export default PlaceAutoComplete;