document.body.style.border = "5px solid red";

let _events = {}
let _schedules = []

var settings = propertiesConfig.reduce((obj, prop)=>{
    obj[prop.id] = prop.default
    return obj;
}, {})



readSettings().then(flatSettings => {
    if  (flatSettings.currency) {
        settings = flatSettings
    }
    watchCalendarPage(settings)
});



browser.storage.local.remove('schedule')
browser.storage.local.remove('events')
browser.storage.onChanged.addListener(changeData => {
    newSchedules(changeData['schedule']?.newValue.models[0]?.data?.intervals)
    
    newEvents(changeData['events']?.newValue.models[0]?.data?.events)
});

function newSchedules(schedules) {
    return
    if (!schedules) {
        return
    }
    _schedules = schedules
    console.log(_schedules)
}

/** @param {Record<string, any>[]} events */
function newEvents(events) {
    return
    if (!events) {
        return
    }
    // TODO multiple events requests, need smart filtering and cleaning up
    events.forEach(event => {
        _events[event.id] = event
    })
    console.log(_events)
}

Node.prototype.queryByClass = function(className) {
    return this.querySelector('div[class^=' + className + '--]')
}
Node.prototype.queryByClassAll = function(className) {
    return this.querySelectorAll('div[class^=' + className + '--]')
}
