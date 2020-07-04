/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, createRef } from 'react';
// import loader from './loader';
import "../style/level1/style.css";
import unnamed from '../style/level1/unnamed.jpg';
import SuccessRegistration from './SuccessRegistration';
import Welcome from './Welcome';
import Nav from './Nav';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

class App extends Component {
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

export default App;
