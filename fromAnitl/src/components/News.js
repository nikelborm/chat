import React, { Component, Fragment } from "react";
import { postsStore } from "../firebase";
import PostManager from "./PostManager";
import { AuthContext } from "./Auth";

class News extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.unsubscribe = null;
    }
    state = {
        isDownloading: true,
        posts: []
    }

    componentDidMount() {
        this.unsubscribe = postsStore.orderBy("time", "desc").onSnapshot(snapshot => {
            this.setState({
                isDownloading: false,
                posts: snapshot.docs
            });
        });
    }
    componentWillUnmount() {
        this.unsubscribe()
    }
    renderPosts = () => {
        return this.state.posts.map((postRef) => {
            return(
                <Fragment key={ postRef.id }>
                    <PostManager
                        id={ postRef.id }
                        isExpanded={ false }
                        { ...postRef.data() }
                    />
                    <hr/>
                </Fragment>
            );
        });
    }
    render() {
        return (<>
            <h1>Новости: </h1>
            <br/>
            { this.state.isDownloading
                ? <h3>Новости загружаются...</h3>
                : this.state.posts.length
                    ? ( !this.context.isFirstCalled
                        ? <h1> Ожидание входа </h1>
                        : this.renderPosts()
                    )
                    : <h3>Новостей нет</h3>
            }
        </>);
    }
}

export default News;
