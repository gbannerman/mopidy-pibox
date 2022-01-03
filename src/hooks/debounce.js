import { useState } from "react";

export const useDebounce = (fn, delay = 500) => {
  const [currentTimer, setCurrentTimer] = useState(null);

  const debounced = (...args) => {
    if (currentTimer) {
      clearTimeout(currentTimer);
    }
    const timer = setTimeout(() => {
      fn(...args);
    }, delay);
    setCurrentTimer(timer);
  };

  return debounced;
};
