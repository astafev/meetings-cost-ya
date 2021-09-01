const watchCalendarPage = (settings) => {
    /**
     * @param {MutationRecord[]} mutationRecords
    */
    function calendarPageObserver(mutationRecords) {
        const result = mutationRecords.find(record => {
            return record.addedNodes?.length
                && record.addedNodes[0].className.includes('popup2_visible_yes')
                && record.addedNodes[0].getElementsByClassName('qa-EventFormPreview').length
        })
        if (result) {
            new Popup(result.addedNodes[0], settings).doTheStuff();
        }

    }

    if (document.URL.includes('/week')) {
        new MutationObserver(calendarPageObserver).observe(document.documentElement, { subtree: true, childList: true })
    }
}