document.body.style.border = "5px solid red";

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
        new Popup(result.addedNodes[0]).doTheStuff();
    }

    // TODO clean up?
}

new MutationObserver(callback)
    .observe(document.documentElement, {subtree: true, childList: true})
