import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import scrollToComponent from 'react-scroll-to-component';

// Component
// import ReqRideButton from './ReqRideButton';

// UI
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// import { CardActions, IconButton } from "@material-ui/core";
// import DirectionsCar from '@material-ui/icons/DirectionsCar';
import Avatar from '@material-ui/core/Avatar';
// import SvgIcon from '@material-ui/core/SvgIcon';
import Fade from '@material-ui/core/Fade';
// import Collapse from '@material-ui/core/Collapse';

// Logo
import uberLogo from '../assets/images/uber_logo.png';
import lyftLogo from '../assets/images/lyft_logo.png';

// Tab Related
// import classNames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import Zoom from '@material-ui/core/Zoom';
// import AddIcon from '@material-ui/icons/Add';
// import EditIcon from '@material-ui/icons/ModeEdit';
// import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import green from '@material-ui/core/colors/green';
// import Paper from '@material-ui/core/Paper';

// GridList
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';


function TabContainer(props) {
    const { children, dir } = props;

    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const styles = theme => ({
    wrapper: {
        height: '40%',
        width: '100%',
        marginTop: '30px'
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

    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        position: 'relative',
        minHeight: '40%',
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
    },

    // GridList
    gridList: {
        // flexWrap: 'nowrap',
        // flexDirection: 'column',
        // // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        // transform: 'translateZ(0)',
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
    },
    avatar: {
        // width: 30,
        // height: 30
    },
    tab: {
        width: '50%'
    }
});

class CardTable extends Component {
    constructor() {
        super();
        this.state = {
            value: 0
        };
        this.estNotSupport = false;
    }
    
    handleChange = (event, value) => {
        this.setState({ value });
    };
    
    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    /**
     * 
     */
    requestRide = (company, product_name, product_id, price_min, price_max, eta, priority) => {

        const deparLat = this.props.deparLat;
        const deparLng = this.props.deparLng;
        const destLat = this.props.destLat;
        const destLng = this.props.destLng;
        const deparAddr = this.props.deparAddr;
        const destAddr = this.props.destAddr;

        var deepLink = undefined;
        if (company && deparLat && deparLng && destLat && destLng) {
            if (company == "uber") {
                // deepLink = "uber://?client_id=jOOUs484dDpd5ZtVxT5A8cp9CEknN5sz&action=setPickup" +
                //     `&pickup[latitude]=${deparLat}&pickup[longitude]=${deparLng}&pickup[nickname]=${deparAddr}` +   // Pick Up location
                //     `&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${destAddr}` + // Drop off location
                //     `&product_id=${product_id}`;
                deepLink = "https://m.uber.com/ul/?action=setPickup&client_id=jOOUs484dDpd5ZtVxT5A8cp9CEknN5sz" +
                    `&pickup[latitude]=${deparLat}&pickup[longitude]=${deparLng}&pickup[nickname]=${deparAddr}` +   // Pick Up location
                    `&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${destAddr}` + // Drop off location
                    `&product_id=${product_id}`;
            } else if (company == "lyft") {
                deepLink = `lyft://ridetype?id=${product_id}&partner=WX_vIhcHWEdw` +
                    `&pickup[latitude]=${deparLat}&pickup[longitude]=${deparLng}` +
                    `&destination[latitude]=${destLat}&destination[longitude]=${destLng}`;
            }
        }
        
        var data = {
            deparLat: deparLat,
            deparLng: deparLng,
            destLat: destLat,
            destLng: destLng,
            company: company,
            productName: product_name,
            priceMin: price_min,
            priceMax: price_max,
            eta: eta,
            priority: priority
        }

        /**
         * Log request
         */
        // const logAddr = 'http://localhost:8000/log/request'
        const logAddr = 'https://lyber.co/api/log/request';
        
        fetch(logAddr, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            // console.log("[ReqLog] Response", response);
        })
        .catch(error => {
            console.log("[ReqLog] Error", error);
        })


        window.location = deepLink;

        

    }

    /**
     * 
     * @param {obejct} classes
     * @param {object} estData
     */
    tabFactory = (classes, theme, data) => {
        var data = data || [];

        // // Sort Data
        var priceData = data.slice();

        var timeData = data.slice();
        
        var cmp = (this.estNotSupport)
            ? function (a, b) {
                return (a.min_estimate == b.min_estimate)
                    ? (a.max_estimate - b.max_estimate)
                    : (a.min_estimate - b.min_estimate);
            }
            : function (a, b) {
                return (a.fare_estimate - b.fare_estimate);
            }
            
        priceData.sort(cmp);

        timeData.sort(function (a, b) {
            return (a.eta - b.eta);
        });

        // UI
        const transitionDuration = {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
        };
        
        return (
            <div className={classes.root}>
                <Fade in={true} timeout={1000}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                            centered
                        >
                            <Tab label="Price" />
                            <Tab label="ETA" />
                        </Tabs>
                    </AppBar>
                </Fade>
                <Fade in={true} timeout={3000}>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={this.state.value}
                        onChangeIndex={this.handleChangeIndex}
                    >   
                        <TabContainer dir={theme.direction}>
                            <GridList className={classes.gridList} cols={1} cellHeight="auto">
                                {   priceData.map(item => <GridListTile key={item.product_id}>
                                        <Card className={classes.card}>
                                            <CardContent className={classes.icon} >
                                                {/* <IconButton variant="contained" color="primary">
                                                    <DirectionsCar />
                                                </IconButton> */}
                                                <Avatar
                                                    // className={classes.avatar}
                                                    alt="company"
                                                    src={
                                                        (item.company == "uber") 
                                                        ? uberLogo
                                                        : lyftLogo
                                                    }
                                                />
                                            </CardContent>
                                            <CardContent className={classes.content} >
                                                <Typography variant="headline" component="p" className={classes.price} >
                                                    {
                                                        // (item.fare_estimate)
                                                        (!this.estNotSupport)
                                                        ? "$" + item.fare_estimate.toFixed(2)
                                                        : "$" + item.min_estimate + " - " + "$" + item.max_estimate
                                                        
                                                    }
                                                </Typography>
                                                <Typography color="textSecondary" className={classes.name} >
                                                    {item.display_name}
                                                </Typography>
                                            </CardContent>
                                            <CardContent className={classes.request} >
                                                {/* <ReqRideButton onClick={ this.requestRide } /> */}
                                                <Button size="small" color="primary"
                                                    onClick={() => this.requestRide(item.company, item.display_name, item.product_id, item.min_estimate, item.max_estimate, item.eta, "price")}>
                                                    Schedule
                                                </Button>
                                                <Typography color="textSecondary" noWrap>
                                                    {parseInt(item.eta / 60, 10)} mins away
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </GridListTile>
                                    )
                                }    
                                
                            </GridList>
                        </TabContainer>
                        <TabContainer dir={theme.direction}>
                            <GridList className={classes.gridList} cols={1} cellHeight="auto">
                                {   timeData.map(item => <GridListTile key={item.product_id}>
                                        <Card className={classes.card}>
                                            <CardContent className={classes.icon} >
                                                {/* <IconButton variant="contained" color="primary">
                                                    <DirectionsCar />
                                                </IconButton> */}
                                                <Avatar
                                                    // className={classes.avatar}
                                                    alt="company"
                                                    src={
                                                        (item.company == "uber") 
                                                        ? uberLogo
                                                        : lyftLogo
                                                    }
                                                />
                                            </CardContent>
                                            <CardContent className={classes.content} >
                                                <Typography variant="headline" component="p" className={classes.price} >
                                                    {
                                                        (!this.estNotSupport)
                                                        ? "$" + item.fare_estimate.toFixed(2)
                                                        : "$" + item.min_estimate + " - " + "$" + item.max_estimate
                                                    }
                                                </Typography>
                                                <Typography color="textSecondary" className={classes.name} >
                                                    {item.display_name}
                                                </Typography>
                                            </CardContent>
                                            <CardContent className={classes.request} >
                                                {/* <ReqRideButton onClick={ this.requestRide } /> */}
                                                <Button size="small" color="primary"
                                                    onClick={() => this.requestRide(item.company, item.display_name, item.product_id, item.min_estimate, item.max_estimate, item.eta, "time")}>
                                                    Schedule
                                        </Button>
                                                <Typography color="textSecondary" noWrap>
                                                    {parseInt(item.eta / 60, 10)} mins away
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </GridListTile>
                                    )
                                }    
                            </GridList>
                        </TabContainer>
                    </SwipeableViews>
                </Fade>
            </div>
        );
    }

    // LifeCycel Hooks

    componentDidMount() {
        scrollToComponent(this.cardTable, {
            align: 'top',
            offset: -100
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.estData != prevProps.estData) {
            scrollToComponent(this.cardTable, {
                align: 'top',
                offset: -100
            });
        }
    }

    render() {
        const { estData } = this.props;

        // const { estNotSupport } = this.props;

        const { classes, theme } = this.props;
        
        this.estNotSupport = false;
        for (var i = 0; i < estData.length; i++) {
            if (!estData[i].fare_estimate) {
                this.estNotSupport = true;
                break
            }
        }

        return (
            <Grid item className={classes.wrapper} ref={(section) => { this.cardTable = section; }}>
                <Grid container spacing={16}>
                    {
                        // estData && 
                        this.tabFactory(classes, theme, estData)
                    }
                </Grid>
            </Grid>
        );
    }
}

CardTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(CardTable);