import React, { Component } from "react";
import ReactDOM from "react-dom";

import Button from '@material-ui/core/Button';

class ReqRideButton extends Component {
    
    handleReq() {
        var deepLink = undefined;
        if (this.props.company && this.props.deparLat && this.props.deparLng && this.props.destLat && this.props.destLng) {
            if (this.props.company == "uber") {
                deepLink = "uber://?client_id=jOOUs484dDpd5ZtVxT5A8cp9CEknN5sz&action=setPickup" + 
                    `&pickup[latitude]=${this.props.deparLat}&pickup[longitude]=${this.props.deparLng}` +   // Pick Up location
                    `&dropoff[latitude]=${this.props.destLat}&dropoff[longitude]=${this.props.destLng}`; // Drop off location
            } else if (this.props.company == "lyft") {
                deepLink = "lyft://ridetype?id=lyft&&partner=WX_vIhcHWEdw" + 
                    `pickup[latitude]=${this.props.deparLat}&pickup[longitude]=${this.props.deparLng}`+
                    `&destination[latitude]=${this.props.destLat}&destination[longitude]=${this.props.destLng}`;
            }
        }

        console.log("deepLink", deepLink, this.props);

        window.location = deepLink;


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