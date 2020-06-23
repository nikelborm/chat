/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, createRef } from 'react';
import loader from './loader';
import "../style/style.css";
import unnamed from '../style/unnamed.jpg';
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
        avatarStyle: {
            backgroundImage: 'url(' + unnamed + ')',
            backgroundSize: "100% 100%",
            backgroundPosition: "100% 100%"
        }
    }
    onSelectLoginMode = () => this.setState({ mode : "login" });
    onSelectRegisterMode = () => this.setState({ mode : "register" });

    onSubmitRegisterForm = async (event) => {
        // TODO: Добавить валидацию данных перед отправкой, чтобы не стучать по серверу зря
        event.preventDefault();
        const body = {
            nickName: this.nickName.current.value,
            password: this.passwordRegister.current.value,
            confirmPassword: this.confirmPassword.current.value,
            email: this.email.current.value,
            fullName: this.fullName.current.value
        };
        // const responseData = await loader(body, "/canIregister");
        // if ( responseData.report.isError ) return;

        // some code
        this.setState((prevState) => {
            prevState.mode = "success registration";
            return prevState;
        });
    };
    onSubmitLoginForm = async (event) => {
        // TODO: Добавить валидацию данных перед отправкой, чтобы не стучать по серверу зря
        event.preventDefault();
        const body = {
            nickNameOrEmail: this.nickNameOrEmail.current.value,
            password: this.passwordLogin.current.value
        };
        // const responseData = await loader(body, "/canIlogin");
        // if ( responseData.report.isError ) return;

        // const { fullName, avatarLink, backgroundSize, backgroundPosition} = responseData.reply;
        // console.log('fullName, avatarLink: ', fullName, avatarLink);
        // some code
        const fullName = "Евангелина Рима";
        // const avatarLink = "https://78.media.tumblr.com/567fd31cd14ba2b05635cdd70289f820/tumblr_ouqvv5VH0n1qa9ce6o1_500.png";
        // const backgroundSize = "130%";
        // const backgroundPosition = "50% 10%";
        this.setState((prevState) => {
            prevState.mode = "welcome";
            prevState.fullName = fullName;
            // avatarLink && (prevState.avatarStyle.backgroundImage = 'url(' + avatarLink + ')');
            // backgroundSize && (prevState.avatarStyle.backgroundSize = backgroundSize);
            // backgroundPosition && (prevState.avatarStyle.backgroundPosition = backgroundPosition);
            return prevState;
        });
        // setTimeout(function () {
        //     document.location.href = document.location.origin + "/chat";
        // }, 3000);
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
                    <input className="form-styling" type="text" id="nickNameOrEmail" autoComplete="username" ref={this.nickNameOrEmail}/>
                    <label htmlFor="passwordLogin">Пароль</label>
                    <input className="form-styling" type="password" id="passwordLogin" autoComplete="current-password" ref={this.passwordLogin}/>
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
                    <input className="form-styling" type="text" id="fullName" autoComplete="name" ref={this.fullName}/>
                    <label htmlFor="nickName">Никнейм</label>
                    <input className="form-styling" type="text" id="nickName" autoComplete="username" ref={this.nickName}/>
                    <label htmlFor="email">Почта</label>
                    <input className="form-styling" type="email" id="email" autoComplete="email" ref={this.email}/>
                    <label htmlFor="passwordRegister">Пароль</label>
                    <input className="form-styling" type="password" id="passwordRegister" autoComplete="new-password" ref={this.passwordRegister}/>
                    <label htmlFor="confirmPassword">Повторите пароль</label>
                    <input className="form-styling" type="password" id="confirmPassword" autoComplete="new-password" ref={this.confirmPassword}/>
                    <div className="btn-wrapper">
                        <input type="submit" className="btn" value="Создать аккаунт" />
                    </div>
                </form>
            </>}
            { mode  === "success registration" && <SuccessRegistration/> }
            { mode  === "welcome" && <Welcome
                avatarStyle={this.state.avatarStyle}
                fullName={this.state.fullName}
            /> }
        </div>
        );
    }
}

export default App;
