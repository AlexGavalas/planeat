import { Card, useMantineTheme } from '@mantine/core';
import { type CustomLayerProps, ResponsiveLine } from '@nivo/line';
import { maxBy, minBy } from 'lodash';
import { type SVGAttributes } from 'react';
import { useMemo } from 'react';

type NumFn = (prop: number) => number;
type TextAnchor = NonNullable<
    SVGAttributes<SVGTextElement>['style']
>['textAnchor'];

const targetLayer = (targetWeight: number) =>
    function CustomLayer(props: CustomLayerProps) {
        const lineHeight = 2;

        return (
            <g>
                <rect
                    // Required assertion
                    // Issue: https://github.com/plouc/nivo/issues/1947
                    y={(props.yScale as NumFn)(targetWeight) - lineHeight / 2}
                    width={props.innerWidth}
                    height={lineHeight}
                    fill="red"
                />
            </g>
        );
    };

interface LineChartProps<DataItem> {
    target?: number;
    unit: string;
    data: {
        id: string;
        data: DataItem[];
    }[];
}

const LineChart = <DataItem extends { x: string; y: number | null }>({
    data,
    target,
    unit,
}: LineChartProps<DataItem>) => {
    const colorScheme = useMantineTheme();

    const max = useMemo(() => maxBy(data[0].data, 'y')?.y || 0, [data]);
    const min = useMemo(() => minBy(data[0].data, 'y')?.y || 0, [data]);

    return (
        <ResponsiveLine
            data={data}
            colors={colorScheme.colors.brand}
            lineWidth={2}
            margin={{
                top: 10,
                bottom: 25,
                right: 0,
                left: 40,
            }}
            xScale={{
                type: 'point',
            }}
            yScale={{
                type: 'linear',
                min: Math.min(min, target || Infinity) - 2,
                max: Math.max(max, target || -Infinity) + 2,
            }}
            curve="natural"
            theme={{
                axis: {
                    ticks: {
                        text: {
                            fontSize: 12,
                        },
                    },
                },
            }}
            axisBottom={{
                renderTick: (tick) => {
                    const isFirst = tick.tickIndex === 0;
                    const isLast = tick.tickIndex === data[0].data.length - 1;

                    let textAnchor: TextAnchor = isFirst
                        ? 'start'
                        : isLast
                        ? 'end'
                        : 'middle';

                    if (isFirst && isLast) {
                        textAnchor = 'middle';
                    }

                    return (
                        <g>
                            <text
                                dominant-baseline="text-before-edge"
                                text-anchor={textAnchor}
                                transform={`translate(${tick.x}, ${tick.y})`}
                                y={tick.textY}
                                style={{
                                    textAnchor,
                                    fontSize: 12,
                                    fill: 'rgb(51, 51, 51)',
                                }}
                            >
                                {tick.value}
                            </text>
                        </g>
                    );
                },
                tickSize: 0,
                tickPadding: 10,
            }}
            axisLeft={{
                tickSize: 10,
            }}
            pointSize={10}
            useMesh
            tooltip={({ point }) => {
                const isFirst = point.index === 0;
                const isLast = point.index === data[0].data.length - 1;
                const isTop = max - +point.data.y < 3;

                let transformString = '';

                if (isFirst) transformString += 'translateX(50%)';
                else if (isLast) transformString += 'translateX(-50%)';

                if (isTop) transformString += 'translateY(75%)';

                return (
                    <Card
                        shadow="md"
                        withBorder
                        style={{
                            transform: transformString,
                        }}
                    >
                        {point.data.xFormatted}: {point.data.yFormatted} {unit}
                    </Card>
                );
            }}
            {...(target && {
                layers: [
                    'grid',
                    'markers',
                    'axes',
                    'areas',
                    'lines',
                    targetLayer(target),
                    'points',
                    'crosshair',
                    'mesh',
                ],
            })}
        />
    );
};

export default LineChart;
