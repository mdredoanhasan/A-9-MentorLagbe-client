import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function api<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Request failed");
  }
  return response.json();
}

/** Runs an action, shows a toast, then reloads the list. */
export async function runAction(
  action: () => Promise<unknown>,
  successMessage: string,
  reload: () => void,
) {
  try {
    await action();
    toast.success(successMessage);
    reload();
  } catch (error) {
    toast.error((error as Error).message);
  }
}

export async function uploadToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    { method: "POST", body: formData }
  );
  const responseData = await response.json();
  if (!responseData.success) throw new Error("Image upload failed");
  return responseData.data.url as string;
}