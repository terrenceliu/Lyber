import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AcountBox from '@material-ui/icons/AccountBox'

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
        textAlign: "center"
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    acountButton: {
        marginRight: -12,
        marginLeft: 20
    }
};

class ButtonAppBar extends Component {
    constructor() {
        super();
    }
    
    handleLogIn = () => {
        var authURL = undefined;

        if (process.env.production) {
            authURL = "https://lyber-server.herokuapp.com/auth/login";
        } else {
            authURL = "http://localhost:8000/auth/login";
        }

        console.log("AuthURL", authURL);
    
        // window.location = authURL;
    }
    
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        Lyber
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                    <IconButton className={classes.acountButton} color="inherit" aria-label="Menu" onClick={this.handleLogIn}>
                        <AcountBox />
                    </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(ButtonAppBar);