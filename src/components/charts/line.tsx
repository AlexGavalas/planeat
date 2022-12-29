import { Card } from '@mantine/core';
import { type CustomLayerProps, ResponsiveLine } from '@nivo/line';
import { maxBy, minBy } from 'lodash';
import { useMemo } from 'react';

type NumFn = (tw: number) => number;

const yScaleIsCallable = (yScale: unknown): yScale is NumFn => {
    return true;
};

const targetLayer = (targetWeight: number) =>
    function CustomLayer(props: CustomLayerProps) {
        const lineHeight = 2;

        return (
            yScaleIsCallable(props.yScale) && (
                <g>
                    <rect
                        y={props.yScale(targetWeight) - lineHeight / 2}
                        width={props.innerWidth}
                        height={lineHeight}
                        fill="red"
                    />
                </g>
            )
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
    const max = useMemo(() => maxBy(data[0].data, 'y')?.y || 0, [data]);
    const min = useMemo(() => minBy(data[0].data, 'y')?.y || 0, [data]);

    return (
        <ResponsiveLine
            data={data}
            colors={['#32ad4c']}
            lineWidth={2}
            margin={{
                top: 20,
                bottom: 25,
                right: 40,
                left: 40,
            }}
            xScale={{
                type: 'point',
            }}
            yScale={{
                type: 'linear',
                min: Math.min(min, target || Infinity) - 2,
                max: max + 2,
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
                tickSize: 5,
            }}
            axisLeft={{
                tickSize: 5,
            }}
            pointSize={10}
            pointLabelYOffset={2}
            useMesh={true}
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
