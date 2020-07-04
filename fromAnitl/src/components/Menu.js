import React, { Component } from "react";
import { withRouter } from "react-router";
import { isRegistrationAllowed } from "./Auth";
import { Link } from "react-router-dom";

class Menu extends Component {
    constructor(props) {
        super(props);

        const logout = <Link to="/logout" className="topage"> Выйти из аккаунта...</Link>;
        const register = isRegistrationAllowed && <Link to="/register" className="topage">Создать аккаунт...</Link>;
        const login = <Link to="/login" className="topage">Войти в аккаунт...</Link>;
        const main = <Link to="/" className="topage">На главную...</Link>;

        this.swither = {
            "/login": <> {main} {register} <br/><br/> </>,
            "/register": <> {main} {login} <br/><br/> </>,
            "/admin": <> {logout} <br/><br/> </>,
            "/home": <> {logout} <br/><br/> </>,
            "/": <> {register} {login} <br/><br/> </>
        };
    }
    render() {
        const path = this.props.location.pathname;
        return path in this.swither ? this.swither[path] : "";
    }
}

export default withRouter(Menu);
