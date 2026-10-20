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


// export async function submitReport(reportId: string | number, parameters: Record<string, any>) {
//   const authKey = await SecureStore.getItemAsync('auth_key');

//   const response = await fetch(`${API}/runreports/${encodeURIComponent(reportId)}`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Basic ${authKey}`,
//       'Content-Type': 'application/json',
//       'Fineract-Platform-TenantId': 'default',
//     },
//     body: JSON.stringify(parameters),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();

//     throw new Error(
//       `Failed to submit report (${response.status}): ${errorText}`
//     );
//   }

//   return response.json();
// } 

export async function runReport(
  reportName: string,
  parameters: Record<string, string>
) {
  const authKey = await SecureStore.getItemAsync('auth_key');

  if (!authKey) {
    throw new Error('Authentication key not found. Please sign in again.');
  }

  const queryParams = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      const parameterName = key.startsWith('R_')
        ? key
        : `R_${key}`;

      queryParams.set(parameterName, value);
    }
  });

  // Add standard parameters only when branch exists
  if (Object.prototype.hasOwnProperty.call(parameters, 'branch')) {
    queryParams.append('output-type', 'HTML');
    queryParams.append('tenantIdentifier', 'default');
    queryParams.append('locale', 'en');
    queryParams.append('dateFormat', 'dd MMMM yyyy');
  }

  const queryString = queryParams.toString();

  const url = `${API}/runreports/${encodeURIComponent(reportName)}` + (queryString ? `?${queryString}` : '');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${authKey}`,
      'Fineract-Platform-TenantId': 'default',
      Accept: 'text/html',
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to run report (${response.status}): ${responseText}`
    );
  }

  return responseText;
}