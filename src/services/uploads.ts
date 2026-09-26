import api from "@/services/api";

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");
export const BACKEND_SERVER_URL = rawApiUrl.replace(/\/api\/v1$/, "");

export interface UploadResponse {
  id: number;
  url: string;
  filename: string;
}

export async function uploadImage(
  file: File,
  purpose: "avatar" | "service" = "avatar",
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", purpose);

  const { data } = await api.post<UploadResponse>("/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function deleteUnattachedUpload(uploadId: number): Promise<void> {
  await api.delete(`/uploads/${uploadId}`);
}

export function getFullImageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${BACKEND_SERVER_URL}${cleanPath}`;
}
