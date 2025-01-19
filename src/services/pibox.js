import { getFingerprint } from "./fingerprint";

async function get(path) {
  return makePiboxRequest(path, "GET");
}

async function post(path, data) {
  return makePiboxRequest(path, "POST", data);
}

async function del(path) {
  return makePiboxRequest(path, "DELETE");
}

export const pibox = {
  get,
  post,
  delete: del,
};

async function makePiboxRequest(path, method = "GET", data = null) {
  const result = await fetch(`/pibox${path}`, {
    method,
    headers: getDefaultHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });

  const contentLength = result.headers.get("Content-Length");
  const hasBody = contentLength && parseInt(contentLength, 10) > 0;

  const responseData = hasBody ? await result.json() : null;

  return {
    data: responseData,
  };
}

function getDefaultHeaders() {
  return {
    "X-Pibox-Fingerprint": getFingerprint(),
    "Content-Type": "application/json",
  };
}
