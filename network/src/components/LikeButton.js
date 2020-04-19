import React, {Component} from 'react';

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