import React, {Component} from 'react';
import Post from "./Post";
import getPosts from "./getPosts";

/**
 * Class used to show posts for a specific path.
 * This class uses the method getPosts to fetch posts. getPosts will
 * update this instance's state so that the correct posts can be displayed.
 * This class also handles pagination and requests for specific pages.
 *
 */
class ShowPosts extends Component {
    componentDidMount(props) {
        getPosts(this, `${this.state.path}?page=${this.state.currPage}`);
    };

    constructor(props) {
        super(props);
        this.state = {
            availPosts: [],
            currPage: 1,
            numPages: 1,
            path: props.pathToPosts,
            refresh: this.props.refresh,
            currUser: '',
            errorMessage: ''
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.refresh !== prevProps.refresh) {
            getPosts(this, `${this.state.path}?page=${this.state.currPage}`);
        }
        if (this.state.currPage !== prevState.currPage) {
            getPosts(this, `${this.state.path}?page=${this.state.currPage}`);
        }
    }

    nextPage = (event) => {
        event.preventDefault();
        let newPageVal = this.state.currPage + 1;

        if (newPageVal <= this.state.numPages) {
            this.setState({
                currPage: this.state.currPage + 1
            });
        }
    };

    prevPage = (event) => {
        event.preventDefault();
        let newPageVal = this.state.currPage - 1;
        if (newPageVal > 0) {
            this.setState({
                currPage: this.state.currPage - 1
            });
        }
    };

    goToPage = (pageNum) => {
        this.setState({
            currPage: pageNum
        })
    };

    render() {
        const toDisplay = this.state.availPosts.map(post => {
            return (
                <Post id={post.id} text={post.text}
                      username={post.author} email={post.email}
                      likesCount={post.likesCount} timeStamp={post.timeStamp}
                      key={post.id} isLiked={post.isLiked}
                      currUser={this.state.currUser}
                />
            )
        });

        const pages = new Array(this.state.numPages).fill(0);
        const paginationNum = pages.map((p, index) => {
            return (
                <li key={index} className="page-item"><a onClick={() => {
                    this.goToPage(index + 1)
                }} className="page-link" href="#">{index + 1}</a></li>
            )
        });

        const disableNext = () => {
            if (this.state.currPage >= this.state.numPages) {
                return "page-item disabled";
            } else {
                return "page-item";
            }
        };

        const disablePrev = () => {
            if (this.state.currPage <= 1) {
                return "page-item disabled";
            } else {
                return "page-item";
            }
        };

        return (
            <div id="posts-found">
                {toDisplay}
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li className={disablePrev()}><a onClick={this.prevPage} className="page-link"
                                                         href="!#">Previous</a>
                        </li>
                        {paginationNum}
                        <li className={disableNext()}><a onClick={this.nextPage} className="page-link"
                                                         href="!#">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>

        )
    }
}

export default ShowPosts;