import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

// Image metadata
export const alt = 'User Travel Profile | SeeEvery.Place';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Initialize Supabase client directly for OG image generation
// We don't use the server helper here to avoid cookie/header complexity
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProfileData {
  full_name?: string;
  level?: number;
}

interface Props {
  params: Promise<{ username: string }>;
}

export default async function Image({ params }: Props) {
  const { username } = await params;

  // Fetch the public profile data
  const { data } = await supabase
    .rpc('get_public_profile', { profile_username: username })
    .single();

  const profile = data as ProfileData | null;
  const displayName = profile?.full_name || username;
  const level = profile?.level || 1;

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
        {/* Decorative background circle */}
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

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* Label */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 20,
              opacity: 0.8,
              background: 'rgba(255,255,255,0.1)',
              padding: '8px 24px',
              borderRadius: '100px',
            }}
          >
            Travel Profile
          </div>

          {/* User Name */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              textAlign: 'center',
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              marginBottom: 10,
              maxWidth: '1000px',
              wordWrap: 'break-word',
            }}
          >
            {displayName}
          </div>

          {/* Level / Stats Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 42,
              fontWeight: 700,
              marginTop: 20,
            }}
          >
            <span style={{ marginRight: 15 }}>🌟</span>
            <span>Level {level} Explorer</span>
          </div>
        </div>

        {/* Footer Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            display: 'flex',
            alignItems: 'center',
            opacity: 0.9,
          }}
        >
           <svg
            width="40"
            height="40"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: 12 }}
          >
            <path
              d="M256 32C158.8 32 80 110.8 80 208c0 40.3 13.7 78.6 38.3 112L256 480l137.7-160C418.3 286.6 432 248.3 432 208 432 110.8 353.2 32 256 32z"
              fill="white"
            />
            <circle cx="256" cy="208" r="96" fill={blue} />
            <circle cx="256" cy="208" r="56" fill="white" />
          </svg>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            SeeEvery.Place
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
