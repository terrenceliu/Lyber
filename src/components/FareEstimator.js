import React, { Component } from 'react';
import ReactDOM from "react-dom";

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

        const deparLat = this.props.deparLatLng.lat();
        const deparLng = this.props.deparLatLng.lng();
        const destLat = this.props.destLatLng.lat();
        const destLng = this.props.destLatLng.lng();

        const uberAPI = `https://api.uber.com/v1.2/estimates/price?start_latitude=${deparLat}&start_longitude=${deparLng}&end_latitude=${destLat}&end_longitude=${destLng}`;
        console.log(uberAPI);

        // var uberURL = new URL(uberAPI);
        // uberURL.search = new URLSearchParams(body);
        
        /**
         * TODO: Get token from .env or .config. Hide from public.
         */
        const uberToken = 'Token G6MEnjqOYpuqMoVKVeJbMhBhgUrh_WQ3zD6DBGF8';
        const uberData = fetch(uberAPI, {
            headers: {
                'Authorization': 'Token G6MEnjqOYpuqMoVKVeJbMhBhgUrh_WQ3zD6DBGF8',
                'Accept-Language': 'en_US',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => this.setState({
            uberFare: data
        }));
    }

    componentDidUpdate() {
        console.log(this.state.uberFare);
    }

    render() {
        return (
            <div>
                <p> FareEstimator </p> <button onClick={this.estimateFare.bind(this)}> Estimate Fare! </button>
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