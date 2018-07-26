import React, { Component } from 'react'

// UI
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    wrapper: {
        height: '100vh',
        // backgroundColor: 'grey',
        display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignContent: 'center',
        marginTop: '70px'
    }
});

class Feedback extends Component {
    
    render() {
        const { classes } = this.props;

        return(    
            <div className={classes.wrapper}>
                This is Feedback page
            </div>
        );
    }
}

Feedback.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Feedback);