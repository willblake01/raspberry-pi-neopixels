export class IntervalRunner {
    private id: NodeJS.Timeout | null = null;
    private stopped = true;

    constructor(private readonly interval: number, private readonly step: () => void) {}

    start() {
        this.stop();
        this.stopped = false;
        this.step();
        this.id = setInterval(() => {
            if (!this.stopped) this.step();
        }, this.interval);
    }

    stop() {
        this.stopped = true;
        if (this.id) {
            clearInterval(this.id);
            this.id = null;
        }
    }
}