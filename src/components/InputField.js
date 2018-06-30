import React, { Component } from 'react';
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// UI
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import LocationOn from '@material-ui/icons/LocationOn';
import Search from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
    wrapper: {
        height: "30%",
        width: "100%"
    }
});

class InputField extends Component {
    constructor() {
        super();
        this.deparAC = undefined;
        this.destAC = undefined;
        this.maps = undefined;
        this.state = {
            currentLoc: false,
            deparText: undefined,
            destText: undefined
        }
    }

    /**
     * Load autocomplete & add event listener
     */
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
                
                console.log(place);

                // TODO: smarter way to set deparVal lol
                this.setState({
                    deparText: this.parsePlaceName(place.address_components)
                });

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

                this.setState({
                    destText: this.parsePlaceName(place.address_components)
                })

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
     */
    parsePlaceName = (place) => {
        // TODO: Handle Edge Case; Iterate through `place` array and check "tags"
        var streetNumber = place[0].long_name;
        var route = place[1].long_name;
        var locality = place[3].long_name;
        var admin_area_lv1 = place[5].short_name;
        var country = place[6].short_name;
        return streetNumber + " " + route +", " + locality + ", " + admin_area_lv1 + ", " + country;

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

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });

        if (name == "deparText") {
            this.setState({
                currentLoc: false
            })
        }
    }

    componentDidMount = () => {
        this.loadAutoComplete();
    }

    getCurrentLocation = () => {
        const { handleCurrentLocation } = this.props;

        var { google } = this.props;

        var geocoder = new google.maps.Geocoder;
        
        

        var res = handleCurrentLocation();  // A Promise
        res.then((position) => {

            var latlng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const deparNode = document.getElementById('deparRef');
            const inputNode = document.getElementById('inputLabel');
            
            geocoder.geocode({'location': latlng}, function (results, status) {
                console.log(results);
                this.setState({
                    deparText: results[0].formatted_address,
                    currentLoc: true
                });
            }.bind(this));
        });
    }

    render() {
        const { classes } = this.props;

        const { handleCurrentLocation, handleSearch } = this.props;
        
        const { deparAddr, destAddr } = this.props;

        return (
            <Grid item className={classes.wrapper}>
                <Grid container direction='row' className={classes.container}>
                    <Grid item xs={12} sm={12} className={classes.item}>
                        <FormControl
                            margin="normal"
                            fullWidth>
                            {   this.state.currentLoc
                                ? <InputLabel
                                    id="inputLabel"
                                    shrink="true">
                                    Departure
                                </InputLabel>

                                : <InputLabel
                                    id="inputLabel">
                                    Departure
                                </InputLabel>
                            }
                            <Input
                                id="deparRef"
                                className={classes.textField}
                                label="Departure"
                                fullWidth
                                autoFocus
                                endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    variant="contained" 
                                                    color="primary"
                                                    onClick={this.getCurrentLocation}>
                                                    
                                                    <LocationOn />
                                                </IconButton>
                                            </InputAdornment>
                                }
                                value={this.state.deparText}
                                onChange={this.handleChange("deparText")}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.item}>
                        <TextField
                            id="destRef"
                            className={classes.textField}
                            label="Destination"
                            margin="normal"
                            fullWidth
                            InputProps= {{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            variant="contained" 
                                            color="primary" 
                                            onClick={handleSearch} >
                                            
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            value={this.state.destText}
                            onChange={this.handleChange("destText")}
                        />
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
