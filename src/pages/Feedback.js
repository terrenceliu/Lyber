import React, { Component } from 'react'

// UI
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// @material-ui/core

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Modal from '@material-ui/core/Modal';

import StarRatingComponent from 'react-star-rating-component';

import Travel from '../assets/images/travel.jpg';

const styles = (theme) => ({
    wrapper: {
        // width: '60vw',
        width: '80vw',
        // top: 0,
        margin: 'auto',
        // marginTop: '-56px',
        zIndex: '1'
    },
    caption: {
        marginBottom: '10px'
    },
    rate: {
        textAlign: 'center',
        marginTop: '10px',
        // marginBottom: '-5px'
    },
    submitButton: {
        textAlign: 'center'
    },
    modal: {
        margin: 'auto',
        position: 'relative',
        width: theme.spacing.unit * 30,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        textAlign: 'center'
    },
    header: {
        position: 'relative',
        height: '250px',
        width: '100vw',
        marginLeft: '-10vw',
        marginRight: '-10vw',
        marginBottom: '10px',
    },
    headerBackground: {
        backgroundColor: 'gray',
        width: '100%',
        height: '100%',
        // backgroundImage: {Travel},
        objectFit: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%'
    },
    headerText: {
        position: 'absolute',
        zIndex: '1',
        width: '200px',
        height: '30px',
        top: 'calc(50% - 15px)',
        left: 'calc(50% - 100px)',
        // backgroundColor: 'transparent'
        textAlign: 'center',
        color: 'white',
        letterSpacing: '2.5px',
        // left: 0,
        // right: 0,
        // marginLeft: 'auto',
        // marginRight: 'auto'
    }
});

class Feedback extends Component {

    constructor() {
        super();
        this.state = {
            name: undefined,
            email: undefined,
            star: undefined,
            comment: undefined,
            modal: false
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onStarClick = (value, prevVal, name) => {
        this.setState({
            star: value
        });
        // console.log(value);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let data = {
            name: this.state.name,
            star: this.state.star,
            email: this.state.email,
            comment: this.state.comment
        }
        
        const logAPI = "https://www.lyber.co/api/log/feedback";

        fetch(logAPI, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        }).then(response => {
            // console.log("[Feedback]", response);
        }).catch(err => {
            console.log("[FeedbackLog] Error", error);
        });

        // Clear State
        this.setState({
            name: "",
            email: "",
            star: "",
            comment: "",
            modal: true
        })
    }

    handleModalClose = () => {
        this.setState({
            modal: false
        })
    }
    
    render() {
        const { classes } = this.props;
        
        return(    
            <div className={classes.wrapper}>
                <form onSubmit={this.handleSubmit}>
                    <Grid 
                        container 
                        spacing={8}
                        direction="row"
                        alignItems="center"
                        justify="center"
                        >
                        <Grid item className={classes.header}>
                            <div style={{width: '100%', height: '100%'}}>
                                <img src={Travel} className={classes.headerBackground}>
                                </img>
                                <Typography variant="title" className={classes.headerText}>
                                    Feedback
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} className={classes.formInput}>
                            <TextField
                                id="name"
                                label="Name"
                                value={this.state.name}
                                onChange={this.handleChange("name")}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.formInput}>
                            <TextField
                                id="email"
                                label="E-Mail"
                                value={this.state.email}
                                onChange={this.handleChange("email")}
                                // margin="normal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.formInput}>
                            <TextField
                                id="comment"
                                label="Comment"
                                value={this.state.comment}
                                onChange={this.handleChange("comment")}
                                // margin="normal"
                                multiline
                                fullWidth
                            />
                        </Grid>
                        {/* <Grid item xs={12} className={classes.caption}>
                            <Typography variant="subheading">
                            How do you rate this app?
                            </Typography>
                        </Grid> */}
                        <Grid item xs={12} className={classes.rate}>
                            <StarRatingComponent
                                name="rate"
                                starCount={5}
                                value={this.state.rating}
                                renderStarIcon={() => <Star /> }
                                renderStarIconHalf={() => <StarBorder /> }
                                onStarClick={this.onStarClick}
                                // emptyStarColor="transparent"
                            />
                        </Grid>
                        <Grid 
                            item 
                            xs={12}
                            className={classes.submitButton}
                            >
                            <Button type="submit" color="primary" >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Modal
                    open={this.state.modal}
                    onClose={this.handleModalClose}
                >
                    <div className={classes.modal}>
                        <Typography variant="body1">
                            Thanks for sharing your feedback!
                        </Typography>
                    </div>
                </Modal>
            </div>
        );
    }
}

Feedback.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Feedback);