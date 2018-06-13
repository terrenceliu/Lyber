import React, { Component } from "react";
import ReactDOM from "react-dom";
import { relative } from 'path';

// UI
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


const styles = theme => ({
    wrapper: {
        height: '100vh',
        backgroundColor: 'grey',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        height: '90vh',
        width: '80%',
        backgroundColor: 'purple',
        margin: '0 auto'
    },
    container_left: {
        height: '90vh',
        backgroundColor: 'yellow',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'

    },
    container_right: {
        height: '90vh',
        paddingTop: '100px',
        paddingLeft: '50px',
        backgroundColor: 'red'
    }
});

class MainFrame extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <div className="container">
                        <div className="row">
                            <div className= {"col-xs-5 " + classes.container_left}>
                            </div>
                            <div className={"col-xs-7 " + classes.container_right}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

MainFrame.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(MainFrame);