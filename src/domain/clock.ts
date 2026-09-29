export interface Clock { now(): Date }

export class SystemClock implements Clock {
  now(): Date { return new Date(); }
}

export class DemoClock implements Clock {
  constructor(private instant: Date) {}
  now(): Date { return new Date(this.instant.getTime()); }
  advanceMinutes(minutes: number): void {
    this.instant = new Date(this.instant.getTime() + minutes * 60_000);
  }
}
