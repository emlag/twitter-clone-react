import React, {Component} from 'react';
import ShowPosts from "./ShowPosts";

/**
 * A wrapper for ShowPosts that is used by React router.
 *
 */
function allPosts() {
        return (
            <div>
                <ShowPosts pathToPosts={"/posts"}/>
            </div>
        );
}

export default allPosts;