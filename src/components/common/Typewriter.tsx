import { useEffect, useState } from "react";

const Typewriter = ({
  text,
  delay = 50,
  startDelay = 0,
  onComplete,
}: {
  text: string;
  delay?: number;
  startDelay?: number;
  key?: string | number;
  onComplete?: () => void;
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && currentIndex > 0) {
      onComplete?.();
    }
  }, [currentIndex, delay, text, started, onComplete]);

  return <span>{currentText}</span>;
};

export default Typewriter;
