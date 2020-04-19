import React, {Component} from 'react';
import {Link} from 'react-router-dom';

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
        fetch(`/posts/${this.state.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                likes_count: this.state.likesCount,
                create_like: this.state.prevLiked
            })
        })
            .then(response => {
                console.log("update the likes count!")
            })
    };

    updatePostText = () => {
        fetch(`/posts/${this.state.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                new_text: this.state.text,
            })
        })
            .then(response => {
                console.log("update the likes count!")
                this.setState({
                    isEdit: false
                });
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

        return (
            <div className="post">
                <div id="tweet-image">
                    SomeImage
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
                        <a href="#" onClick={this.showEdit} id="edit-tweet">
                            {
                                this.state.isEdit ? "Stop Edit" : "Edit"
                            }
                        </a>
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