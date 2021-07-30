//document.body.style.border = "5px solid red";

let _events = {}
let _schedules = []

var settings = propertiesConfig.reduce((obj, prop)=>{
    obj[prop.id] = prop.default
    return obj;
}, {})

/**
 * @param {MutationRecord[]} mutationRecords
*/
function callback(mutationRecords) {
    const result = mutationRecords.find(record => {
        return record.addedNodes?.length
            && record.addedNodes[0].className.includes('popup2_visible_yes')
            && record.addedNodes[0].getElementsByClassName('qa-EventFormPreview').length
    })
    if (result) {
        console.log(settings)
        new Popup(result.addedNodes[0], settings).doTheStuff();
    }

    // TODO clean up?
}

browser.storage.sync.get(null).then(flatSettings => {
    if  (flatSettings.currency) {
        settings = flatSettings
    }
    // console.log(settings)
    new MutationObserver(callback).observe(document.documentElement, {subtree: true, childList: true})
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
