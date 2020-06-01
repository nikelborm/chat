function createEmptyResponseData() {
    const resdata = {
        handlerType: "logs",
        report: {
            isError: true,
            info: ""
        },
        reply: {}
    };
    return { resdata, rp: resdata.report };
}
exports.createEmptyResponseData = createEmptyResponseData;
