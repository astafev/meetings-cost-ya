// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData 

function logResponse(details) {
  const filter = browser.webRequest.filterResponseData(details.requestId);
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();

  let content = ""
  filter.ondata = event => {
    const str = decoder.decode(event.data, {stream: true})
    content += str
    filter.write(encoder.encode(str))
  }
  filter.onstop = () => {
      try {
        console.log(content)
        let parsed = JSON.parse(content)
        if (details.url.endsWith('get-events')) {
          browser.storage.local.set({"events": parsed})
        } else {
          browser.storage.local.set({"schedule": parsed})
        }
      } finally {
        filter.disconnect()
      }
      
  }
  return {};
}

browser.webRequest.onBeforeRequest.addListener(
    logResponse,
    {urls: [
        // events on main calendar page
        "https://calendar.yandex-team.ru/api/models?_models=get-events",
        // events on /invite page (переговорки)
        "https://calendar.yandex-team.ru/api/models?_models=get-resources-schedule",
    ]},
    ["blocking"]
);
