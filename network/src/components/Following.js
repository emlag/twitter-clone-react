import React, {Component} from 'react';
import getPosts from "./getPosts";
import ShowPosts from "./ShowPosts";

function following()  {

        return (
            <div>
                <ShowPosts pathToPosts={"/following_posts"}/>
            </div>
        );
}

export default following;