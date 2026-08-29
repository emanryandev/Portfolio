import { useServices } from '../api/queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function ServicesOverview() {
  const { data: servicesData, isLoading, isError } = useServices();

  const services = servicesData?.data?.filter((s) => s.is_featured) || [];

  return (
    <section className="py-24 border-t border-border/40">
      <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How We Can Help</h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Whether you need a full platform built from scratch or specialized infrastructure work, we have a package for you.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={`skeleton-service-${i}`} className="border-border/40">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  {[1, 2, 3, 4].map(j => <Skeleton key={`skeleton-feature-${i}-${j}`} className="h-4 w-full" />)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <div className="p-8 text-center border border-border/40 rounded-lg bg-secondary/20 max-w-2xl mx-auto">
            <p className="text-muted-foreground">Unable to load services at this time.</p>
          </div>
        )}

        {!isLoading && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {services.map((service, idx) => (
              <Card 
                key={`service-${service.id}`} 
                className={`relative flex flex-col border-border/40 bg-card hover:border-primary/20 transition-all ${
                  idx === 1 ? 'border-primary/50 shadow-md scale-100 lg:scale-105 z-10' : ''
                }`}
              >
                {idx === 1 && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="min-h-[3rem] mt-2">{service.description}</CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    {service.price !== null ? (
                      <>
                        {service.price_type === 'starting_at' && <span className="text-sm font-medium text-muted-foreground">From</span>}
                        <span className="text-3xl font-bold tracking-tight">${Number(service.price).toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold tracking-tight">Custom</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-8 flex-1">
                    {service.features?.map((feature: any, fIdx: number) => {
                      const featureText = typeof feature === 'string' ? feature : feature.feature_name;
                      return (
                      <li key={`feature-${service.id}-${fIdx}`} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm text-muted-foreground">{featureText}</span>
                      </li>
                    )})}
                  </ul>
                  <Link to={`/contact?service=${service.id}`} className="w-full mt-auto">
                    <Button variant={idx === 1 ? 'default' : 'outline'} className="w-full">
                      Choose Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
