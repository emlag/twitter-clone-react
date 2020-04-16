import React from 'react';

function getPosts(comp, path) {
    fetch(path).then(results => {
        return results.json();
    }).then(data => {
        let postsToShow = [];
        let posts = data["posts"];
        for (let id in posts) {
            let post = {
                author: posts[id]["author"],
                text: posts[id]["body"],
                email: posts[id]["email"],
                key: id
            };
            postsToShow.push(post);
        }
        console.log(postsToShow);
        comp.setState({
            availPosts: postsToShow,
        })
    })
}

export default getPosts;