import { useCallback, useEffect, useState } from 'react';
import type { ChatCompletionRequestMessage } from 'openai';

export function useGeneratedText(messages: ChatCompletionRequestMessage[]) {
  return useGenerated('/api/generate-text', JSON.stringify({ messages }));
}

export function useGeneratedImage(prompt: string | undefined) {
  return useGenerated(
    '/api/generate-image',
    prompt
      ? JSON.stringify({
          prompt,
        })
      : undefined
  );
}

function useGenerated(
  url: string,
  body: string | undefined
): [string | undefined, string | undefined, () => Promise<void>] {
  const [result, setResult] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const regenerate = useCallback(async () => {
    setResult(undefined);
    setErrorMessage(undefined);

    if (!body) return;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
    } catch (e) {
      setErrorMessage(e.message);
    }
  }, [url, body]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  return [result, errorMessage, regenerate];
}
