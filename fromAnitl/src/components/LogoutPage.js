import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import app from "../firebase";

class Logout extends Component {
    constructor(props) {
        super(props);
        this.isLogoutInProcess = true;
    }
    static contextType = AuthContext;
    render() {
        console.log("this.context: ", this.context);

        if (this.isLogoutInProcess) {
            this.isLogoutInProcess = false;
            app.auth().signOut()
            return "Выход из аккаунта...";
        }
        return <Redirect to="/" />;
    }
}

export default withRouter(Logout);
