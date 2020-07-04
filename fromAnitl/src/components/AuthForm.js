import React, { Component } from "react";

class AuthForm extends Component {
    state = {
        isSendingNow: false
    }
    onFinishSending = () => {
        this.setState({
            isSendingNow: false
        });
    };
    onStartSending = () => {
        this.setState({
            isSendingNow: true
        });
    }
    onSubmit = (event) => {
        event.preventDefault();
        this.onStartSending();
        const { email, password, fullName } = event.target.elements;

        this.props.onSubmit(
            email.value,
            password.value,
            fullName?.value
        ).catch((error) => {
            // TODO: уведомить пользователя об ошибке (при создании аккаунта) красиво, tippy
            alert(error);
            this.onFinishSending();
        });
    };
    render() {
        const isLogin = this.props.mode === "login";
        return (
            <div>
                <h1>{isLogin ? "Вход" : "Регистрация"}</h1>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="emailInput">Email адрес</label>
                        <input type="email" name="email" required className="form-control" id="emailInput" placeholder="Введите email" />
                    </div>
                    {!isLogin && <div className="form-group">
                        <label htmlFor="emailInput">Полное имя</label>
                        <input type="text" name="fullName" required className="form-control" id="fullNameInput" placeholder="Введите своё имя" />
                    </div>}
                    <div className="form-group">
                        <label htmlFor="passwordInput">Пароль</label>
                        <input type="password" name="password" required className="form-control" id="passwordInput" placeholder="Введите пароль" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={ this.state.isSendingNow }>
                        { this.state.isSendingNow
                            ? (isLogin ? "Вход..." : "Создание аккаунта...")
                            : (isLogin ? "Войти" : "Создать аккаунт")
                        }
                    </button>
                </form>
            </div>
        );
    }
}

export default AuthForm;
