import { useMemo } from 'react';
import { Card } from '@mantine/core';
import { ResponsiveLine, CustomLayerProps } from '@nivo/line';
import { addDays, format } from 'date-fns';
import { maxBy, minBy } from 'lodash';

const NOW = new Date();

const data = [
    {
        id: 'fat-percent',
        color: 'blue',
        data: [
            {
                x: format(NOW, 'dd/MM/yy'),
                y: 95,
            },
            {
                x: format(addDays(NOW, 10), 'dd/MM/yy'),
                y: 93.2,
            },
            {
                x: format(addDays(NOW, 24), 'dd/MM/yy'),
                y: 89,
            },
            {
                x: format(addDays(NOW, 44), 'dd/MM/yy'),
                y: 87,
            },
        ],
    },
];

// eslint-disable-next-line react/display-name
const refsLayer = (targetWeight: number) => (props: CustomLayerProps) => {
    const lineHeight = 2;

    return (
        <g>
            <rect
                // @ts-ignore
                y={props.yScale(targetWeight) - lineHeight / 2}
                width={props.innerWidth}
                height={lineHeight}
                fill="red"
            />
        </g>
    );
};

const LineChart = () => {
    const targetWeight = 90;
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
                min: Math.min(min, targetWeight) - 2,
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
                        {point.data.xFormatted}: {point.data.yFormatted} kg
                    </Card>
                );
            }}
            layers={[
                'grid',
                'markers',
                'axes',
                'areas',
                'lines',
                refsLayer(targetWeight),
                'points',
                'crosshair',
                'mesh',
            ]}
        />
    );
};

export default LineChart;
