/* eslint-disable no-useless-escape */
// возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    console.log(matches);
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
export default getCookie;