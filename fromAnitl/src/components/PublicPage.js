import React, { Component } from "react";
import News from "./News";
import { Redirect, withRouter } from "react-router-dom";
import { AuthContext } from "./Auth";

class PublicPage extends Component {
    static contextType = AuthContext;
    render() {
        console.log("this.context: ", this.context);
        if (!this.context.isFirstCalled) {
            return "Загрузка...";
        }
        if (this.context.isAdminOnlyForGUI) {
            return <Redirect to="/admin"/>;
        }
        if (!!this.context.currentUser) {
            return <Redirect to="/home"/>;
        }
        return (
            <div className="container">
                <News/>
            </div>
        );
    }
}

export default withRouter(PublicPage);
