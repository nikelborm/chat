/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { postsStore } from "../firebase";
import PostManager from "./PostManager";

class FullScreenPost extends Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null;
    }
    state = {
        isDownloading: true,
        isExists: false
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    componentDidMount = () => {
        this.unsubscribe = postsStore.doc(this.props.computedMatch.params.postId).onSnapshot((snapshot) => {
            if (snapshot.exists) {
                this.setState({
                    isDownloading: false,
                    isExists: true,
                    id: snapshot.id,
                    post: snapshot.data()
                });
            } else {
                this.setState({
                    isDownloading: false,
                    isExists: false
                });
            }
        })
    }
    render() {
        const { isExists, id, isDownloading, post } = this.state;
        return (<>
            <a href="#" onClick={ this.props.history.goBack } className="topage"> Вернуться </a>
            <div className="container">
                <br/><br/><br/>
                { isDownloading
                    ? <h3>Новость загружается...</h3>
                    : isExists
                        ? <PostManager
                            id={ id }
                            isExpanded={ true }
                            { ...post }
                        />
                        : <h2> Новость не найдена </h2>
                }
            </div>
        </>);
    }
}

export default withRouter(FullScreenPost);
