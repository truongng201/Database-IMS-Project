import { getSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

async function getNewAccesToken(refreshToken) {
  try {
    const response = await fetch('http://localhost:8080/v1/user/get-new-access-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) throw new Error('Failed to refresh token');
    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export async function callAPI(endpoint, session = null, options = {}) {
  // Use provided session (server-side) or fetch session (client-side)
  const currentSession = session || (await getSession());
  let accessToken = currentSession?.accessToken;
  const refreshToken = currentSession?.refreshToken;

  if (!accessToken) {
    if (typeof window !== 'undefined') {
      await signOut({ callbackUrl: '/login' });
    }
    throw new Error('No access token');
  }

  const response = await fetch(`http://localhost:8080/v1${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    const newAccessTokens = await getNewAccesToken(refreshToken);
    if (newAccessTokens) {
      return fetch(`http://localhost:8080/v1${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newAccessTokens.accessToken}`,
        },
      });
    } else {
      if (typeof window !== 'undefined') {
        // Redirect to login if refresh token is invalid
        await signOut({ callbackUrl: '/login' });
      }
      throw new Error('Failed to refresh token');
    }
  }
  return response;
}