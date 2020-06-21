import serverError from './serverError'

async function loader(body, address) {
    const data = await (await fetch(document.location.origin + address, {
        method: "post",
        body: JSON.stringify(body),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    })).json();
    console.log(data);
    const { isError, info } = data.report;
    const { errorField } = data.reply;
    if (isError) {
        throw new serverError(info, errorField);
    }
    return data;
}
export default loader;
