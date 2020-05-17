function convertMessageTime(time) {
    return new Intl.DateTimeFormat("ru", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "Europe/Moscow"
    }).format(Date.parse(time));
}
export default convertMessageTime;