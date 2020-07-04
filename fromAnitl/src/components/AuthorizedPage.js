import React, { Component } from "react";
import { AuthContext } from "./Auth";
import { Redirect } from "react-router-dom";
import News from "./News";

class AuthorizedPage extends Component {
    static contextType = AuthContext;
    render() {
        console.log("this.context: ", this.context);
        if (!this.context.isFirstCalled) {
            return "Загрузка...";
        }
        if (this.context.isAdminOnlyForGUI) {
            return <Redirect to="/admin"/>;
        }
        if (!this.context.currentUser) {
            return <Redirect to="/" />;
        }
        return (<>
            <div className="container">
                <News/>
            </div>
        </>);
    }
}

export default AuthorizedPage;
