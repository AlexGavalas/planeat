import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { APP_NAME, APP_SHARE_IMAGE_ALT, APP_TAGLINE } from '~constants/brand';

export const alt = APP_SHARE_IMAGE_ALT;
export const contentType = 'image/png';
export const size = {
    height: 630,
    width: 1200,
};

const symbol = await readFile(
    join(process.cwd(), 'public/brand/habitthread-symbol.png'),
);
const symbolSource = `data:image/png;base64,${symbol.toString('base64')}`;

export default function OpenGraphImage() {
    return new ImageResponse(
        <div
            style={{
                alignItems: 'center',
                background:
                    'linear-gradient(135deg, #f7fbf7 0%, #e7f4ed 55%, #d7eee4 100%)',
                color: '#16352a',
                display: 'flex',
                height: '100%',
                justifyContent: 'space-between',
                padding: '72px 84px',
                width: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: 760,
                }}
            >
                <div
                    style={{
                        color: '#047d55',
                        display: 'flex',
                        fontSize: 72,
                        fontWeight: 700,
                        letterSpacing: '-3px',
                        lineHeight: 1,
                    }}
                >
                    {APP_NAME}
                </div>
                <div
                    style={{
                        display: 'flex',
                        fontSize: 44,
                        fontWeight: 500,
                        letterSpacing: '-1.5px',
                        lineHeight: 1.2,
                        marginTop: 32,
                    }}
                >
                    {APP_TAGLINE}
                </div>
                <div
                    style={{
                        color: '#527065',
                        display: 'flex',
                        fontSize: 25,
                        lineHeight: 1.4,
                        marginTop: 28,
                    }}
                >
                    Plan meals, track movement, and see your progress in one
                    place.
                </div>
            </div>
            {/* oxlint-disable-next-line next/no-img-element -- ImageResponse renders images directly. */}
            <img
                alt=""
                height={290}
                src={symbolSource}
                style={{ objectFit: 'contain' }}
                width={290}
            />
        </div>,
        size,
    );
}
