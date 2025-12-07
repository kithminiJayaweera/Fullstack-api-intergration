
interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return <div className="container mx-auto py-10">{message}</div>;
}
