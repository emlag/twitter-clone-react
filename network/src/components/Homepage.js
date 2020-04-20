import React, {Component, useState, useEffect} from 'react';
import NewPostInput from "./NewPostInput";
import ShowPosts from "./ShowPosts";
import getPosts from "./getPosts";
import {getCookie} from "./Utils";


/**
 * Holds state and components for the Homepage.
 * The state us used to kep track of the input post's information when
 * the user wants to write a new post.
 *
 */
class Homepage extends Component {
    componentDidMount() {
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

    /**
     * Updates the currentPosts state when the text area has changed.
     *
     * @param e the event passed in by onClick
     * @public
     */
    useInput = (e) => {
        this.setState({
            currentPost: {
                text: e.target.value,
                key: Date.now()
            }
        })
    };

    /**
     * Clear's new posts text area and key
     *
     * @public
     */
    clearInputField = () => {
        this.setState({
            currentPost: {
                text: '',
                key: -1
            }
        })
    };

    /**
     * Use API to send a POST request to create a new post.
     *
     * @param e the event passed in by onClick
     * @public
     */
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
                this.clearInputField();

                //refresh the posts shown on this page
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