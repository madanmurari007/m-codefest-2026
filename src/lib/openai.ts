import OpenAI from "openai";

/**
 * Returns a configured OpenAI client.
 *
 * Supports both vanilla OpenAI and OpenAI-compatible proxies (LiteLLM, Azure
 * OpenAI gateway, vLLM, Ollama, etc.) via OPENAI_BASE_URL.
 *
 * Required env: OPENAI_API_KEY
 * Optional env: OPENAI_BASE_URL  (e.g. https://litellm.example.com/v1)
 *
 * Returns null when no API key is configured so callers can use their
 * built-in fallback path.
 */
export function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseURL = process.env.OPENAI_BASE_URL;
  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });
}

/** Model name to use for chat completions. Override with OPENAI_MODEL. */
export function getModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o";
}

/** Logs OpenAI/LiteLLM errors verbosely on the server. Safe — never logs the API key. */
export function logOpenAIError(label: string, err: unknown) {
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1 (default)";
  const model = getModel();
  if (err instanceof OpenAI.APIError) {
    console.error(
      `[${label}] OpenAI APIError status=${err.status} type=${err.type ?? "?"} model=${model} baseURL=${baseURL}\n  message: ${err.message}`,
    );
  } else if (err instanceof Error) {
    console.error(
      `[${label}] ${err.name}: ${err.message} (model=${model}, baseURL=${baseURL})`,
    );
  } else {
    console.error(`[${label}] Unknown error`, err);
  }
}
