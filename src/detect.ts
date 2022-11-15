let loopObjectCollection: { [id: number]: InfiniteLoopDetectionHost } = {};

export function clearAllInfiniteLoopChecks() {
    loopObjectCollection = {};
}
export function detectInfiniteLoop(id: number) {
    const loopObj = loopObjectCollection[id];
    if (loopObj) {
        return loopObj.shouldStopExecution();
    }
    loopObjectCollection[id] = new InfiniteLoopDetectionHost(id);
}

class InfiniteLoopDetectionHost {
    readonly identifier!: number;
    firstCall!: number;
    lastCall!: number;

    readonly TIME_LIMIT = 2200;
    readonly TIME_RESET_PERIOD = 10;

    constructor(id: number) {
        this.identifier = id;
        this.firstCall = Date.now();
        this.lastCall = this.firstCall;
    }
    shouldStopExecution(): boolean {
        const now = Date.now();
        if (now - this.lastCall > this.TIME_RESET_PERIOD) {
            this.firstCall = now;
            this.lastCall = now;
            return false;
        }
        this.lastCall = now;
        return now - this.firstCall > this.TIME_LIMIT;
    }
}