import React, { Component } from 'react'

// UI
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Image
import Travel from '../assets/images/nyc.jpg';

// @material-ui/core
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    wrapper: {
        // width: '60vw',
        width: '80vw',
        // top: 0,
        margin: 'auto',
        // marginTop: '-56px',
        zIndex: '1'
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
    },
    textContainer: {
        width: "50%",
        height: "80%",
        textAlign: "center",
        // letterSpacing: '0.3em'
    }
});

class About extends Component {
    
    render() {
        const { classes } = this.props;

        return(    
            <div className={classes.wrapper}>
                <Grid
                    container
                    spacing={16}
                    direction="row"
                    alignItems="center"
                    justify="center"
                >
                <Grid item className={classes.header}>
                    <div style={{width: '100%', height: '100%'}}>
                        <img src={Travel} className={classes.headerBackground}>
                        </img>
                        <Typography variant="title" className={classes.headerText}>
                            About
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <div
                        id="textContainer"
                        style={{
                            // width: '70%',
                            textAlign: 'left'
                        }}
                    >
                        <Typography variant="title">
                            Compare Services. <br/> <br/> 
                            In One Place. <br/> <br/> <br/>
                        </Typography>
                        <Typography variant="body1">
                            <div>
                                Github Repo
                                <p><a href="https://github.com/terrenceliu/Lyber">Front End</a></p>
                                <p><a href="https://github.com/terrenceliu/Lyber-express">Back End</a></p>
                                <p><a href="https://github.com/EdwardFeng523/Lyber-ios">iOS</a></p>
                                <p>Developed by <a href="https://github.com/terrenceliu">Terrence</a> & 
                                <a href="https://github.com/EdwardFeng523"> Edward</a> </p>
                            </div>
                        </Typography>
                        
                    </div>

                </Grid>

                </Grid>
            </div>
        );
    }
}

About.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(About);