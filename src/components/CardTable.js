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
    wrapper: {
        width: '100%',
        
    },
    grid_item: {
        width: '100%',
        height: '90px'
    },
    card: {
        height: '100%',
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
    
    /**
     * 
     */
    requestRide = (company, product_name, product_id) => {
        
        const deparLat = this.props.deparLat;
        const deparLng = this.props.deparLng;
        const destLat = this.props.destLat;
        const destLng = this.props.destLng;
        const deparAddr = this.props.deparAddr;
        const destAddr = this.props.destAddr;

        var deepLink = undefined;
        if (company && deparLat && deparLng && destLat && destLng) {
            if (company == "uber") {
                deepLink = "uber://?client_id=jOOUs484dDpd5ZtVxT5A8cp9CEknN5sz&action=setPickup" + 
                    `&pickup[latitude]=${deparLat}&pickup[longitude]=${deparLng}&pickup[nickname]=${deparAddr}` +   // Pick Up location
                    `&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${destAddr}` + // Drop off location
                    `&product_id=${product_id}`;
            } else if (company == "lyft") {
                deepLink = `lyft://ridetype?id=${product_id}&&partner=WX_vIhcHWEdw` + 
                    `pickup[latitude]=${deparLat}&pickup[longitude]=${deparLng}`+
                    `&destination[latitude]=${destLat}&destination[longitude]=${destLng}`;
            }
        }
        
        console.log(product_name, deepLink);

        window.location = deepLink;
    }

    /**
     * 
     * @param {object} classes  
     * @param {object} priceData
     */
    cardFactory = (classes, data) => {
        var priceData = data.slice();

        priceData.sort(function(a, b) {
            return (a.min_estimate - b.min_estimate);
        });

        console.log(priceData);
        
        return (
            priceData.map((item, i) => {
                
                console.log(item);
                
                return (
                    <Grid item className={classes.grid_item} key={i}>
                        <Card className={classes.card}>
                            <CardContent className={classes.icon} >
                                <IconButton variant="contained" color="primary">
                                    <DirectionsCar />
                                </IconButton>
                            </CardContent>
                            <CardContent className={classes.content} >
                                <Typography variant="headline" component="p" className={classes.price} >
                                    ${item.min_estimate} - ${item.max_estimate}
                                </Typography>
                                <Typography color="textSecondary" className={classes.name} >
                                    {item.display_name}
                                </Typography>
                            </CardContent>
                            <CardContent className={classes.request} >
                                <Button size="small" color="primary" 
                                    onClick={ () => this.requestRide(item.company, item.display_name, item.product_id) }>
                                    Schedule
                                </Button>
                                <Typography color="textSecondary">
                                ETA: {item.distance}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })
        );
    }

    render() {
        const { estData } = this.props;
        
        const { classes } = this.props;

        // const uberCard = this.cardFactory()

        console.log("estData", estData);

        const testCard = (
            <Grid item className={classes.grid_item} >
                <Card className={classes.card}>
                    <CardContent className={classes.icon} >
                        <IconButton variant="contained" color="primary">
                            <DirectionsCar />
                        </IconButton>
                    </CardContent>
                    <CardContent className={classes.content} >
                        <Typography variant="headline" component="p" className={classes.price} >
                            $8 ~ $9
                        </Typography>
                        <Typography color="textSecondary" className={classes.name} >
                            Test Card
                        </Typography>
                    </CardContent>
                    <CardContent className={classes.request} >
                        {/* <ReqRideButton onClick={ this.requestRide } /> */}
                        <Button size="small" color="primary" 
                            onClick={ () => this.requestRide("Tag") }>
                            Schedule
                        </Button>
                        <Typography color="textSecondary">
                            ETA: 3mins
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );

        return (
            <Grid item className={classes.wrapper}>
                <Grid container spacing={16}>
                {
                    estData &&
                    this.cardFactory(classes, estData)
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