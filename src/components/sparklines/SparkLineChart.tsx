import * as React from 'react';
import * as d3 from 'd3';
import * as fc from 'd3fc';
import { ChartPoint } from '../../models';

import './SparkLineChart.scss';

type SparkLineChartProps = {
    data: ChartPoint[];
};

export class SparkLineChart extends React.Component<SparkLineChartProps, {}> {

    private chartElement: Element = null;

    public constructor() {
        super();
    }

    public componentDidMount() {
        this.redraw();
    }

    public render() {
        return (
            <div ref={this.getContainerElement} className="SparkLineChart"/>
        );
    }

    private redraw() {

        const { data } = this.props;

        const yExtent = fc.extentLinear()
            .accessors([this.getValue])
            .include([0, 1]); // include 1 so if all value are 0 it can still create a gradient.

        const xExtent = fc.extentDate()
            .accessors([(d: ChartPoint) => d.date.toDate()]);

        const chartFunction = fc.chartSvgCartesian(d3.scaleTime(), d3.scaleLinear());
        chartFunction.xTicks(this.getTickIntervalForView())
            .xTickFormat(d3.timeFormat('%H'))
            .xDomain(xExtent(data))
            .yDomain(yExtent(data))
            .yOrient('none');

        const gridlines = this.createGridLines();
        const viewLine = this.createLineSeries('main line');

        const multi = fc.seriesSvgMulti().series([gridlines, viewLine]);
        chartFunction.plotArea(multi);

        d3.select(this.chartElement)
            .datum(data)
            .call(chartFunction);
    }

    private createGridLines() {
        return fc.annotationSvgGridline()
            .xTicks(this.getTickIntervalForView())
            .yTicks(0)
            .xDecorate(this.createClassNameDecorator('gridlines'));
    }

    private createLineSeries(className: string): fc.CurvedSeries {
        return fc.seriesSvgLine().curve(d3.curveMonotoneX)
            .crossValue(this.getDate)
            .mainValue(this.getValue)
            .decorate(this.createClassNameDecorator(className));
    }

    private createClassNameDecorator(className: string) {
        return (selection: d3.Selection<d3.BaseType, any, d3.BaseType, any>) => {
            selection.classed(className, true);
        };
    }

    private getValue = (d: ChartPoint) => d.value;
    private getDate = (d: ChartPoint) => d.date;

    private getTickIntervalForView(): d3.TimeInterval {
        return d3.timeHour.every(4);
    }

    private getContainerElement = (element: Element) => this.chartElement = element;
}
