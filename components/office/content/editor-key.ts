// T-50: shared by server and client screens, so this file has no "use client".
// The key a screen gives an open editor. It changes when the saved record changes, so the editor
// starts again from the saved data after router.refresh().
export function editorKey(id: string | number, record: unknown) {
  const text = JSON.stringify(record) ?? "";
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) hash = ((hash << 5) + hash + text.charCodeAt(index)) | 0;
  return `${id}:${(hash >>> 0).toString(36)}`;
}
