import React from 'react';
import {Link} from 'react-router-dom';

function Post(props) {
    return (
        <div className="post" >
            <div id="tweet-image">
                SomeImage
            </div>
            <div className="tweet-container">
                <div className="tweet-header">
                    <div id="user-name">
                        <Link to={`/profile/${props.username}`}>{props.username}</Link>
                    </div>
                    <div id="handle">
                        {props.email}
                    </div>
                    <div id="timestamp">
                        timestamp
                    </div>
                    <a href="" id="edit-tweet">Edit</a>
                </div>
                <div>
                    {props.text}
                </div>
                <div className="like-container">
                    <a href="" className="like-button">
                        <i className="material-icons not-liked bouncy">favorite_border</i>
                        <i className="material-icons is-liked">favorite</i>
                    </a>
                    <p className="like-count">0 likes</p>
                </div>
            </div>
        </div>
    );
}

export default Post;