function getElById(id) {
    return document.getElementById(id)
}

window.onload = function () {
    getElById("button").onclick = function () {
        const data = {
            userName: getElById("userName").value,
            password: getElById("password").value,
            repeatPassword: getElById("repeatPassword").value,
            email: getElById("email").value,
            fullName: getElById("fullName").value
        };
        fetch(document.location.origin + '/canIregister', {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            const { isError, info } = data.report;
            // getElById("infoblock").style.background = "#ecf0f1"; // white
            getElById("infotext").innerHTML = info
            getElById("infoblock").style.background = isError ? "#e74c3c" : "#288063"
            if (!isError) {
                setTimeout(function () {
                    document.location.href = document.location.origin + "/chat";
                }, 1500);
            }
        });
    }
}