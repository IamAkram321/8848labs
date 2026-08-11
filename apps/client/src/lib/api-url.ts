export const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Uploads files to /api/uploads with a hard timeout. Without this, a stalled
 * connection (slow network, a proxy silently dropping a long-running
 * request, etc.) leaves the UI stuck on "Uploading..." forever with no way
 * to recover, since a plain fetch() never resolves or rejects on its own if
 * the server never responds and the connection doesn't cleanly close.
 *
 * Large 3D model files can legitimately take a while on a slow connection —
 * this timeout is intentionally generous (3 minutes) so it only fires for
 * genuinely stuck uploads, not merely slow ones.
 */
export async function uploadFilesWithTimeout(
  files: File[],
  { timeoutMs = 3 * 60 * 1000 }: { timeoutMs?: number } = {}
): Promise<{ ok: boolean; data: any }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const body = new FormData();
    files.forEach((file) => body.append('files', file));

    const res = await fetch(`${API_URL}/api/uploads`, {
      method: 'POST',
      credentials: 'include',
      body,
      signal: controller.signal,
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, data: { error: 'Upload timed out. Please try a smaller file or check your connection.' } };
    }
    return { ok: false, data: { error: 'Upload failed. Please try again.' } };
  } finally {
    clearTimeout(timeout);
  }
}