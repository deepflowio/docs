import Zooming from './zooming';
const zoomingSelector = ZOOMING_SELECTOR;
const zoomingOptions = JSON.parse(ZOOMING_OPTIONS);
const zoomingDelay = Number(ZOOMING_DELAY);
export class VuepressZooming {
    constructor() {
        this.instance = new Zooming(zoomingOptions);
    }
    update(selector = zoomingSelector) {
        if (typeof window === 'undefined')
            return;
        this.instance.listen(selector);
    }
    updateDelay(selector = zoomingSelector, delay = zoomingDelay) {
        setTimeout(() => this.update(selector), delay);
    }
}
//# sourceMappingURL=VuepressZooming.js.map