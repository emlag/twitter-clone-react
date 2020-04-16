import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import NewPostInput from "./NewPostInput";
import ShowPosts from "./ShowPosts";
import Following from "./Following";
import AllPosts from "./AllPosts";
import Homepage from "./Homepage";
import Profile from "./Profile";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/" exact component={Homepage}/>
                        <Route path="/following" exact component={Following}/>
                        <Route path="/allposts" exact component={AllPosts}/>
                        <Route path="/profile/:username" exact component={Profile}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));