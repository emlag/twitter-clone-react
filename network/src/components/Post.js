import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {getCookie} from "./Utils";

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            username: props.username,
            email: props.email,
            likesCount: props.likesCount,
            timeStamp: props.timeStamp,
            prevLiked: props.isLiked,
            currUser: props.currUser,
            id: props.id,
            isEdit: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.likesCount !== prevState.likesCount) {
            this.updatePostLikes();
        }
    }

    newLike = () => {
        let newLikesCount = this.state.likesCount + 1;
        this.setState({
            likesCount: newLikesCount,
            prevLiked: true
        });
    };

    unlike = () => {
        let newLikesCount = this.state.likesCount - 1;
        this.setState({
            likesCount: newLikesCount,
            prevLiked: false
        });
    };

    updatePostLikes = () => {
        const token = getCookie('csrftoken');

        fetch(`/posts/${this.state.id}`, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': token
            },
            body: JSON.stringify({
                likes_count: this.state.likesCount,
                create_like: this.state.prevLiked
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                } else {
                    return response.json();
                }
            })
            .then(data => {
                console.log("likes updated successfully");
            })
            .catch(err => {
                console.log("likes not updated");
                console.log(err);
            })
    };

    updatePostText = () => {
        const token = getCookie('csrftoken');

        fetch(`/posts/${this.state.id}`, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': token
            },
            body: JSON.stringify({
                new_text: this.state.text,
            })
        })
            .then(response => {
                this.setState({
                    isEdit: false
                });

                if (!response.ok) {
                    throw Error(response.statusText);
                } else {
                    return response.json();
                }
            })
            .then(data => {
                console.log("text updated successfully");
            })
            .catch(err => {
                console.log("text not updated");
            })
    };

    showEdit = () => {
        this.setState({
            isEdit: !this.state.isEdit
        })
    };

    useInput = (e) => {
        this.setState({
            text: e.target.value
        })
    };

    render() {
        const editPostDiv = () => {
            if (this.state.isEdit) {
                return (
                    <div className="input-group mb-3">
                        <input id="update-post" type="text" className="form-control" placeholder="New Text"
                               aria-label="New Text" aria-describedby="basic-addon2" value={this.state.text}
                               onChange={this.useInput}
                        />
                        <div className="input-group-append">
                            <button onClick={this.updatePostText} className="btn btn-outline-secondary"
                                    type="button">Post
                            </button>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        {this.state.text}
                    </div>
                )
            }
        };

        const canEdit = () => {
            if (this.state.currUser === this.state.username) {
                return (
                    <a onClick={this.showEdit} className="edit-link" id="edit-tweet">
                        {
                            this.state.isEdit ? "Stop Edit" : "Edit"
                        }
                    </a>
                )
            }
        };

        return (
            <div className="post">
                <div id="tweet-image">
                    <img src="https://img.icons8.com/dusk/64/000000/name.png"/>
                </div>
                <div className="tweet-container">
                    <div className="tweet-header">
                        <div id="user-name">
                            <Link to={`/profile/${this.state.username}`}>{this.state.username}</Link>
                        </div>
                        <div id="handle">
                            {this.state.email}
                        </div>
                        <div id="timestamp">
                            {this.state.timeStamp}
                        </div>
                        {canEdit()}
                    </div>

                    {editPostDiv()}

                    <div className="like-container">
                        <a onClick={this.state.prevLiked ? this.unlike : this.newLike} className="like-button">
                            <i className={this.state.prevLiked
                                ? "material-icons is-liked"
                                : "material-icons not-liked bouncy"}>
                                {this.state.prevLiked ? "favorite" : "favorite_border"} </i>
                        </a>
                        <p className="like-count">{this.state.likesCount} likes</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Post;