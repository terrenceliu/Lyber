import React, { Component } from 'react';
import ReactDOM from "react-dom";
import Button from '@material-ui/core/Button';

class FareEstimator extends Component {
    constructor() {
        super();
        this.state = {
            uberFare: undefined,
            lyftFare: undefined,
        };
    }

    componentDidUpdate() {

    }

    estimateFare() {
        if (!this.props.deparLatLng || !this.props.destLatLng) {
            alert('Please set both departure address and destination address.');
            return;
        }

        var config = require('../../config.json');

        const deparLat = this.props.deparLatLng.lat();
        const deparLng = this.props.deparLatLng.lng();
        const destLat = this.props.destLatLng.lat();
        const destLng = this.props.destLatLng.lng();

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
            uberFare: data
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
    
    componentDidUpdate() {
        if (this.state.uberFare) {
            console.log(this.state.uberFare);
        }
    }

    render() {
        return (
            <div>
                <Button varient="contained" color="primary" onClick={this.estimateFare.bind(this)}> Estimate Fare! </Button>
                {
                    this.state.uberFare &&
                    <div>
                        <p>
                            Estimated Uber Fare: { this.state.uberFare.prices[0].estimate }
                        </p>
                    </div>
                }
                {
                    this.state.lyftFare &&
                    <div>
                        <p>
                            Estimated Lyft Fare: ${ this.state.lyftFare }
                        </p>
                    </div>
                }
            </div>
        );
    }
}

export default FareEstimator;