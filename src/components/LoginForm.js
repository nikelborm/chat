import React, { PureComponent, createRef } from 'react';
import serverError from "./serverError"
import loader from './loader'

class LoginForm extends PureComponent {
    constructor(props) {
        super(props);
        this.nickNameOrEmail = createRef();
        this.passwordLogin = createRef();
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.props.onSubmit();
        const body = {
            nickNameOrEmail: this.nickNameOrEmail.current.value,
            password: this.passwordLogin.current.value
        };
        try {
            const { fullName, avatarLink } = await loader(body, "/canIlogin");
            console.log('fullName, avatarLink: ', fullName, avatarLink);
            // if (avatarLink) {
            //     id("profile-photo").style.backgroundImage = `url(${avatarLink})`;
            // }
            // id("welcome").textContent = `Welcome, ${fullName}`;
            // id("btn-animate").classList.add("btn-animate-grow");
            // id("welcome").classList.add("welcome-left");
            // id("cover-photo").classList.add("cover-photo-down");
            // id("frame").classList.add("frame-short");
            // id("profile-photo").classList.add("profile-photo-down");
            // id("forgot").classList.add("forgot-fade");
            // setTimeout(function () {
            //     document.location.href = document.location.origin + "/chat";
            // }, 3000);

        } catch (error) {
            console.log('error: ', error);
            if (error instanceof serverError) {
                console.log("error instanceof serverError");
            }
            // setNewTippy(errorField, info);
        }
    }
    render() {
        return (
            <form id="form-signin" onSubmit={ this.onSubmit }>
                <label htmlFor="nickNameOrEmail">Почта или никнейм</label>
                <input className="form-styling" type="text" id="nickNameOrEmail" placeholder="" autoComplete="username"/>
                <label htmlFor="passwordLogin">Пароль</label>
                <input className="form-styling" type="password" id="passwordLogin" placeholder="" autoComplete="current-password"/>
                <input type="checkbox" id="checkbox" />
                <label htmlFor="checkbox"><span className="ui"></span>Запомнить меня</label>
                <div id="btn-animate" className="btn-wrapper">
                    <input type="submit" id="btn-signin" value="Войти" />
                </div>
            </form>
        );
    }
}

export default LoginForm;
