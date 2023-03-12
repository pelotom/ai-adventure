import { useCallback, useEffect, useState } from 'react';

export function useGeneratedText(prompt: string | undefined) {
  return useGenerated('/api/generate-text', prompt);
}

export function useGeneratedImage(prompt: string | undefined) {
  return useGenerated('/api/generate-image', prompt);
}

function useGenerated(
  url: string,
  prompt: string | undefined
): [string | undefined, string | undefined, () => Promise<void>] {
  const [result, setResult] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const regenerate = useCallback(async () => {
    setResult(undefined);
    setErrorMessage(undefined);

    if (!prompt) return;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  }, [url, prompt]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  return [result, errorMessage, regenerate];
}
