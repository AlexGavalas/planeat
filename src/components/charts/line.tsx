import { LineChart as MantineLineChart } from '@mantine/charts';
import { Card } from '@mantine/core';
import { format, isValid, parse } from 'date-fns';
import { type TooltipContentProps, type XAxisTickContentProps } from 'recharts';

import { BRAND_COLORS } from '~theme';

type ChartDataItem = {
    x: string;
    y: number | null;
};

type ChartPoint = {
    date: string;
    index: number;
    value: number | null;
};

type LineChartProps<DataItem> = Readonly<{
    target?: number;
    unit: string;
    data: {
        id: string;
        data: DataItem[];
    }[];
}>;

const formatDate = (value: unknown) => {
    if (typeof value !== 'string' && typeof value !== 'number') {
        return '-';
    }

    const date = parse(String(value), 'yyyy-MM-dd', new Date());

    return isValid(date) ? format(date, 'dd/MM/yy') : '-';
};

const getTicks = (min: number, max: number, count = 10) => {
    const roughStep = Math.abs(max - min) / count;

    if (!roughStep) {
        return [min];
    }

    const power = Math.floor(Math.log10(roughStep));
    const powerOfTen = 10 ** power;
    const error = roughStep / powerOfTen;
    const factor =
        error >= Math.sqrt(50)
            ? 10
            : error >= Math.sqrt(10)
              ? 5
              : error >= Math.sqrt(2)
                ? 2
                : 1;
    const step = factor * powerOfTen;
    const first = Math.ceil(min / step) * step;
    const last = Math.floor(max / step) * step;
    const length = Math.round((last - first) / step) + 1;

    return Array.from({ length }, (_, index) =>
        Number((first + index * step).toPrecision(12)),
    );
};

const DateTick = ({
    index,
    payload,
    visibleTicksCount,
    x,
    y,
}: XAxisTickContentProps) => {
    const isFirst = index === 0;
    const isLast = index === visibleTicksCount - 1;
    const textAnchor =
        isFirst && isLast
            ? 'middle'
            : isFirst
              ? 'start'
              : isLast
                ? 'end'
                : 'middle';

    return (
        <text
            dominantBaseline="text-before-edge"
            fill="var(--app-color-chart-text)"
            fontSize={12}
            textAnchor={textAnchor}
            x={x}
            y={Number(y) + 10}
        >
            {formatDate(payload.value)}
        </text>
    );
};

type ChartTooltipProps = TooltipContentProps<number, string> &
    Readonly<{
        dataLength: number;
        max: number;
        unit: string;
    }>;

const ChartTooltip = ({
    active,
    dataLength,
    label,
    max,
    payload,
    unit,
}: ChartTooltipProps) => {
    const item = payload[0];

    if (!active || !item || typeof item.value !== 'number') {
        return null;
    }

    const point = item.payload as ChartPoint | undefined;
    const index = point?.index;
    const transforms = [];

    if (index === 0) {
        transforms.push('translateX(50%)');
    } else if (index === dataLength - 1) {
        transforms.push('translateX(-50%)');
    }

    if (max - item.value < 3) {
        transforms.push('translateY(75%)');
    }

    return (
        <Card
            withBorder
            shadow="md"
            style={{ transform: transforms.join(' ') || undefined }}
        >
            {formatDate(label ?? '-')}: {item.value} {unit}
        </Card>
    );
};

const getTargetValue = (target?: number): number | undefined => {
    if (target && target > 0) {
        return target;
    }
};

export const LineChart = <DataItem extends ChartDataItem>({
    data,
    target,
    unit,
}: LineChartProps<DataItem>) => {
    const sourceData = data[0]?.data ?? [];
    const targetValue = getTargetValue(target);
    const values = sourceData.flatMap(({ y }) =>
        typeof y === 'number' && Number.isFinite(y) ? [y] : [],
    );
    const domainValues =
        targetValue === undefined ? values : [...values, targetValue];
    const max = domainValues.length ? Math.max(...domainValues) : 0;
    const min = domainValues.length ? Math.min(...domainValues) : 0;
    const yDomain = [min - 2, max + 2] as const;
    const chartData: ChartPoint[] = sourceData.map(({ x, y }, index) => ({
        date: x,
        index,
        value: y,
    }));

    return (
        <MantineLineChart
            connectNulls={false}
            curveType="natural"
            data={chartData}
            dataKey="date"
            gridAxis="xy"
            h="100%"
            lineChartProps={{
                margin: {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 10,
                },
            }}
            referenceLines={
                targetValue === undefined
                    ? undefined
                    : [
                          {
                              color: 'var(--app-color-chart-target)',
                              strokeWidth: 2,
                              y: targetValue,
                          },
                      ]
            }
            series={[{ color: BRAND_COLORS[6], name: 'value' }]}
            strokeDasharray={0}
            strokeWidth={2}
            tickLine="y"
            tooltipProps={{
                content: (props) => (
                    <ChartTooltip
                        {...props}
                        dataLength={chartData.length}
                        max={max}
                        unit={unit}
                    />
                ),
                position: {},
            }}
            vars={() => ({
                root: {
                    '--chart-text-color': 'var(--app-color-chart-text)',
                },
            })}
            withDots={false}
            xAxisProps={{
                height: 25,
                interval: 0,
                tick: DateTick,
                tickLine: false,
            }}
            yAxisProps={{
                domain: yDomain,
                interval: 0,
                tickLine: true,
                tickSize: 10,
                ticks: getTicks(...yDomain),
                width: 40,
            }}
        />
    );
};
