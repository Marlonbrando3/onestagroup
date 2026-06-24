import crypto from "crypto";
import metainmoHandler from "../../pages/api/metainmoToSupabase";
import { upsertImportRun } from "../../lib/onesariImportRuns";

function createApiResponse(onJson: (payload: any, statusCode: number) => void) {
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
      onJson(payload, response.statusCode);
      console.log(JSON.stringify(payload));
      return response;
    },
  };

  return response;
}

export async function handler(event: any) {
  const runId =
    String(event?.queryStringParameters?.runId || "").trim() ||
    crypto.randomUUID();
  let finalPayload: any = null;
  let finalStatusCode = 200;

  await upsertImportRun(runId, "metainmo", {
    status: "running",
    message: "Metainmo: import działa w tle...",
    progressPercent: 5,
  });

  const req: any = {
    method: "POST",
    headers: {},
  };

  try {
    await metainmoHandler(
      req,
      createApiResponse((payload, statusCode) => {
        finalPayload = payload;
        finalStatusCode = statusCode;
      }),
    );

    if (finalStatusCode >= 400 || finalPayload?.error) {
      const errorMessage =
        finalPayload?.error || finalPayload?.details || "Import Metainmo nie powiódł się";
      await upsertImportRun(runId, "metainmo", {
        status: "failed",
        message: `Metainmo: błąd - ${errorMessage}`,
        progressPercent: 100,
        result: finalPayload,
        error: String(errorMessage),
        completedAt: new Date().toISOString(),
      });
    } else {
      await upsertImportRun(runId, "metainmo", {
        status: "completed",
        message: "Metainmo: import zakończony.",
        progressPercent: 100,
        processed: finalPayload?.total_saved ?? null,
        total: finalPayload?.total_after_dedupe ?? finalPayload?.total_xml ?? null,
        result: finalPayload,
        completedAt: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    const errorMessage = error?.message || "Import Metainmo nie powiódł się";
    await upsertImportRun(runId, "metainmo", {
      status: "failed",
      message: `Metainmo: błąd - ${errorMessage}`,
      progressPercent: 100,
      error: errorMessage,
      completedAt: new Date().toISOString(),
    });
    throw error;
  }

  return {
    statusCode: 202,
    body: JSON.stringify({ runId }),
  };
}
