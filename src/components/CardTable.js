import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Component
import ReqRideButton from './ReqRideButton';

// UI
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { CardActions, IconButton } from "@material-ui/core";
import DirectionsCar from '@material-ui/icons/DirectionsCar';

const styles = theme => ({

});

class CardTable extends Component {
    constructor() {
        super();
    }

    render() {
        const { uberData, lyftData } = this.props;

        const { classes } = this.props;

        const testCard = (
            <Grid item>
                <Card>
                    <CardContent>
                        <IconButton variant="contained" color="primary">
                            <DirectionsCar />
                        </IconButton>
                    </CardContent>
                    <CardContent>
                        <Typography variant="headline" component="p">
                            $8 ~ $9
                        </Typography>
                        <Typography color="textSecondary">
                            Test Card
                        </Typography>
                    </CardContent>
                    <CardContent>
                        <ReqRideButton/>
                        <Typography color="textSecondary">
                            ETA: 3mins
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );

        return (
            <Grid item>
                <Grid container spacing={16}>
                {
                    testCard
                }
                {
                    uberData && lyftData &&
                    uberData.prices.map(function(item, i) {
                        // TODO: Fix pass LatLng / call back
                        const name = item.display_name;
                        const estimate = item.low_estimate;
                        const distance = item.distance;
                        const deparLat = this.props.deparLat;
                        const deparLng = this.props.deparLng;
                        const destLat = this.props.destLat;
                        const destLng = this.props.destLng;
                        
                        console.log("Depar", deparLat, deparLng, "Dest", destLat, destLng);
                        
                        return (
                            <Grid item key={i} className={classes.display_item}>
                                <Card className={classes.display_card}>
                                    <CardContent className={classes.display_card_icon}>
                                        <IconButton variant="contained" color="primary">
                                            <DirectionsCar />
                                        </IconButton>
                                    </CardContent>
                                    <CardContent className={classes.display_card_content}>
                                        <Typography variant="headline" component="p" className={classes.display_card_price}>
                                            ${estimate}
                                        </Typography>
                                        <Typography color="textSecondary" className={classes.display_card_name}>
                                            {name}
                                        </Typography>
                                    </CardContent>
                                    <CardContent className={classes.display_card_action}>
                                        <ReqRideButton company="uber" deparLat={deparLat} deparLng={deparLng} destLat={destLat} destLng={destLng} />
                                        <Typography color="textSecondary" className={classes.display_card_name}>
                                            ETA: {distance}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    }.bind(this))
                }
                
                </Grid>
            </Grid>
        );
    }
}

CardTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CardTable);