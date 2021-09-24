// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData 


function logResponse(details) {
  function processEventsResponse(parsed) {
    // browser.storage.local.set({"events": parsed})
  }
  function processScheduleResponse(parsed) {
    const model = parsed?.models[0];
    if (model && model.name === 'get-resources-schedule' && model.status === 'ok') {
      console.log(model.data)
      browser.storage.local.set({ "schedule": model.data })
      easymeeting().initForADay()
    }
  }


  const filter = browser.webRequest.filterResponseData(details.requestId);
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();

  let content = ""
  filter.ondata = event => {
    const str = decoder.decode(event.data, { stream: true })
    content += str
    filter.write(encoder.encode(str))
  }
  filter.onstop = () => {
    try {
      // console.log(content)
      let parsed = JSON.parse(content)
      if (details.url.endsWith('get-events')) {
        processEventsResponse(parsed);
      } else {
        processScheduleResponse(parsed);
      }
    } finally {
      filter.disconnect()
    }

  }
  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  logResponse,
  {
    urls: [
      // events on main calendar page
      "https://calendar.yandex-team.ru/api/models?_models=get-events",
      "https://calendar.yandex.ru/api/models?_models=get-events",
      // events on /invite page (переговорки)
      "https://calendar.yandex-team.ru/api/models?_models=get-resources-schedule",
    ]
  },
  ["blocking"]
);
