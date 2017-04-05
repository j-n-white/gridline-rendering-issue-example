import { ChartPoint } from '../models';
import { utc } from 'moment';

export class DataService {

    public static getData(): ChartPoint[] {
        const now = utc();
        const minutesTruncatedToHalfHour = now.minute() >= 30 ? 30 : 0;
        const fromDate = utc(now)
            .minute(minutesTruncatedToHalfHour)
            .second(0)
            .millisecond(0)
            .subtract(1, 'day')
            .subtract(30, 'minute');

        return DataService.baseData().map((value: number) => ({
                date: fromDate.add(30, 'minute').clone(),
                value
            })
        );
    }

    private static baseData(): number[] {
        return [
            0.20, 0.20, 0.21, 0.22, 0.23, 0.22, 0.22, 0.23,
            0.26, 0.30, 0.35, 0.42, 0.50, 0.60, 0.78, 0.96,
            1.00, 0.98, 0.99, 0.97, 1.00, 1.00, 0.98, 0.99,
            0.97, 0.99, 0.99, 0.98, 1.00, 1.00, 1.00, 0.98,
            0.97, 0.96, 0.96, 0.97, 0.99, 1.00, 1.00, 0.98,
            0.99, 0.95, 0.86, 0.74, 0.56, 0.39, 0.25, 0.21
        ];
    }
}
