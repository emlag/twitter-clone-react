import React from 'react';

function getPosts(comp, path) {
    fetch(path).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        } else {
            return response.json();
        }
    }).then(data => {
        let postsToShow = [];
        let posts = data["posts"];
        for (let id in posts) {
            let post = {
                author: posts[id]["author"],
                text: posts[id]["body"],
                email: posts[id]["email"],
                likesCount: posts[id]["likes_count"],
                timeStamp: posts[id]["timestamp"],
                id: posts[id]["id"],
                isLiked: posts[id]["isLiked"]
            };
            postsToShow.push(post);
        }
        // console.log(postsToShow);
        let numPages = data["num_pages"];
        let currUser = data["curr_user"];
        comp.setState({
            availPosts: postsToShow,
            numPages: numPages,
            currUser: currUser,
        })
    })
        .catch(err => {
            comp.setState({
                errorMessage: err
            })
        })
}

export default getPosts;