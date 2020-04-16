import React, {Component, useState, useEffect} from 'react';
import NewPostInput from "./NewPostInput";
import ShowPosts from "./ShowPosts";
import getPosts from "./getPosts"

class Homepage extends Component {
    componentDidMount() {
        getPosts(this, "/posts"); // create api for this user
        this.clearInputField();
    }

    constructor(props) {
        super(props);
        this.state = {
            availPosts: [],
            currentPost: {
                text: '',
                key: -1
            },
            count: 0
        };

        //this.countOne = this.countOne.bind(this);
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

    addPost = (e) => {
        e.preventDefault();
        const newPost = this.state.currentPost;
        //send call to API
        fetch('/compose', {
            method: 'POST',
            body: JSON.stringify({
                body: this.state.currentPost.text,
            })
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
        })
            .then(result => { //if things went well
                getPosts(this, "/posts"); //change this to appropriate api
                this.clearInputField();
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
                <ShowPosts allPosts={this.state.availPosts}/>
                <h1>Homepage</h1>
            </div>
        )
    }
}

export default Homepage;