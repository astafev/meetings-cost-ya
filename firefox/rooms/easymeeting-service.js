/**
 * @typedef EasymeetingCombinationsResponse
 * @property {Office[]} offices
 */
/**
 * @typedef Office
 * @property {Combination[]} combinations
 */
/**
 * @typedef Combination
 * @property {Slot[]} slots
 */
/**
 * @typedef Slot info about the room
 * @property {any} info
 * @property {number|null} eventId
 * @property {any} name info about the conference room
 * @property {any} factors detailed calculated information about the room availability status
 * @property {string} dateTo ISO datetime without milliseconds
 * @property {string} dateFrom same shit
 * @property {"empty"|"busy"|"unavailableAll"|"partBusy"} tip availability status. We need "unavailableAll"
 */
const easymeeting = function easymeeting(officeId = 3, tzOffset = "18000000", baseUrl = 'https://easymeeting.yandex-team.ru') {

    /**
     * 
     */
    const result = {}

    /**
     * 
     * @param {EasymeetingCombinationsResponse} response 
     * @returns map of eventId/status
     */
    async function parseResponse(response) {
        const finalMap = {}


        response.offices
            .forEach(
                office => office.combinations.forEach(
                    combination => combination.slots.forEach(
                        slot => {
                            if (slot.eventId)
                                finalMap[eventId] = slot['tip']
                        })
                ))

        return finalMap
    }


    /**
     * 
     * @returns {Promise<EasymeetingCombinationsResponse>}
     */
    async function combinations(start = new Date()) {

        /** format date into a weird easymeting's format that excludes seconds and milliseconds */
        function formatDate(date) {
            const fullString = date.toISOString()
            return fullString.slice(0, 16) + fullString.slice(23)
        }

        if (start.getMinutes() > 30) {
            start.setMinutes(30)
        } else {
            start.setMinutes(0)
        }
        start.setSeconds(0)
        start.setMilliseconds(0)

        // when the request spans 2 days, the API responds with Internal Server Error
        const midnight = new Date(start)
        midnight.setHours(23)
        midnight.setMinutes(59)
        const body = {
            type: "duration",
            dateFrom: formatDate(start),
            dateTo: formatDate(midnight),
            duration: 30,
            participants: [{ officeId, tzOffset }]
        }
        const response = await fetch(`${baseUrl}/v2/combinations/`, {
            "credentials": "include",
            "headers": {
                "Content-Type": "application/json",
            },
            "body": JSON.stringify(body),
            "method": "POST"
        }).catch(err => {
            console.error(err)
        });
        if (response?.status !== 200) {
            throw new Error(`Can't request easymeeting. Can't help with finding an empty room... See the network tab for debugging.`)
        }
        console.log(response)
    }


    return {
        /**
         * @param {Event[]} events 
         * @returns {Promise<number>[]}
         */
        checkEvents(events) {
            //console.log(events)
            if (events.length) {
                //console.log(combinations())
            }
            return []
        },

        initForADay() {
            combinations(new Date())
                .then(parseResponse)
                .then(map => {
                    for (let eventId in map) {
                        const success = map[eventId] === 'unavailableAll'
                        if (result[eventId]) {
                            if (success) result[eventId].resolve(eventId)
                            else result[eventId].reject(eventId)
                        } else {
                            if (success) result[eventId] = Promise.resolve(eventId)
                            else result[eventId] = Promise.reject(eventId)
                        }
                    }

                    for (let eventId in result[eventId]) {
                        
                    }
                })
        },
    }
}
