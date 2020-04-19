import React, {Component} from 'react';
import ShowPosts from "./ShowPosts";
import {getCookie} from "./Utils";

class Profile extends Component {
    componentDidMount() {
        this.getProfInfo(this.props.match.params.username);
    }

    constructor(props) {
        super(props);
        this.state = {
            currentUser: {
                username: props.match.params.username,
                followers: 0,
                following: 0,
                email: '',
                isFollowing: false
            }

        };
    }

    getProfInfo = (currUser) => {
        fetch(`/profreq/${currUser}`)
            .then(response => {
                return response.json();
                // console.log(response);
            })
            .then(data => {
                console.log(data);
                this.setState({
                    currentUser: {
                        username: data["user"],
                        followers: data["followers"],
                        following: data["following"],
                        email: data["email"],
                        showFollow: data["showFollow"],
                        isFollowing: data["isFollowing"]
                    }
                })
            })
    };

    updateFollow = () => {
        const token = getCookie('csrftoken');

        fetch(`/follow/${this.state.currentUser.username}`, {
            method: "PUT",
            headers: {
                'X-CSRFToken': token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                return response.json();
            })
            .then(data => {
                console.log(data);
                this.getProfInfo(this.state.currentUser.username);
            })
            .catch(err => {
                console.log(err);
            })
    };

    render() {
        const followButton = () => {
            if (this.state.currentUser.showFollow)
            {
               return <button onClick={this.updateFollow} className="btn" id="follow-button">
                        {this.state.currentUser.isFollowing === true ? "UnFollow" : "Follow"}</button>
            }
        };

        return (
            <div className="profile-container">
                <div className="profile-header">
                    <div id="profile-image">
                        Image Here
                    </div>
                    {followButton()}
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
                <ShowPosts pathToPosts={`/posts/${this.state.currentUser.username}`}/>
            </div>
        );
    }
}

export default Profile;