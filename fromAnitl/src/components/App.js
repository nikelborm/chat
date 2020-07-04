import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthProvider from "./Auth";

import LoginRoute from "./LoginPage";
import RegisterRoute from "./RegisterPage";
import PublicRoute from "./PublicPage";
import LogoutRoute from "./LogoutPage";
import FullScreenPostRoute from "./FullScreenPost";
import AdminPage from "./AdminPage";
import AuthorizedPage from "./AuthorizedPage";
import Menu from "./Menu";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <AuthProvider>
                    <Menu/>
                    <Switch>
                        <LoginRoute exact path="/login"/>
                        <RegisterRoute exact path="/register"/>
                        <LogoutRoute exact path="/logout"/>
                        <Route exact path="/admin" >
                            <AdminPage/>
                        </Route>
                        <Route exact path="/home">
                            <AuthorizedPage/>
                        </Route>
                        <FullScreenPostRoute path="/post/:postId"/>
                        <PublicRoute exact path="/"/>
                        <Route path="*">
                            <Redirect to="/"/>
                        </Route>
                    </Switch>
                </AuthProvider>
            </BrowserRouter>
        );
    }
}

export default App;
