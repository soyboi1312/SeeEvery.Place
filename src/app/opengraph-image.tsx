import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SeeEvery.Place - Track your world travels and bucket list.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // Brand colors
  const blue = '#2563EB';   // blue-600
  const purple = '#9333EA'; // purple-600

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${blue} 0%, ${purple} 100%)`,
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative background circle for depth */}
        <div
          style={{
            position: 'absolute',
            width: '1000px',
            height: '1000px',
            borderRadius: '50%',
            background: 'white',
            opacity: 0.05,
            top: '-500px',
          }}
        />

        {/* Logo + Title Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}
        >
          {/* Logo SVG */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: 24 }}
          >
            {/* Pin Shape */}
            <path
              d="M256 32C158.8 32 80 110.8 80 208c0 40.3 13.7 78.6 38.3 112L256 480l137.7-160C418.3 286.6 432 248.3 432 208 432 110.8 353.2 32 256 32z"
              fill="white"
            />
            {/* Eye/Iris */}
            <circle cx="256" cy="208" r="96" fill={blue} />
            {/* Inner Detail */}
            <path d="M256 144v128M192 208h128" stroke="white" strokeWidth="8" strokeOpacity="0.4" strokeLinecap="round" />
            {/* Pupil Background */}
            <circle cx="256" cy="208" r="56" fill="white" />
            {/* Checkmark */}
            <path
              d="M236 228l-20-20-12 12 32 32 64-64-12-12-52 52z"
              fill={blue}
              transform="scale(1.2) translate(-39, -41)"
            />
          </svg>

          {/* Title */}
          <div
            style={{
              fontSize: 90,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            <span>SeeEvery</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', margin: '0 2px' }}>.</span>
            <span>Place</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            opacity: 0.9,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Free Travel Tracker
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
