import { google } from 'googleapis';

/**
 * Creates a short-lived Google access token from a service-account JSON key.
 * The private key must live only in the hosting provider's encrypted env vars.
 */
export async function getSearchConsoleAccessToken(): Promise<string> {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Google Search Console service-account credentials are not configured.');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const token = await auth.getAccessToken();
  if (!token.token) throw new Error('Unable to obtain a Google access token.');
  return token.token;
}
