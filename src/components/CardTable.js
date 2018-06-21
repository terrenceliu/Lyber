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
    container: {
        width: '100%',
        height: '90px'
    },
    card: {
        height: '90%',
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"
    },
    icon: {
        width: "10%"
    },
    content: {
        width: "70%",
    },
    price: {
        fontSize: 20
    },
    name: {
        fontSize: 12,
        marginTop: 8
    },
    request: {
        textAlign: "center",
    }
});

class CardTable extends Component {
    constructor() {
        super();
    }

    render() {
        const { uberData, lyftData } = this.props;

        const { classes } = this.props;

        const testCard = (
            <Grid item className={classes.container}>
                <Card classname={classes.card}>
                    <CardContent className={classes.icon} >
                        <IconButton variant="contained" color="primary">
                            <DirectionsCar />
                        </IconButton>
                    </CardContent>
                    <CardContent className={classes.content} >
                        <Typography variant="headline" component="p" classname={classes.price} >
                            $8 ~ $9
                        </Typography>
                        <Typography color="textSecondary" className={classes.name} >
                            Test Card
                        </Typography>
                    </CardContent>
                    <CardContent className={classes.request} >
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
                        const deparLat = this.state.deparLat;
                        const deparLng = this.state.deparLng;
                        const destLat = this.state.destLat;
                        const destLng = this.state.destLng;
                        
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
                    })
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