import React, { Component } from "react";
import { AuthContext } from "./Auth.js";
import { Redirect, withRouter } from "react-router-dom";
import AuthForm from "./AuthForm.js";
import app from "../firebase.js";

class LoginPage extends Component {
    static contextType = AuthContext;
    onHandleLogin = (email, password) => {
        return app.auth().signInWithEmailAndPassword(email, password);
    };
    render() {
        console.log("this.context: ", this.context);
        if (this.context.isAdminOnlyForGUI) {
            return <Redirect to="/admin" />;
        }
        if (!!this.context.currentUser) {
            return <Redirect to="/home" />;
        }
        return (
            <AuthForm
                mode="login"
                onSubmit={this.onHandleLogin}
            />
        );
    }
}

export default withRouter(LoginPage);
