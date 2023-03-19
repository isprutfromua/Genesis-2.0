const defaultOptions: IntersectionObserverOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
};

export interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
}

export function useIntersectionObserver(
  target: Element,
  actionOnIntersecting: (entry: Element) => void,
  options: IntersectionObserverOptions = {}
): IntersectionObserver {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          actionOnIntersecting(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { ...defaultOptions, ...options }
  );

  if (!target || !(target instanceof Element)) {
    throw new Error("Invalid target element");
  }

  observer.observe(target);
  return observer;
}
