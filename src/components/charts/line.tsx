import { LineChart as MantineLineChart } from '@mantine/charts';

import { BRAND_COLORS } from '~theme';

import {
    type ChartPoint,
    ChartTooltip,
    DateTick,
    getTargetValue,
    getTicks,
} from './line-parts';

type ChartDataItem = {
    x: string;
    y: number | null;
};

type LineChartProps = Readonly<{
    target?: number;
    unit: string;
    data: {
        id: string;
        data: ChartDataItem[];
    }[];
}>;

export const LineChart = ({ data, target, unit }: LineChartProps) => {
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
