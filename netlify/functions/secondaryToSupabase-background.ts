import secondaryHandler from "../../pages/api/secondaryToSupabase";

function createApiResponse() {
  const response: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    writeHead(statusCode: number, headers?: Record<string, string>) {
      response.statusCode = statusCode;
      response.headers = { ...response.headers, ...(headers || {}) };
      return response;
    },
    write(chunk: unknown) {
      console.log(String(chunk));
      return true;
    },
    end() {
      return response;
    },
    status(statusCode: number) {
      response.statusCode = statusCode;
      return response;
    },
    json(payload: unknown) {
      console.log(JSON.stringify(payload));
      return response;
    },
  };

  return response;
}

export async function handler() {
  const req: any = {
    method: "POST",
    headers: {},
  };

  await secondaryHandler(req, createApiResponse());

  return {
    statusCode: 202,
    body: "Secondary import queued",
  };
}
