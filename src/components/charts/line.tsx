import { Card } from '@mantine/core';
import { type CustomLayerProps } from '@nivo/line';
import { format, parse } from 'date-fns';
import { maxBy, minBy } from 'lodash';
import dynamic from 'next/dynamic';
import { type SVGAttributes, useMemo } from 'react';

import { BRAND_COLORS } from '~constants/colors';

const ResponsiveLine = dynamic(
    () => import('@nivo/line').then((mod) => ({ default: mod.ResponsiveLine })),
    {
        ssr: false,
    },
);

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
                    fill="red"
                    height={lineHeight}
                    width={props.innerWidth}
                    y={(props.yScale as NumFn)(targetWeight) - lineHeight / 2}
                />
            </g>
        );
    };

type LineChartProps<DataItem> = {
    target?: number;
    unit: string;
    data: {
        id: string;
        data: DataItem[];
    }[];
};

export const LineChart = <DataItem extends { x: string; y: number | null }>({
    data,
    target,
    unit,
}: LineChartProps<DataItem>) => {
    const max = useMemo(() => maxBy(data[0]?.data, 'y')?.y ?? 0, [data]);
    const min = useMemo(() => minBy(data[0]?.data, 'y')?.y ?? 0, [data]);

    return (
        <ResponsiveLine
            useMesh
            axisBottom={{
                renderTick: (tick) => {
                    if (!data[0]?.data?.length) {
                        return <g />;
                    }

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

                    const value =
                        typeof tick.value === 'string' ? tick.value : '-';

                    const date = parse(value, 'yyyy-MM-dd', new Date());

                    const formattedDate = format(date, 'dd/MM/yy');

                    return (
                        <g>
                            <text
                                dominantBaseline="text-before-edge"
                                style={{
                                    fill: 'rgb(51, 51, 51)',
                                    fontSize: 12,
                                    textAnchor,
                                }}
                                textAnchor={textAnchor}
                                transform={`translate(${tick.x}, ${tick.y})`}
                                y={tick.textY}
                            >
                                {formattedDate}
                            </text>
                        </g>
                    );
                },
                tickPadding: 10,
                tickSize: 0,
            }}
            axisLeft={{
                tickSize: 10,
            }}
            colors={BRAND_COLORS}
            curve="natural"
            data={data}
            lineWidth={2}
            margin={{
                bottom: 25,
                left: 40,
                right: 0,
                top: 10,
            }}
            pointSize={0}
            theme={{
                axis: {
                    ticks: {
                        text: {
                            fontSize: 12,
                        },
                    },
                },
            }}
            tooltip={({ point }) => {
                if (!data[0]?.data.length) {
                    return <div />;
                }

                const isFirst = point.index === 0;
                const isLast = point.index === data[0].data.length - 1;
                const isTop = max - +point.data.y < 3;

                let transformString = '';

                if (isFirst) transformString += 'translateX(50%)';
                else if (isLast) transformString += 'translateX(-50%)';

                if (isTop) transformString += 'translateY(75%)';

                return (
                    <Card
                        withBorder
                        shadow="md"
                        style={{
                            transform: transformString,
                        }}
                    >
                        {point.data.xFormatted}: {point.data.yFormatted} {unit}
                    </Card>
                );
            }}
            xFormat={(value) => {
                const date = parse(value.toString(), 'yyyy-MM-dd', new Date());

                return format(date, 'dd/MM/yy');
            }}
            yScale={{
                max: Math.max(max, target ?? -Infinity) + 2,
                min: Math.min(min, target ?? Infinity) - 2,
                type: 'linear',
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
