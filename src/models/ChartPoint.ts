import { Moment } from 'moment';

export class ChartPoint {
  public constructor (
    public date: Moment,
    public value: number) {}
}
