import * as SecureStore from 'expo-secure-store';

const API_URL ='https://demobox.aheadbanker.com/fineract-provider/api/v1';

const AUTH_KEY = 'auth_key';
const USERNAME_KEY = 'username';
const USER_ID_KEY = 'user_id';

export interface AuthenticationResponse {
  authenticated: boolean;
  isTwoFactorAuthenticationRequired?: boolean;
  base64EncodedAuthenticationKey?: string;
  username?: string;
  userId?: number;
}

export interface AuthenticationErrorResponse {
  defaultUserMessage?: string;
  developerMessage?: string;
  errors?: Array<{
    developerMessage?: string;
    defaultUserMessage?: string;
    userMessageGlobalisationCode?: string;
  }>;
}

export interface AuthData {
  authKey: string | null;
  username: string | null;
  userId: string | null;
}

export async function login(
  username: string,
  password: string
): Promise<AuthenticationResponse> {
  const response = await fetch(`${API_URL}/authentication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Fineract-Platform-TenantId': 'default',
    },
    body: JSON.stringify({ username, password }),
  });

  const data: AuthenticationResponse | AuthenticationErrorResponse =
    await response.json();

  if (!response.ok) {
    const error = data as AuthenticationErrorResponse;

    throw new Error(
      error.defaultUserMessage ||
        error.developerMessage ||
        'Unable to authenticate.'
    );
  }

  const authData = data as AuthenticationResponse;

  if (!authData.authenticated) {
    throw new Error('Authentication failed.');
  }

  if (!authData.isTwoFactorAuthenticationRequired) {
    await saveAuthData(authData);
  }

  return authData;
}

export async function saveAuthData(
  data: AuthenticationResponse
): Promise<void> {
  const operations: Promise<void>[] = [];

  if (data.base64EncodedAuthenticationKey) {
    operations.push(
      SecureStore.setItemAsync(
        AUTH_KEY,
        data.base64EncodedAuthenticationKey
      )
    );
  }

  if (data.username) {
    operations.push(
      SecureStore.setItemAsync(USERNAME_KEY, data.username)
    );
  }

  if (data.userId !== undefined) {
    operations.push(
      SecureStore.setItemAsync(USER_ID_KEY, String(data.userId))
    );
  }

  await Promise.all(operations);
}

export async function getAuthData(): Promise<AuthData> {
  const [authKey, username, userId] = await Promise.all([
    SecureStore.getItemAsync(AUTH_KEY),
    SecureStore.getItemAsync(USERNAME_KEY),
    SecureStore.getItemAsync(USER_ID_KEY),
  ]);

  return { authKey, username, userId };
}

export async function logout(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(AUTH_KEY),
    SecureStore.deleteItemAsync(USERNAME_KEY),
    SecureStore.deleteItemAsync(USER_ID_KEY),
  ]);
}

export async function forgetPassword(
  username: string
): Promise<unknown> {
  const response = await fetch(
    `${API_URL}/password/forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Fineract-Platform-TenantId': 'default',
      },
      body: JSON.stringify({ username }),
    }
  );

  const data: AuthenticationErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.defaultUserMessage ||
        data.developerMessage ||
        'Unable to reset password.'
    );
  }

  return data;
}