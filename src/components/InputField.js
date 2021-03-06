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
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    wrapper: {
        height: "30%",
        width: "100%"
    },
    searchButton: {
        marginTop: '15px',
        textAlign: 'center'
    },
    buttonWrapper: {
        position: 'relative'
    },
    buttonProgress: {
        color: 'primary',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    // lightColor: {
    //     color: theme.palette.dark
    // }
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
            destText: undefined,
            parentDeparText: undefined,
            parentDestText: undefined
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
                
                // console.log("[Depar]", place.place_id, place.geometry.location.toJSON());
                

                if (!place.geometry) {
                    alert("Details unavailable for input: " + place.name + ".");
                    // TODO: Handle edge case
                    return;
                }

                if (this.props.updateLocation) {
                    this.props.updateLocation("depar", place.geometry.location.toJSON(), place.formatted_address, place.place_id);
                }

                 // TODO: smarter way to set deparVal lol
                 this.setState({
                    deparText: place.formatted_address
                });
            });

            destAC.addListener('place_changed', () => {
                var place = destAC.getPlace();
                
                // console.log("[Dest]", place.place_id, place.geometry.location.toJSON());

                if (!place.geometry) {
                    alert("Details unavailable for input: " + place.name + ".");
                    // return;
                }

                if (this.props.updateLocation) {
                    this.props.updateLocation("dest", place.geometry.location.toJSON(), place.formatted_address, place.place_id);
                }

                this.setState({
                    // destText: this.parsePlaceName(place.address_components)
                    destText: place.formatted_address
                })
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

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });

        // Detach current loc state
        if (name == "deparText") {
            this.setState({
                currentLoc: false
            })
        }

        if (!event.target.value) {
            // Update location
            let tag;
            if (name == "deparText") {
                tag = "depar";
            } else {
                tag = "dest";
            }
            this.props.updateLocation(tag, undefined);
        }
    }

    handleClick = (e) => {
        /**
         * Select all text field when clicked.
         */
        e.target.select();
        e.target.setSelectionRange(0, 9999);
    }

    getCurrentLocation = () => {
        const { handleCurrentLocation } = this.props;

        var { google } = this.props;

        var geocoder = new google.maps.Geocoder;
        
        

        var res = handleCurrentLocation();  // A Promise
        res.then((position) => {
            if (!position) {
                alert("Location access denied.");
                return;
            }

            var latlng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const deparNode = document.getElementById('deparRef');
            const inputNode = document.getElementById('inputLabel');
            
            geocoder.geocode({'location': latlng}, function (results, status) {
                // console.log(results);
                this.setState({
                    deparText: results[0].formatted_address,
                    currentLoc: true
                });
            }.bind(this));
        });
    }


    /**
     * Life Cycle methods
     */
    componentDidMount = () => {
        this.loadAutoComplete();
        this.getCurrentLocation();
    }

    componentDidUpdate(prevProps, prevStates) {
        /** 
         * (Fixed) 
         * Two-ways update
         * - From input textfield (AutoComplete onChange)
         * - From parent state (Map marker dragend)
        */
        const { deparAddr, destAddr } = this.props;
        // console.log("[InputField] Update Addr", deparAddr, prevStates.deparText, destAddr, prevStates.destText);
        // console.log("[prop.depar]", deparAddr, "[prevState.depar]", prevStates.deparText);

        var deparFlag = false;
        var destFlag = false;

        if (prevStates.parentDeparText != deparAddr) {
            deparFlag = true;
        }

        if (prevStates.parentDestText != destAddr) {
            destFlag = true;
        }

        if (deparFlag && destFlag) {
            this.setState({
                deparText: deparAddr,
                parentDeparText: deparAddr,
                destText: destAddr,
                parentDestText: destAddr
            });
        } else if (deparFlag) {
            this.setState({
                deparText: deparAddr,
                parentDeparText: deparAddr
            })
        } else if (destFlag) {
            this.setState({
                destText: destAddr,
                parentDestText: destAddr
            })
        }
        
    }
    
    render() {
        const { classes } = this.props;

        const { handleCurrentLocation, handleSearch } = this.props;
        
        const { deparAddr, destAddr } = this.props;

        const { loading } = this.props;
        // console.log("[InputField] Update Addr", deparAddr, this.state.deparText, destAddr, this.state.destText);

        // if (deparAddr != this.state.deparText) {
        //     this.setState({
        //         deparText: deparAddr
        //     })
        // }

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
                                    shrink={true}>
                                    Pick Up
                                </InputLabel>

                                : <InputLabel
                                    id="inputLabel">
                                    Pick Up
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
                                // onKeyDown={this.handleKeyDown()}
                                onClick={(e) => this.handleClick(e)}
                                
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.item}>
                        <TextField
                            id="destRef"
                            className={classes.textField}
                            label="Drop Off"
                            margin="normal"
                            fullWidth
                            // InputProps= {{
                            //     endAdornment: (
                            //         <InputAdornment position="end">
                            //             <IconButton
                            //                 variant="contained" 
                            //                 color="primary" 
                            //                 onClick={handleSearch} >
                                            
                            //                 <Search />
                            //             </IconButton>
                            //         </InputAdornment>
                            //     ),
                            // }}
                            value={this.state.destText}
                            onChange={this.handleChange("destText")}
                            onClick={(e) => this.handleClick(e)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.searchButton}>
                        <div className={classes.buttonWrapper}>
                            <Button  
                                variant="contained" 
                                color="primary"
                                disabled={loading} 
                                onClick={handleSearch} >
                                <Search />
                                {/* <Typography> */}
                                    Search
                                {/* </Typography> */}
                            </Button>
                            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
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
