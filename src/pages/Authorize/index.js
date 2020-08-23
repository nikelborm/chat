/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, createRef } from 'react';
// import loader from './loader';
import "./styles/index.css";
import unnamed from './styles/unnamed.jpg';
import SuccessRegistration from './components/SuccessRegistration';
import Welcome from './components/Welcome';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

class Authorize extends Component {
    constructor(props) {
        super(props);
        this.loginRefs = {
            nickNameOrEmail: createRef(),
            password: createRef()
        };
        this.registerRefs = {
            fullName: createRef(),
            nickName: createRef(),
            email: createRef(),
            password: createRef(),
            confirmPassword: createRef()
        };
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

    getValue = (refGroup) => (prop) => this[refGroup][prop].current.value;
    getRegValue = this.getValue("registerRefs");
    getLogValue = this.getValue("loginRefs");

    onSubmitRegisterForm = async (event) => {
        // TODO: Добавить валидацию данных перед отправкой, чтобы не стучать по серверу зря
        event.preventDefault();
        // const body = {
        //     nickName: this.getRegValue("nickName"),
        //     password: this.getRegValue("password"),
        //     confirmPassword: this.getRegValue("confirmPassword"),
        //     email: this.getRegValue("email"),
        //     fullName: this.getRegValue("fullName")
        // };
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
        console.log('avatarLink: ');
        event.preventDefault();
        // const body = {
        //     nickNameOrEmail: this.getLogValue("nickNameOrEmail"),
        //     password: this.getLogValue("password")
        // };
        // const responseData = await loader(body, "/canIlogin");
        // if ( responseData.report.isError ) return;

        // const { fullName, avatarLink, backgroundSize, backgroundPosition} = responseData.reply;
        // console.log('fullName, avatarLink: ', fullName, avatarLink);
        // some code
        const fullName = "Евангелина Рима";
        const avatarLink = "https://i.pinimg.com/originals/83/36/bb/8336bb1a5bfa3e69c5d4d62fd373524d.png";
        // const backgroundSize = "130%";
        // const backgroundPosition = "50% 10%";
        this.setState((prevState) => {
            prevState.mode = "welcome";
            prevState.fullName = fullName;
            avatarLink && (prevState.avatarStyle.backgroundImage = 'url(' + avatarLink + ')');
            console.log('avatarLink: ', avatarLink);
            // backgroundSize && (prevState.avatarStyle.backgroundSize = backgroundSize);
            // backgroundPosition && (prevState.avatarStyle.backgroundPosition = backgroundPosition);
            return prevState;
        });
        // import("./предзагрузка компонента чата импортирующего новые стили").then((...args) => console.log(args));
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
                <LoginForm
                    onSubmit={ this.onSubmitLoginForm }
                    refs={this.loginRefs}
                />
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
                <RegisterForm
                    onSubmit={ this.onSubmitRegisterForm }
                    refs={this.registerRefs}
                />
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

export default Authorize;
