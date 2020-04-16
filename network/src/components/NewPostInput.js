import React from 'react';

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