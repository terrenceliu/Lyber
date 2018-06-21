import React, { Component } from 'react';
import { CardActions, IconButton } from "@material-ui/core";
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// UI
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({

});

class InputField extends Component {
    constructor() {
        super();
        this.deparAC = undefined;
        this.destAC = undefined;
        this.maps = undefined;
    }

    loadAutoComplete = () => {
        if (this.props && this.props.google) {

            // Find props
            const { google } = this.props;
            const maps = google.maps;

            // Find hook nodes
            const deparNode = document.getElementById('deparRef');
            const destNode = document.getElementById('destRef');

            // Instantiate map components to the nodes
            var deparAC = new maps.places.Autocomplete(deparNode);
            var destAC = new maps.places.Autocomplete(destNode);

            deparAC.addListener('place_changed', () => {
                var place = deparAC.getPlace();

                // console.log("Format address", place.formatted_address);
                // console.log("Name", place.name);
                
                if (!place.geometry) {
                    alert("Details unavailable for input: " + place.name + ".");
                    // TODO: Handle edge case
                    return;
                }

                if (this.props.updateLocation) {
                    this.props.updateLocation("depar", place.geometry.location.toJSON(), place.name);
                }
            });

            destAC.addListener('place_changed', () => {
                var place = destAC.getPlace();

                if (!place.geometry) {
                    alert("Details unavailable for input: " + place.name + ".");
                    // return;
                }

                if (this.props.updateLocation) {
                    this.props.updateLocation("dest", place.geometry.location.toJSON(), place.name);
                }
            });
        }
    }

    /**
     * 
     * @param {String} tag              `depar` || `dest`
     * @param {String} displayName      Display name to be put on the text field
     */
    updateInputField = (tag, displayName) => {

        if (tag == "depar") {
            // Find hook nodes
            const deparNode = document.getElementById('deparRef');
            // deparNode.props.value = displayName
            // deparNode.props.value = "Update depar tf."
            // console.log("DeparNode", deparNode);
            

        } else if (tag == "dest") {
            const destNode = document.getElementById('destRef');

        } else {
            // TODO: handle err

        }

    }

    componentDidMount = () => {
        this.loadAutoComplete();
    }

    render() {
        const { classes } = this.props;

        const { deparAddr, destAddr } = this.props;

        // console.log("Address", deparAddr, destAddr);

        // if (deparAddr) {
        //     this.updateInputField("depar", deparAddr);
        // }

        // if (destAddr) {
        //     this.updateInputField("dest", destAddr);
        // }

        return (
            <Grid item className={classes.wrapper}>
                <Grid container direction='row' className={classes.container}>
                    <Grid item xs={12} sm={12} className={classes.item}>
                        <TextField 
                            id="deparRef"
                            className={classes.textField}
                            label="Departure"
                            margin="normal"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.item}>
                        <TextField
                            id="destRef"
                            className={classes.textField}
                            label="Destination"
                            margin="normal"
                            fullWidth />
                    </Grid>
                </Grid>
            </Grid>
        );
    };
}

InputField.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withWidth()(withStyles(styles)(InputField));
