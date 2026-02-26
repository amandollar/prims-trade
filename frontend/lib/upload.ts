const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function isUploadConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL);
}

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success || !json.data?.accessToken) return null;

    localStorage.setItem('accessToken', json.data.accessToken);
    if (json.data.refreshToken) {
      localStorage.setItem('refreshToken', json.data.refreshToken);
    }
    return json.data.accessToken;
  } catch {
    return null;
  }
}

export async function uploadImage(file: File): Promise<string> {
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image must be under ${MAX_SIZE_MB}MB`);
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Allowed types: JPEG, PNG, GIF, WebP');
  }

  let token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('You must be logged in to upload images');
  }

  const doUpload = (accessToken: string): Promise<Response> => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_URL}/api/v1/upload/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
  };

  let res = await doUpload(token);

  if (res.status === 401) {
    const newToken = await tryRefreshToken();
    if (!newToken) {
      throw new Error('Session expired. Please log in again.');
    }
    res = await doUpload(newToken);
  }

  const json = await res.json().catch(() => ({ success: false, message: 'Invalid response' }));

  if (!res.ok) {
    throw new Error(json.message ?? 'Upload failed');
  }
  if (!json.data?.url) {
    throw new Error('Upload failed');
  }
  return json.data.url;
}
