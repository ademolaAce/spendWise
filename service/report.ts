import * as SecureStore from 'expo-secure-store';

const API = 'https://demobox.aheadbanker.com/fineract-provider/api/v1';

export async function getallReport() {
  const authKey = await SecureStore.getItemAsync('auth_key');

  if (!authKey) {
    throw new Error('Authentication key not found. Please sign in again.');
  }

  const response = await fetch(`${API}/reports`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${authKey}`,
      'Content-Type': 'application/json',
      'Fineract-Platform-TenantId': 'default',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to fetch reports (${response.status}): ${errorText}`
    );
  }

  console.log('Response from getallReport:', response);

  return response.json();
}

export async function getallReportById(id: string | number) {
  const authKey = await SecureStore.getItemAsync('auth_key');

  const result = await fetch(`${API}/reports/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${authKey}`,
      'Content-Type': 'application/json',
      'Fineract-Platform-TenantId': 'default',
    },
  });

  if (!result.ok) {
    const errorText = await result.text();

    throw new Error(
      `Failed to fetch reports (${result.status}): ${errorText}`
    );
  }

  console.log('Response from getallReport:', result);

  return result.json();
}