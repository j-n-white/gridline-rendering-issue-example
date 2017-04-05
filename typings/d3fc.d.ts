// Type definitions for d3fc
/// <reference types="d3" />

declare module "d3fc" {
    import { AxisScale } from 'd3-axis';
    import {
        ScaleBand, ScaleIdentity, ScaleLinear, ScaleLogarithmic, ScaleOrdinal, ScalePoint, ScalePower, ScaleQuantile,
        ScaleQuantize, ScaleSequential, ScaleThreshold, ScaleTime
    } from 'd3-scale';
    import { CurveFactory, CurveFactoryLineOnly } from 'd3-shape';
    import { BaseType, Selection } from 'd3-selection';
    import { TimeInterval } from 'd3-time';

    type Decorator = (selection: Selection<BaseType, any, BaseType | null, any>) => void;

    interface Valuable {
        valueOf(): number | string;
    }
    interface Stringable {
        toString(): string;
    }
    type Primitivish = number | string | Date;
    type ScalarReturnType = number | string | Valuable;

    interface Accessor {
        <T, V>(datum: T, index: number): V;
    }
    interface ScalarAccessor {
        <T>(datum: T): ScalarReturnType | ScalarReturnType[];
    }
    interface DateAccessor {
        <T>(datum: T): Date;
    }

    /*
     * d3fc-extent
     *  - Linear
     *  - Date
     */

    export type PadUnit = 'domain' | 'percent';

    interface Extent {
        pad(): number[];
        pad(values: number[]): this;
        padUnit(): PadUnit;
        padUnit(unit: PadUnit): this;
    }

    export interface ExtentLinear extends Extent {
        (data: any[]): number[];

        accessors(): ScalarAccessor[];
        accessors(accessors: (ScalarAccessor[])): this;
        include(): ScalarReturnType[];
        include(values: ScalarReturnType[]): this;
        symmetricalAbout(): ScalarReturnType;
        symmetricalAbout(value: ScalarReturnType): this;
    }

    export interface ExtentDate extends Extent {
        <T>(data: T[]): Date[];

        accessors(): DateAccessor[];
        accessors(accessors: (DateAccessor[])): this;
        include(): Date[];
        include(values: Date[]): this;
        symmetricalAbout(): Date;
        symmetricalAbout(value?: Date): this;
    }

    export const extentLinear: () => ExtentLinear;
    export const extentDate: () => ExtentDate;

    /*
     * d3fc-series
     */
    type Scale<Range, Output, ScalarDomain extends Primitivish, OrdinalDomain extends Stringable>
        =
        ScaleBand<OrdinalDomain> | ScaleIdentity | ScaleLinear<Range,Output> | ScaleLogarithmic<Range,Output> |
        ScaleOrdinal<OrdinalDomain, Range> | ScalePoint<OrdinalDomain> | ScalePower<Range,Output> |
        ScaleQuantile<Range> | ScaleQuantize<Range> | ScaleSequential<Output> | ScaleThreshold<ScalarDomain,Range> |
        ScaleTime<Range,Output>;

    export interface Series {
        (context: Selection<SVGSVGElement|SVGGElement, any, any, any>): void;

        xScale<R, O, SD extends Primitivish, OD extends Stringable>(): Scale<R, O, SD, OD>;
        xScale<R, O, SD extends Primitivish, OD extends Stringable>(scale: Scale<R, O, SD, OD>): this;
        yScale<R, O, SD extends Primitivish, OD extends Stringable>(): Scale<R, O, SD, OD>;
        yScale<R, O, SD extends Primitivish, OD extends Stringable>(scale: Scale<R, O, SD, OD>): this;
        decorate(decorator: Decorator): this;
    }

    export interface SingleSeries extends Series {
        crossValue(): Accessor; // x value
        crossValue(accessor: Accessor): this;
        mainValue(): Accessor; // y value
        mainValue(accessor: Accessor): this;
    }

    export interface MultiSeries extends Series {
        series(series: [Series|AnnotationGridline]): this;
        mapping(mappingFunction: (a: any, b:any, c:any) => any): this;
    }

    export interface CurvedSeries extends SingleSeries {
        curve(): CurveFactory | CurveFactoryLineOnly;
        curve(curve: CurveFactory | CurveFactoryLineOnly): this;
    }
    export const seriesSvgLine: () => CurvedSeries;

    export interface AreaSeries extends CurvedSeries {
      baseValue(): Accessor;
      baseValue(accessor: Accessor): this;
    }
    export const seriesSvgArea: () => AreaSeries;

    export interface PointSeries extends SingleSeries {
      size(): number;
      size(size: number): this;
    }
    export const seriesSvgPoint: () => PointSeries;

    export const seriesSvgMulti: () => MultiSeries;

    /*
     * d3fc-axis
     */
    export interface Axis<Domain> extends d3.Axis<Domain> {
        decorate(): Decorator;
        decorate(decorator: Decorator): this;
    }
    export const axisBottom: <Domain>(scale: AxisScale<Domain>) => Axis<Domain>;
    export const axisLeft: <Domain>(scale: AxisScale<Domain>) => Axis<Domain>;
    export const axisRight: <Domain>(scale: AxisScale<Domain>) => Axis<Domain>;
    export const axisTop: <Domain>(scale: AxisScale<Domain>) => Axis<Domain>;

    /*
     * d3fc-annotation
     */
    export interface Annotation {
        (context: Selection<SVGSVGElement|SVGGElement, any, any, any>): void;

        xScale<R, O, SD extends Primitivish, OD extends Stringable>(): Scale<R, O, SD, OD>;
        xScale<R, O, SD extends Primitivish, OD extends Stringable>(scale: Scale<R, O, SD, OD>): this;
        yScale<R, O, SD extends Primitivish, OD extends Stringable>(): Scale<R, O, SD, OD>;
        yScale<R, O, SD extends Primitivish, OD extends Stringable>(scale: Scale<R, O, SD, OD>): this;
    }
    export interface AnnotationGridline extends Annotation {
        xTicks(): number;
        xTicks(count: number | TimeInterval): this;
        yTicks(): number;
        yTicks(count: number): this;

        xTickValues<Domain>(): Domain[];
        xTickValues<Domain>(values: Domain[]): this;
        yTickValues<Domain>(): Domain[];
        yTickValues<Domain>(values: Domain[]): this;

        xKey(): () => any;
        xKey(key: () => any): this;
        yKey(): () => any;
        yKey(key: () => any): this;

        xDecorate(): Decorator;
        xDecorate(decorator: Decorator): this;
        yDecorate(): Decorator;
        yDecorate(decorator: Decorator): this;
    }
    export const annotationSvgGridline: () => AnnotationGridline;

    /*
     * Cartesian Chart
     */
    export interface CartesianChart {
        (context: Selection<SVGSVGElement|SVGGElement, any, any, any>): void;

        xTicks(interval: TimeInterval): this;
        xTickFormat(formatFunction: (input: Date) => string): this;
        plotArea(series: Series): this;
        xDomain(xDomain: Array<Date | number | { valueOf(): number }>): this;
        yDomain(yDomain: Array<Date | number | { valueOf(): number }>): this;
        xOrient(): string;
        xOrient(orient: string): this;
        yOrient(): string;
        yOrient(orient: string): this;
    }

    export const chartSvgCartesian: <XRange, XOutput,
                                     XScalarDomain extends Primitivish, XOrdinalDomain  extends Stringable,
                                     YRange, YOutput,
                                     YScalarDomain extends Primitivish, YOrdinalDomain  extends Stringable>
        (xScale: Scale<XRange, XOutput, XScalarDomain, XOrdinalDomain>,
         yScale: Scale<YRange, YOutput, YScalarDomain, YOrdinalDomain>) => CartesianChart;
}
