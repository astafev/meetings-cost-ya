const settings = {
    "currency": "часов",
    "wage": 1,
    "currencyFirst": false,
    "costLabel": "Потрачено",
}

class Popup {
    constructor(root) {
        this.root = root
        this.settings = settings
    }

    __findParticipants() {
        this.participants = []
        const nodeList = this.root.querySelectorAll('a[href^="https://staff.yandex-team"]')
        nodeList.forEach(node=>{
            const parsed = /^.*yandex-team\.ru\/(.+)$/.exec(node.href)
            
            // exclude the meeting room
            if (!parsed || parsed[1].indexOf('map/') === 0) {
                return;
            }
            
            this.participants.push({
                node: node,
                login: parsed[1],
                // TODO parse status (accepeted/rejected)
            })
        })
    }

    init() {
        this.__findParticipants();
    }


    __getNumOfParticipants() {
        return this.participants.length
    }

    __calculateDuration() {
        const dateNode = this.root.querySelector('div[class^=EventDatesField__value--')
        const parsed = /.*, (\d{1,2}):(\d{1,2}) . (\d{1,2}):(\d{1,2})$/.exec(dateNode.textContent)
        if (!parsed) {
            throw "can't parse duration :( " + dateNode.textContent
        }
        const hours = parsed[3] - parsed[1] + (parsed[4] - parsed[2]) / 60
        return hours
    }

    __writeCost() {
        const cost = this.__getNumOfParticipants() * settings.wage * this.__calculateDuration()
        if (settings.currencyFirst) {
            return `${this.settings.currency} ${cost}`
        } else {
            return `${cost} ${this.settings.currency}`
        }
    }

    /** @param {Node} node clone of the bottom line */
    __enrichNode(node) {
        node.classList.remove(node.classList[node.classList.length-1])
        node.childNodes[0].textContent = settings.costLabel

        node.childNodes[1].textContent = this.__writeCost()
        return node
    }



    showCost() {
        /** @const {Node} */
        const lastRow = this.root.querySelector('div[class^=EventFormField__wrap]:last-of-type')
        const cloned = this.__enrichNode(lastRow.cloneNode(true, true))
        lastRow.parentNode.append(cloned)
    }

    doTheStuff() {
        this.init()
        if (this.__getNumOfParticipants()) {
            this.showCost()
        } else {
            console.log('No participants - no spendings. Smart move!')
        }
    }
}

function findActivePopup() {
    const popups = document.getElementsByClassName('popup2_visible_yes')
    if (popups.length)
      return new Popup(popups[0])
}
/**/
