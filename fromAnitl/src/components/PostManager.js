import React, { Component } from "react";
import Post from "./Post";
import PostEditor from "./PostEditor";
import { postsStore, FieldValue } from "../firebase";
import { AuthContext } from "./Auth";

class PostManager extends Component {
    // import shallowEqual from "../shallowEqual";
    // shouldComponentUpdate(nextProps, nextState) {
    //     return !shallowEqual(nextProps, this.props) ||
    //     (nextState.isEditingNow !== this.state.isEditingNow);
    // }
    static contextType = AuthContext;
    state = {
        isEditingNow: false
    }
    onStartEditing = () => {
        this.setState({
            isEditingNow: true
        });
    };
    onFinishEditing = () => {
        this.setState({
            isEditingNow: false
        });
    };
    onClickPostBtn = async (title, body, preview) => {
        console.log('preview: ', preview);
        await postsStore.doc(this.props.id).update({
            updatedTime: FieldValue.serverTimestamp(),
            title,
            preview,
            body
        });
        this.onFinishEditing();
    };
    render() {
        if (this.state.isEditingNow) {
            const { title, body } = this.props;
            return (
                <PostEditor
                    onSubmit={ this.onClickPostBtn }
                    initTitle={ title }
                    initBody={ body }
                />
            );
        }
        return (
            <Post
                { ...this.props }
                isLiked = { this.context.likes.has(this.props.id) }
                isAdminMode={ this.context.isAdminOnlyForGUI }
                isAutorized={ !!this.context.currentUser }
                changeLikeState={ this.context.changeLikeState }
                onClickEditBtn={ this.onStartEditing }
            />
        );
    }
}

export default PostManager;
