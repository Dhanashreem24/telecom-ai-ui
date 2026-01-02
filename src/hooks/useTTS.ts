import { useEffect, useRef } from "react";

export function useTTS(enabled: boolean) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  function speak(text: string) {
    if (!enabled) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { speak };
}
