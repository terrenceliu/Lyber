import React, { Component } from 'react';
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// UI
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Search from '@material-ui/icons/Search';

const styles = theme => ({
    container: {
        width: '100%',
        textAlign: 'center'
    }
});

function SearchButton (props) {
    const { classes } = props;
    return (
        <Grid item className={classes.container} >
            <IconButton variant="contained" color="primary" onClick = { props.handleSearch } >
                <Search />
            </IconButton>
        </Grid>
    )
}

SearchButton.propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}

export default withStyles(styles)(SearchButton);
