import React, {Component, useState, useEffect} from 'react';
import NewPostInput from "./NewPostInput";
import ShowPosts from "./ShowPosts";
import getPosts from "./getPosts";
import {getCookie} from "./Utils";

class Homepage extends Component {
    componentDidMount() {
        // getPosts(this, "/posts");
        this.clearInputField();
    }

    constructor(props) {
        super(props);
        this.state = {
            refresh: true,
            currentPost: {
                text: '',
                key: -1
            }
        };

        this.useInput = this.useInput.bind(this);
        this.addPost = this.addPost.bind(this);
    }

    useInput = (e) => {
        this.setState({
            currentPost: {
                text: e.target.value,
                key: Date.now()
            }
        })
    };

    clearInputField = () => {
        this.setState({
            currentPost: {
                text: '',
                key: -1
            }
        })
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.postId !== prevState.postId) {
            console.log("added one ");
            // this.forceUpdate();
        }
    }

    addPost = (e) => {
        e.preventDefault();
        const newPost = this.state.currentPost;
        const token = getCookie('csrftoken');
        //send call to API
        fetch('/compose', {
            method: 'POST',
            headers: {
                'X-CSRFToken': token
            },
            body: JSON.stringify({
                body: this.state.currentPost.text,
            })
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response.json()
        })
            .then(result => { //if things went well
                // getPosts(this, "/posts"); //change this to appropriate api
                this.clearInputField();
                this.setState({
                    refresh: !this.state.refresh
                });
            })
            .catch(err => { //otherwise print error
                console.log(err)
            })
    };

    render() {
        return (
            <div>
                <NewPostInput addPost={this.addPost} postText={this.state.currentPost.text}
                              useInput={this.useInput}> </NewPostInput>
                <ShowPosts pathToPosts={"/posts"} refresh={this.state.refresh}/>
            </div>
        )
    }
}

export default Homepage;