import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEO } from './SEO';

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center text-center px-4">
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />
      <div className="space-y-6 max-w-md">
        <h1 className="text-9xl font-extrabold tracking-tighter text-muted-foreground/20">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">Go back home</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">Contact us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
