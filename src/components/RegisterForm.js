import React, { PureComponent } from 'react';

class RegisterForm extends PureComponent {
    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit()
    }
    render() {
        return (
            <form id="form-signup" onSubmit={ this.onSubmit }>
                <label htmlFor="fullName">Полное имя</label>
                <input className="form-styling" type="text" id="fullName" placeholder="" autoComplete="name"/>
                <label htmlFor="nickName">Никнейм</label>
                <input className="form-styling" type="text" id="nickName" placeholder="" autoComplete="username"/>
                <label htmlFor="email">Почта</label>
                <input className="form-styling" type="email" id="email" placeholder="" autoComplete="email"/>
                <label htmlFor="passwordRegister">Пароль</label>
                <input className="form-styling" type="password" id="passwordRegister" placeholder="" autoComplete="new-password"/>
                <label htmlFor="confirmPassword">Повторите пароль</label>
                <input className="form-styling" type="password" id="confirmPassword" placeholder="" autoComplete="new-password"/>
                <div className="btn-wrapper">
                    <input type="submit" id="btn-signup" value="Создать аккаунт" />
                </div>
            </form>
        );
    }
}

export default RegisterForm;
