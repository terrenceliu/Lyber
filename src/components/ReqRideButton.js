import React, { Component } from "react";
import ReactDOM from "react-dom";

import Button from '@material-ui/core/Button';

class ReqRideButton extends Component {

    handleReq() {
        var uberLink = undefined;
        if (this.props.deparLat && this.props.deparLng && this.props.destLat && this.props.destLng) {
            uberLink = "uber://?client_id=jOOUs484dDpd5ZtVxT5A8cp9CEknN5sz&action=setPickup" + 
                `&pickup[latitude]=${this.props.deparLat}&pickup[longitude]=${this.props.deparLng}` +   // Pick Up location
                `&dropoff[latitude]=${this.props.destLat}&dropoff[longitude]=${this.props.destLng}`; // Drop off location
        }

        console.log("uberLink", uberLink, this.props);

        window.location = uberLink;


    }

    render() {
        
        return (
            <Button size="small" color="primary" 
                onClick={this.handleReq.bind(this)}>
                Schedule
            </Button>
        );
    }
}

export default ReqRideButton;