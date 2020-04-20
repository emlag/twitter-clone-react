import React from 'react';

/**
 * Creates a card for user input. The onSubmit property will take in a method that should update
 * the state of the parent to this component.
 *
 * @param props comp the component whose state this method will change
 * @public
 */

function NewPostInput(props) {
    return (
        <div className="card">
            <div className="card-body bg-card">
                <form onSubmit={props.addPost}>
                    <label>User Name</label>
                    <input type="text" className="form-control" id="status-input"
                           value={props.postText} onChange={props.useInput} placeholder="What's Happening?"/>
                    <br/>
                    <button className="btn float-right">Post</button>
                </form>
            </div>
        </div>
    )
}

export default NewPostInput;