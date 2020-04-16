import React, {Component} from 'react';
import ShowPosts from "./ShowPosts";
import getPosts from "./getPosts";

class AllPosts extends Component {
    componentDidMount() {
        getPosts(this, `posts?page=${this.state.currPage}`);
    }

    constructor(props) {
        super(props);
        this.state = {
            availPosts: [],
            currPage: 1,
            numPages: 0
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.currPage !== prevState.currPage) {
            getPosts(this, `posts?page=${this.state.currPage}`);
            console.log("numPates in didUpdate");
            // console.log(this.state.numPages);
            console.log(this.state.currPage);
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

        console.log("next page!");
    };

    prevPage = (event) => {
        event.preventDefault();
        let newPageVal = this.state.currPage - 1;
        if (newPageVal > 0) {
            this.setState({
                currPage: this.state.currPage - 1
            });
        }
        console.log("prev page!");

    };

    render() {
        return (
            <div>
                <ShowPosts allPosts={this.state.availPosts}/>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item"><a onClick={this.prevPage} className="page-link"
                                                     href="!#">Previous</a>
                        </li>
                        {/*<li className="page-item"><a className="page-link" href="#">1</a></li>*/}
                        {/*<li className="page-item"><a className="page-link" href="#">2</a></li>*/}
                        {/*<li className="page-item"><a className="page-link" href="#">3</a></li>*/}
                        <li className="page-item"><a onClick={this.nextPage} className="page-link" href="!#">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default AllPosts;