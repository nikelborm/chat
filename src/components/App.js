import React, { Component } from 'react';
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm';
class App extends Component {
    state = {
        mode: "sign in" // или sign up
    }
    onSelectSignInMode = () => this.setState({ mode : "sign in" });
    onSelectSignUpMode = () => this.setState({ mode : "sign up" });

    onSubmitLoginForm = () => {
        console.log('onSubmitLoginForm');

    };
    onSubmitRegisterForm = () => {
        console.log('onSubmitLoginForm');
    };
    render() {
        const { mode } = this.state;
        return (
            <div id="container">
            <div id="frame">
                <div id="nav">
                    <ul>
                        <li
                            id="signin"
                            className={ mode === "sign in" ? "active" : "inactive" }
                            onClick={this.onSelectSignInMode}
                        >
                            <a>Sign in</a>
                        </li>
                        <li
                            id="signup"
                            className={ mode === "sign up" ? "active" : "inactive" }
                            onClick={this.onSelectSignUpMode}
                        >
                            <a>Sign up </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <LoginForm onSubmit={this.onSubmitLoginForm}/>
                    <RegisterForm onSubmit={this.onSubmitRegisterForm}/>
                    <div id="success">
                        <div id="successtext">
                            <p>
                                Благодарим за регистрацию! Перейдите по ссылке из письма, чтобы завершить создание аккаунта.
                            </p>
                        </div>
                    </div>
                </div>
                <div id="forgot">
                    <a href="#">
                        Забыли пароль?
                    </a>
                </div>
                <div>
                    <div id="cover-photo"></div>
                    <div id="profile-photo"></div>
                    <h1 id="welcome"></h1>
                </div>
            </div>
        </div>
        );
    }
}

export default App;
