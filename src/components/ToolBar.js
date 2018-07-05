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
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Home from '@material-ui/icons/Home';
import Info from '@material-ui/icons/Info';

// Router
import { Link } from 'react-router-dom';

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
    },
    list: {
        // TODO: Responsive; add break point
        width: '40vw'
    }
};

const drawerListItems = (
    <div>
        <ListItem 
            button
            component={Link}
            to={"/"}>
            <ListItemIcon>
                <Home /> 
            </ListItemIcon>
            <ListItemText primary="Home" />    
        </ListItem>
        <ListItem 
            button
            component={Link}
            to={"/about"}>
            <ListItemIcon>
                <Info />
            </ListItemIcon>
            <ListItemText primary="About" />
        </ListItem>
    </div>
);

class ButtonAppBar extends Component {
    constructor() {
        super();
        this.state = {
            drawer: false
        }
    }

    toggleDrawer = (open) => {
        this.setState({
            drawer: open
        });
    }
    
    handleLogIn = () => {
        // var authURL = undefined;

        // if (process.env.production) {
        //     authURL = "https://lyber-server.herokuapp.com/auth/login";
        // } else {
        //     authURL = "http://localhost:8000/auth/login";
        // }
        var authURL = "https://lyber-server.herokuapp.com/auth/login";

        // console.log("AuthURL", authURL);
        
        window.location = authURL;
    }
    
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton} 
                            color="inherit" 
                            aria-label="Menu"
                            onClick={() => this.toggleDrawer(true)}
                            >
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
                <SwipeableDrawer
                    open={this.state.drawer}
                    onClose={() => this.toggleDrawer(false)}
                    onOpen={() => this.toggleDrawer('left', true)}
                    
                >
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={() => this.toggleDrawer(false)}
                        onKeyDown={() => this.toggleDrawer(false)}
                    >
                        <List>
                            {drawerListItems}
                        </List>
                    </div>
                </SwipeableDrawer>
            </div>
        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(ButtonAppBar);