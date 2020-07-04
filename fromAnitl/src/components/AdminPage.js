import React, { Component } from "react";
import News from "./News";
import PostEditor from "./PostEditor";
import { postsStore, FieldValue } from "../firebase";
import { Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

class AdminPage extends Component {
    static contextType = AuthContext;
    onClickPostBtn = (title, body, preview) => {
        return postsStore.add({
            likesCounter: 0,
            time: FieldValue.serverTimestamp(),
            title,
            preview,
            body
        });
    }

    render() {
        console.log("this.context: ", this.context);
        if (!this.context.isFirstCalled) {
            return "Загрузка...";
        }
        if (!this.context.currentUser) {
            return <Redirect to="/"/>;
        }
        if (!this.context.isAdminOnlyForGUI) {
            return <Redirect to="/home"/>;
        }
        return (
            <div className="container">
                <PostEditor
                    onSubmit={ this.onClickPostBtn }
                    setBtnEnabledWhenFinished={ true }
                    initTitle=""
                    initBody=""
                />
                <br/>
                <News/>
            </div>
        );
    }
}

export default AdminPage;
