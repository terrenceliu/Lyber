import React, { Component } from 'react';

// Component
import ToolBar from './components/ToolBar';

// Pages
import Main from './pages/Main';
import About from './pages/About';
import Feedback from './pages/Feedback';

// UI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';

// Router
import { BrowserRouter as Router, Route } from 'react-router-dom';

const theme = createMuiTheme({
    palette: {
        type: 'light'
    }
});

class App extends Component {

    render() {
        return (
            <div>
                 <MuiThemeProvider theme={theme}>
                    <Router>
                        <div>    
                            <ToolBar disableGutters="true"/>
                    
                        
                            <Route exact path="/" component={Main} />
                            <Route exact path="/about" component={About} />
                            <Route exact path="/feedback" component={Feedback} />

                        </div>
                    </Router>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default App;