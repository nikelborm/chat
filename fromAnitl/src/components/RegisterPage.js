import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import AuthForm from "./AuthForm";
import { isRegistrationAllowed, AuthContext } from "./Auth";
import app, { usersStore } from "../firebase";

class RegisterPage extends Component {
    static contextType = AuthContext;
    onHandleRegister = async (email, password, fullName) => {
        const credential = await app.auth().createUserWithEmailAndPassword(email, password);
        await usersStore.doc(credential.user.uid).set({
            isAdminOnlyForGUI: false,
            likes: [],
            name: fullName
        });
        this.props.history.replace("/home");
    };
    render() {
        console.log("this.context: ", this.context);
        if (!isRegistrationAllowed) {
            return <Redirect to="/login" />;
        }
        return (
            <AuthForm
                mode="register"
                onSubmit={ this.onHandleRegister }
            />
        );
    }
}

export default withRouter(RegisterPage);
