# Supabase Email Templates for See Every Place

These email templates should be configured in your Supabase Dashboard under:
**Authentication > Email Templates**

## Brand Colors
- Primary Blue: `#2563EB`
- Primary Purple: `#9333EA`
- Gradient: Blue to Purple
- Text Dark: `#1f2937`
- Text Light: `#6b7280`
- Background: `#f9fafb`

---

## 1. Confirm Signup

**Subject:** `Confirm your See Every Place account`

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); padding: 32px 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <!-- Logo -->
              <div style="margin-bottom: 16px;">
                <svg width="64" height="64" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                  <path d="M256 32C158.8 32 80 110.8 80 208c0 40.3 13.7 78.6 38.3 112L256 480l137.7-160C418.3 286.6 432 248.3 432 208 432 110.8 353.2 32 256 32z" fill="white" fill-opacity="0.9"/>
                  <circle cx="256" cy="208" r="56" fill="#2563EB"/>
                  <path d="M236 228l-20-20-12 12 32 32 64-64-12-12-52 52z" fill="white" transform="scale(1.2) translate(-39, -41)"/>
                </svg>
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">See Every Place</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0 0;">Free Travel Tracker</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">Confirm Your Email</h2>
              <p style="color: #6b7280; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; text-align: center;">
                Welcome to See Every Place! Click the button below to confirm your email address and start tracking your travels.
              </p>
              <!-- Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.4);">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #9ca3af; font-size: 14px; line-height: 20px; margin: 24px 0 0 0; text-align: center;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                &copy; {{ .SiteURL }} &bull; <a href="{{ .SiteURL }}/privacy" style="color: #2563EB; text-decoration: none;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Magic Link (Passwordless Sign In)

**Subject:** `Your See Every Place sign-in link`

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In Link</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); padding: 32px 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <!-- Logo -->
              <div style="margin-bottom: 16px;">
                <svg width="64" height="64" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                  <path d="M256 32C158.8 32 80 110.8 80 208c0 40.3 13.7 78.6 38.3 112L256 480l137.7-160C418.3 286.6 432 248.3 432 208 432 110.8 353.2 32 256 32z" fill="white" fill-opacity="0.9"/>
                  <circle cx="256" cy="208" r="56" fill="#2563EB"/>
                  <path d="M236 228l-20-20-12 12 32 32 64-64-12-12-52 52z" fill="white" transform="scale(1.2) translate(-39, -41)"/>
                </svg>
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">See Every Place</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0 0;">Free Travel Tracker</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">Sign In to Your Account</h2>
              <p style="color: #6b7280; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; text-align: center;">
                Click the magic link below to securely sign in to your See Every Place account. No password needed!
              </p>
              <!-- Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.4);">
                      Sign In to See Every Place
                    </a>
                  </td>
                </tr>
              </table>
              <!-- Security notice -->
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-top: 24px;">
                <p style="color: #92400e; font-size: 14px; line-height: 20px; margin: 0; text-align: center;">
                  <strong>Security tip:</strong> This link expires in 1 hour and can only be used once. Never share this link with anyone.
                </p>
              </div>
              <p style="color: #9ca3af; font-size: 14px; line-height: 20px; margin: 24px 0 0 0; text-align: center;">
                If you didn't request this sign-in link, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                &copy; {{ .SiteURL }} &bull; <a href="{{ .SiteURL }}/privacy" style="color: #2563EB; text-decoration: none;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Change Email Address

**Subject:** `Confirm your new email address`

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Email Change</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); padding: 32px 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <!-- Logo -->
              <div style="margin-bottom: 16px;">
                <svg width="64" height="64" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                  <path d="M256 32C158.8 32 80 110.8 80 208c0 40.3 13.7 78.6 38.3 112L256 480l137.7-160C418.3 286.6 432 248.3 432 208 432 110.8 353.2 32 256 32z" fill="white" fill-opacity="0.9"/>
                  <circle cx="256" cy="208" r="56" fill="#2563EB"/>
                  <path d="M236 228l-20-20-12 12 32 32 64-64-12-12-52 52z" fill="white" transform="scale(1.2) translate(-39, -41)"/>
                </svg>
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">See Every Place</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0 0;">Free Travel Tracker</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">Confirm Email Change</h2>
              <p style="color: #6b7280; font-size: 16px; line-height: 24px; margin: 0 0 8px 0; text-align: center;">
                You requested to change your email address to:
              </p>
              <p style="color: #1f2937; font-size: 16px; font-weight: 600; line-height: 24px; margin: 0 0 24px 0; text-align: center;">
                {{ .Email }}
              </p>
              <p style="color: #6b7280; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; text-align: center;">
                Click the button below to confirm this change.
              </p>
              <!-- Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.4);">
                      Confirm New Email
                    </a>
                  </td>
                </tr>
              </table>
              <!-- Security notice -->
              <div style="background-color: #fef2f2; border-radius: 8px; padding: 16px; margin-top: 24px;">
                <p style="color: #991b1b; font-size: 14px; line-height: 20px; margin: 0; text-align: center;">
                  <strong>Didn't request this?</strong> If you didn't request an email change, please ignore this email. Your account email will remain unchanged.
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                &copy; {{ .SiteURL }} &bull; <a href="{{ .SiteURL }}/privacy" style="color: #2563EB; text-decoration: none;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. Reset Password

**Subject:** `Reset your See Every Place password`

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); padding: 32px 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <!-- Logo -->
              <div style="margin-bottom: 16px;">
                <svg width="64" height="64" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                  <path d="M256 32C158.8 32 80 110.8 80 208c0 40.3 13.7 78.6 38.3 112L256 480l137.7-160C418.3 286.6 432 248.3 432 208 432 110.8 353.2 32 256 32z" fill="white" fill-opacity="0.9"/>
                  <circle cx="256" cy="208" r="56" fill="#2563EB"/>
                  <path d="M236 228l-20-20-12 12 32 32 64-64-12-12-52 52z" fill="white" transform="scale(1.2) translate(-39, -41)"/>
                </svg>
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">See Every Place</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0 0;">Free Travel Tracker</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">Reset Your Password</h2>
              <p style="color: #6b7280; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; text-align: center;">
                We received a request to reset your password. Click the button below to create a new password for your account.
              </p>
              <!-- Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.4);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <!-- Security notice -->
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-top: 24px;">
                <p style="color: #92400e; font-size: 14px; line-height: 20px; margin: 0; text-align: center;">
                  <strong>Security tip:</strong> This link expires in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                &copy; {{ .SiteURL }} &bull; <a href="{{ .SiteURL }}/privacy" style="color: #2563EB; text-decoration: none;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 5. Invite User

**Subject:** `You've been invited to See Every Place`

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); padding: 32px 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <!-- Logo -->
              <div style="margin-bottom: 16px;">
                <svg width="64" height="64" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                  <path d="M256 32C158.8 32 80 110.8 80 208c0 40.3 13.7 78.6 38.3 112L256 480l137.7-160C418.3 286.6 432 248.3 432 208 432 110.8 353.2 32 256 32z" fill="white" fill-opacity="0.9"/>
                  <circle cx="256" cy="208" r="56" fill="#2563EB"/>
                  <path d="M236 228l-20-20-12 12 32 32 64-64-12-12-52 52z" fill="white" transform="scale(1.2) translate(-39, -41)"/>
                </svg>
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">See Every Place</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0 0;">Free Travel Tracker</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">You're Invited!</h2>
              <p style="color: #6b7280; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; text-align: center;">
                You've been invited to join See Every Place, a free travel tracker to map your adventures and bucket list across 19 categories including countries, national parks, stadiums, and more.
              </p>
              <!-- Feature highlights -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #22c55e; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px;">&#10003;</span>
                        </td>
                        <td style="color: #4b5563; font-size: 14px;">Track visits to 195 countries and all US states</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #f59e0b; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px;">&#9733;</span>
                        </td>
                        <td style="color: #4b5563; font-size: 14px;">Create bucket lists for places you want to visit</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" style="vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px;">&#9776;</span>
                        </td>
                        <td style="color: #4b5563; font-size: 14px;">Generate shareable travel maps for social media</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #9333EA 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.4);">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #9ca3af; font-size: 14px; line-height: 20px; margin: 24px 0 0 0; text-align: center;">
                This invitation expires in 7 days.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                &copy; {{ .SiteURL }} &bull; <a href="{{ .SiteURL }}/privacy" style="color: #2563EB; text-decoration: none;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Configuration Instructions

### How to Apply These Templates

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** > **Email Templates**
4. For each template type:
   - Click on the template tab (Confirm signup, Magic Link, etc.)
   - Replace the **Subject** field
   - Replace the **Body** field with the HTML content (everything inside the ```html block)
   - Click **Save**

### Required Supabase Settings

Make sure these settings are configured in **Authentication** > **Settings**:

- **Site URL**: `https://seeevery.place`
- **Redirect URLs**:
  - `https://seeevery.place/auth/callback`
  - `http://localhost:3000/auth/callback` (for development)

### SMTP Configuration (Optional but Recommended)

For production, configure a custom SMTP provider in **Project Settings** > **Authentication**:

- **Sender email**: `noreply@seeevery.place`
- **Sender name**: `See Every Place`

Popular SMTP providers:
- [Resend](https://resend.com) - Developer-friendly, great free tier
- [Postmark](https://postmarkapp.com) - High deliverability
- [SendGrid](https://sendgrid.com) - Widely used

---

## Template Variables Reference

| Variable | Description |
|----------|-------------|
| `{{ .ConfirmationURL }}` | Full URL for the action (confirm, sign in, reset) |
| `{{ .Token }}` | The OTP/confirmation token |
| `{{ .TokenHash }}` | Hashed version of the token |
| `{{ .SiteURL }}` | Your configured site URL |
| `{{ .Email }}` | The user's email address |
| `{{ .RedirectTo }}` | Custom redirect URL if specified |

---

## Testing

After applying templates:

1. Test **Magic Link**: Sign out and sign back in with email
2. Test **Confirm Signup**: Create a new account with a fresh email
3. Test **Password Reset**: Use the "Forgot Password" flow (if implemented)
4. Check spam folders if emails don't arrive
5. Verify all links work and redirect correctly
