import React from 'react';
import { SEO } from '@/components/shared/SEO';
import { useServices } from '@/features/services/api/queries';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PageLoader } from '@/components/shared/PageLoader';
import { Check } from 'lucide-react';
import { AmbientCodeBackground } from '@/components/shared/AmbientCodeBackground';

const Packages: React.FC = () => {
  const { data: servicesData, isLoading } = useServices();

  if (isLoading) {
    return <PageLoader />;
  }

  const services = servicesData?.data || [];

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen relative overflow-hidden">
      <AmbientCodeBackground intensity="low" snippets={[]} />
      <SEO 
        title="Engineering Packages" 
        description="Structured solutions for projects of all sizes. Built, deployed, and tested by our expert team." 
        url="https://yourdomain.com/packages"
        type="website"
      />
      
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Engineering Packages</h1>
          <p className="text-xl text-muted-foreground">
            Structured solutions for projects of all sizes. Built, deployed, and tested.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col p-8 rounded-2xl bg-card border hover:border-primary/50 transition-colors">
              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-semibold">{service.name}</h3>
                <p className="text-muted-foreground min-h-[3rem]">{service.description}</p>
                {service.price && (
                  <div className="text-3xl font-bold">
                    ${service.price}
                    {service.price_type !== 'fixed' && <span className="text-base font-normal text-muted-foreground ml-2">({service.price_type})</span>}
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                <p className="font-medium">What's included:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm">Full-Stack Architecture</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm">CI/CD Pipeline Setup</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm">Quality Assurance Testing</span>
                  </li>
                </ul>
              </div>

              <Button asChild size="lg" className="w-full">
                <Link to="/contact">Start a Project</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packages;
