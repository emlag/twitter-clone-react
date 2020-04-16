import React, {Component} from 'react';
import ShowPosts from "./ShowPosts";
import getPosts from "./getPosts";

class Profile extends Component {
    componentDidMount() {
        this.setState({
            currentUser: {
                username: this.props.match.params.username
            }
        });

        getPosts(this, `/posts/${this.props.match.params.username}`);
        this.getProfInfo(this.props.match.params.username);
        // this.getProfInfo();
    }

    constructor(props) {
        super(props);
        this.state = {
            availPosts: [],
            currentUser: {
                username: '',
                followers: 0,
                following: 0,
                email:''
            }

        };
    }

    getProfInfo = (currUser) => {
        fetch(`/profreq/${currUser}`)
            .then( response => {
                return response.json();
                // console.log(response);
            })
            .then( data => {
                this.setState({
                    currentUser: {
                        username: data["user"],
                        followers: data["followers"],
                        following: data["following"],
                        email: data["email"]
                    }
                })
            })
    };


    render() {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <div id="profile-image">
                        Image Here
                    </div>
                    <button className="btn" id="follow-button"> Follow</button>
                </div>
                <div id="profile-username">
                    {this.state.currentUser.username}
                </div>
                <div id="profile-handle">
                    {this.state.currentUser.email}
                </div>
                <div id="profile-follow">
                    {this.state.currentUser.following} Following {this.state.currentUser.followers} Followers
                </div>
                <ShowPosts allPosts={this.state.availPosts}/>
            </div>
        );
    }
}

export default Profile;