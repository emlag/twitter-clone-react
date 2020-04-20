import React, {Component} from 'react';
import getPosts from "./getPosts";
import ShowPosts from "./ShowPosts";

/**
 * A wrapper for ShowPosts that is used by React router.
 *
 */
function following()  {

        return (
            <div>
                <ShowPosts pathToPosts={"/following_posts"}/>
            </div>
        );
}

export default following;