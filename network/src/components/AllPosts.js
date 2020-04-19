import React, {Component} from 'react';
import ShowPosts from "./ShowPosts";


function allPosts() {
        return (
            <div>
                <ShowPosts pathToPosts={"/posts"}/>
            </div>
        );
}

export default allPosts;