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
            prevLiked: false,
            id: props.id
        }
    }

    newLike = () => {
        let newLikesCount = this.state.likesCount + 1;
        this.setState({
            likesCount: newLikesCount,
            prevLiked: true
        });
        this.updatePost();
    };

    unlike = () => {
        let newLikesCount = this.state.likesCount - 1;
        this.setState({
            likesCount: newLikesCount,
            prevLiked: false
        });
        this.updatePost();
    };

    updatePost = () => {
      fetch(`/posts/${this.state.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              likes_count: this.state.likesCount
          })
      })
          .then(response =>{
              console.log("update the likes count!")
          })
    };

    render() {
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
                        <a href="" id="edit-tweet">Edit</a>
                    </div>
                    <div>
                        {this.state.text}
                    </div>

                    <div className="like-container">
                        <a onClick={this.state.prevLiked === true ? this.unlike : this.newLike} className="like-button">
                            <i className={this.state.prevLiked === true
                                ? "material-icons is-liked"
                                : "material-icons not-liked bouncy"}>
                                {this.state.prevLiked === true ? "favorite" : "favorite_border"} </i>
                        </a>
                        <p className="like-count">{this.state.likesCount} likes</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Post;