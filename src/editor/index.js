import UI from './ui'
export default class Editor {
    constructor() {
        this.ui = new UI(this)
    }
    mount (id) {
        this.host = id
        this.ui.render()
    }
}
