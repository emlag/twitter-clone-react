import React, {Component} from 'react';

/**
 * A button that shows likes for a post. Changes state in parent which
 * causes refresh for the button.
 *
 * Current ISSUE: When a user is not logged in, the optimistic nature of this
 * algorithm causes the UI to show that the like was successful, but the database
 * returns an error and the like is not saved.
 */
class LikeButton extends Component {
    state = {
        likes: this.props.likesCount,
        prevLiked: false
    };

    newLike = () => {
            let newLikesCount = this.state.likes + 1;
            this.setState({
                likes: newLikesCount,
                prevLiked: true
            })
    };

    unlike =() => {
        let newLikesCount = this.state.likes - 1;
        this.setState({
            likes: newLikesCount,
            prevLiked: false
        })
    };

    render() {
        return (

            <div className="like-container">
                <a onClick={this.state.prevLiked === true ? this.unlike : this.newLike} className="like-button">
                    <i className={this.state.prevLiked === true
                        ? "material-icons is-liked"
                        : "material-icons not-liked bouncy"}>
                        {this.state.prevLiked === true ? "favorite" : "favorite_border"} </i>
                </a>
                <p className="like-count">{this.state.likes} likes</p>
            </div>
        )
    }

}

export default LikeButton