import React, { Component } from "react";
import ReactDOM from "react-dom";
import { relative } from 'path';

class PlaceAutoComplete extends Component {
    
    constructor() {
        super();
        this.state = {
            autocomplete: undefined,
            addr: undefined
        }
    }

    loadAutoComplete() {
        if (this.props && this.props.google) {
            
            console.log("Has google!");

            const { google } = this.props;
            const maps = google.maps;

            const inputRef = this.refs.acinput;
            const node = ReactDOM.findDOMNode(inputRef);
            
            const autocomplete = new maps.places.Autocomplete(node)
            
            autocomplete.addListener('place_changed', function() {
                var place = autocomplete.getPlace();

                console.log(place);
                
                this.setState({
                    addr: place.formatted_address
                })

                console.log(this.state);
            }.bind(this));

            this.setState({
                autocomplete: autocomplete
            });


        }
    }
    
    componentDidMount() {
        this.loadAutoComplete();
    }

    componentDidUpdate() {
        console.log("Update!");
        console.log(this.state.location);
    }

    render() {
        return (
            <div>
                <h3> Search Places </h3>
                <input ref="acinput" />
                <div>
                    <p> Location: {this.state.addr} </p>
                </div>
            </div>
        )
    }
}

export default PlaceAutoComplete;