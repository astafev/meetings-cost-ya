/**
 * @typedef {Object} Event
 * @property {number} eventId
 * @property {string} start
 * @property {string} end
 */
/**
 * @typedef {Object} RoomEvents
 * @property {Object} info - info about the room itself
 * @property {Event[]} events - events
 * @property {Object[]} restrictions - ???
 */
/**
 * @param schedules.events my events (I participate)
 * @param schedules.intervals.offices all events
 */

(() => {

    const pageReadyPromise = new Promise(resolve => {
        function check() {
            const container = document.querySelector('[class^=SpaceshipResources__resource--]');
            if (container == null) {
                setTimeout(() => check(), 1000)
            } else {
                resolve(document.querySelector('[class^=Spaceship__content--]'));
            }
        }

        check();
    });

    const requestCaughtPromise = new Promise(resolve => {
        browser.storage.onChanged.addListener(changeData => {
            if (changeData['schedule']?.newValue) {
                resolve(changeData['schedule']?.newValue)
                browser.storage.local.remove('schedule')
            }
        });
    })

    Promise.all([pageReadyPromise, requestCaughtPromise]).then(([container, schedules]) => {
        console.log('PAGE IS READY', container, schedules)
        return processPage(container, schedules)
    })

    function getEasyMeeting() {
        let date = new Date();
        if (document.URL.includes('show_date=')) {
            const parsed = /show_date=(\d{4}-\d{2}-\d{2})/.exec(document.URL)
            if (parsed)
                date = new Date(parsed[1])
        }

        return easymeeting().initForADay(date);
    }


    async function processPage(container, schedules) {

        /**
         * @param {string} roomName
         * @returns {RoomEvents}
         */
        function getEventsForRoom(roomName) {
            return (schedules.intervals.offices || []).map(office => {
                return office.resources.find(room => {
                    return room.info.name == roomName;
                })
            }).find(a => a)
        }
        /**
         * @param {Node} row
        */
        const parseRow = (row) => {
            const roomNameNode = row.queryByClass('SpaceshipResources__resourceNameWrap')
            const eventNodes = row.queryByClassAll('TimelineInterval__wrap');
            return {
                roomName: roomNameNode.textContent,
                roomNameNode,
                eventNodes
            }
        }

        if (!document.URL.includes('/invite')) {
            return {};
        }

        const easymeet = await getEasyMeeting();

        const rows = container.queryByClassAll('SpaceshipResources__resource');


        rows.forEach((row, idx) => {
            try {
                const { roomName, eventNodes } = parseRow(row);
                const roomEvents = getEventsForRoom(roomName);

                easymeet.checkEvents(roomEvents.events).forEach((promise, idx) => {
                    promise?.then(value => {
                        if (value === true) {
                            markAsPossibility(eventNodes[idx])
                        }
                    })
                })
                // TODO import easymeeting and start testing fetch API
                /*roomEvents.events.forEach((event, eventIdx) => {
                    if (!eventWillHappen(event.eventId)) {
                        markAsPossibility(eventNodes[eventIdx])
                    }
                })*/
            } catch (e) {
                console.log(`Error processing line ${idx + 1}`, e)
            }
        })
    }


    /**
     * @param {Node} eventNode 
     */
    function markAsPossibility(eventNode) {
        // TODO better color
        eventNode.style.background = '#88ffde';
    }

})()
