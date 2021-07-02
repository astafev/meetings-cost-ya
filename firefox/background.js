 
function logResponse(responseDetails) {
    // TODO put into a storage
    console.log(responseDetails.url);
    console.log(responseDetails.statusCode);
    console.log(responseDetails.statusLine);
}

browser.webRequest.onResponseStarted.addListener(
    logResponse,
    {urls: ["https://calendar.yandex-team.ru/*"]}
);
