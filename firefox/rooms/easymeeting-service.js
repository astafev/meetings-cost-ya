const easymeeting = function easymeeting(officeId = 3, tzOffset = "18000000", baseUrl = 'https://easymeeting.yandex-team.ru') {

    /**
     * 
     */
    const result = {}

    async function combinations(start = new Date()) {
        if (start.getMinutes() > 30) {
            start.setMinutes(30)
        } else {
            start.setMinutes(0)
        }
        start.setSeconds(0)
        start.setMilliseconds(0)

        const tomorrow = new Date(start)
        tomorrow.setDate(start.getDate() + 1)
        const body = {
            type: "duration",
            dateFrom: start.toISOString(),
            dateTo: tomorrow.toISOString(),
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
            return combinations(new Date())
        },
    }
}
