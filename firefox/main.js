document.body.style.border = "5px solid red";

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
console.log('hello')
browser.storage.onChanged.addListener(changeData => {
    console.log("new schedule:", changeData['schedule']?.newValue)
    // TODO multiple events requests, need smart filtering and cleaning up
    console.log("new events:", changeData['events']?.newValue)
});
