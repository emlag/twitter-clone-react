import React, {Component} from 'react';
import getPosts from "./getPosts";
import ShowPosts from "./ShowPosts";

class Following extends Component {
    componentDidMount() {
        getPosts(this, "/following_posts");
    }

    constructor(props) {
        super(props);
        this.state = {
            availPosts: []
        };
    }

    render() {
        return (
            <div>
                <ShowPosts allPosts={this.state.availPosts}/>
                <h1>
                    Following Page
                </h1>
            </div>
        );
    }
}

export default Following;