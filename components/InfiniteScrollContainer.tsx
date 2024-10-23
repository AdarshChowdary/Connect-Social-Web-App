import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottonReached: () => void;
  className: string;
}

export default function InfiniteScrollContainer({
  children,
  onBottonReached,
  className,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) onBottonReached();
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}
