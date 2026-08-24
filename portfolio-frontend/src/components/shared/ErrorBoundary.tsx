import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { SEO } from './SEO';

export function GlobalErrorBoundary() {
  const error = useRouteError();
  
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again later.";
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      // It's handled by NotFound usually, but fallback here
      title = "404 Not Found";
      message = "The requested page was not found.";
    } else {
      title = `${error.status} Error`;
      message = error.statusText || error.data?.message || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center p-4 text-center">
      <SEO title="Error" description="An error occurred on the page." />
      <div className="rounded-full bg-destructive/10 p-4 mb-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md mb-8">{message}</p>
      
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()}>Try Again</Button>
        <Link to="/">
          <Button variant="outline">Go to Homepage</Button>
        </Link>
      </div>
    </div>
  );
}
