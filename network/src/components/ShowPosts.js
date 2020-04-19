import React from 'react';
import Post from "./Post";

function ShowPosts(props) {
    const posts = props.allPosts;
    const toDisplay = posts.map(post => {
        return (
            <Post id={post.id} text={post.text}
                  username={post.author} email={post.email}
                  likesCount={post.likesCount} timeStamp={post.timeStamp}
                  key={post.id} isLiked={post.isLiked}/>
        )
    });
    return (
        <div> {toDisplay} </div>
    )
}

export default ShowPosts;