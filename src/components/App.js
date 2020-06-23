/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, createRef } from 'react';
import loader from './loader';
import "../style/css/style.css";
import SuccessRegistration from './SuccessRegistration';
import Welcome from './Welcome';
import Nav from './Nav';

class App extends Component {
    constructor(props) {
        super(props);
        this.nickNameOrEmail = createRef();
        this.passwordLogin = createRef();
        this.fullName = createRef();
        this.nickName = createRef();
        this.email = createRef();
        this.passwordRegister = createRef();
        this.confirmPassword = createRef();
    }
    state = {
        mode: "login", // login, register, success registration, welcome
        fullName: "",
        avatarLink: ""
    }
    onSelectLoginMode = () => this.setState({ mode : "login" });
    onSelectRegisterMode = () => this.setState({ mode : "register" });

    onSubmitRegisterForm = async (event) => {
        event.preventDefault();
        console.log('onSubmitRegisterForm');
        const body = {
            nickName: this.nickName.current.value,
            password: this.passwordRegister.current.value,
            confirmPassword: this.confirmPassword.current.value,
            email: this.email.current.value,
            fullName: this.fullName.current.value
        };
        const responseData = await loader(body, "/canIregister");
        if ( responseData.report.isError ) return;

        // some code
    };
    onSubmitLoginForm = async (event) => {
        event.preventDefault();
        console.log('onSubmitLoginForm');
        const body = {
            nickNameOrEmail: this.nickNameOrEmail.current.value,
            password: this.passwordLogin.current.value
        };
        const responseData = await loader(body, "/canIlogin");
        if ( responseData.report.isError ) return;

        const { fullName, avatarLink } = responseData.reply;
        console.log('fullName, avatarLink: ', fullName, avatarLink);
        // some code
    }
    render() {
        const { mode } = this.state;
        return (
        <div
            id="frame"
            className={
                mode === "success registration" || mode === "welcome" ? "frame-short" :
                mode === "register" ? "frame-long" : ""
            }
        >
            {mode  === "login" && <>
                <Nav
                    mode={ mode }
                    onChangeCard={ this.onSelectRegisterMode }
                />
                <form id="form-signin" onSubmit={ this.onSubmitLoginForm }>
                    <label htmlFor="nickNameOrEmail">Почта или никнейм</label>
                    <input className="form-styling" type="text" id="nickNameOrEmail" placeholder="" autoComplete="username" ref={this.nickNameOrEmail}/>
                    <label htmlFor="passwordLogin">Пароль</label>
                    <input className="form-styling" type="password" id="passwordLogin" placeholder="" autoComplete="current-password" ref={this.passwordLogin}/>
                    <input type="checkbox" id="checkbox" />
                    <label htmlFor="checkbox"><span className="ui"></span>Запомнить меня</label>
                    <div id="btn-animate" className="btn-wrapper">
                        <input type="submit" className="btn" value="Войти" />
                    </div>
                </form>
                <div className="forgot">
                    <a href="#">
                        Забыли пароль?
                    </a>
                </div>
            </>}
            {mode  === "register" && <>
                <Nav
                    mode={ mode }
                    onChangeCard={ this.onSelectLoginMode }
                />
                <form id="form-signup" onSubmit={ this.onSubmitRegisterForm }>
                    <label htmlFor="fullName">Полное имя</label>
                    <input className="form-styling" type="text" id="fullName" placeholder="" autoComplete="name" ref={this.fullName}/>
                    <label htmlFor="nickName">Никнейм</label>
                    <input className="form-styling" type="text" id="nickName" placeholder="" autoComplete="username" ref={this.nickName}/>
                    <label htmlFor="email">Почта</label>
                    <input className="form-styling" type="email" id="email" placeholder="" autoComplete="email" ref={this.email}/>
                    <label htmlFor="passwordRegister">Пароль</label>
                    <input className="form-styling" type="password" id="passwordRegister" placeholder="" autoComplete="new-password" ref={this.passwordRegister}/>
                    <label htmlFor="confirmPassword">Повторите пароль</label>
                    <input className="form-styling" type="password" id="confirmPassword" placeholder="" autoComplete="new-password" ref={this.confirmPassword}/>
                    <div className="btn-wrapper">
                        <input type="submit" className="btn" value="Создать аккаунт" />
                    </div>
                </form>
            </>}
            { mode  === "success registration" && <SuccessRegistration/> }
            { mode  === "welcome" && <Welcome
                avatarLink={this.state.avatarLink}
                fullName={this.state.fullName}
            /> }
        </div>
        );
    }
}

export default App;
