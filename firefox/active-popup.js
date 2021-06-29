export class Popup {
    constructor(root) {
        this.root = root;
    }

    findParticipants() {
        this.participants = []
        const nodeList = this.root.querySelectorAll('a[href^="https://staff.yandex-team"]')
        nodeList.forEach(node=>{
            const parsed = /^.*yandex-team\.ru\/(\w*)$/.exec(node.href)
            
            // exclude the meeting room
            if(!parsed) {
                return;
            }
            
            this.participants.push({
                node: node,
                login: parsed[1],
            })
        })
    }


    getNumOfParticipants() {
        return this.participants.length
    }

    calculateCost(perHour) {
        return this.getNumOfParticipants() * perHour
    }
}
