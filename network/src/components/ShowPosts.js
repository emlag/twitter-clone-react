import React from 'react';
import Post from "./Post";

function ShowPosts(props) {
    const posts = props.allPosts;
    const toDisplay = posts.map(post => {
        return (
            <Post key={post.key} text={post.text} username={post.author} email={post.email} />
        )
    });
    return (
        <div> {toDisplay} </div>
    )
}

export default ShowPosts;