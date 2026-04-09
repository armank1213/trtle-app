const DEFAULT_BACKEND_URL = 'http://localhost:8000';

const getBackendBaseUrl = (): string => {
  const configuredUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  return configuredUrl?.trim() || DEFAULT_BACKEND_URL;
};

const postControlAction = async (path: string): Promise<void> => {
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with status ${response.status}`);
  }
};

export const sprayPesticide = async (): Promise<void> => {
  await postControlAction('/api/control/spray');
};

export const waterPlant = async (): Promise<void> => {
  await postControlAction('/api/control/water');
};
