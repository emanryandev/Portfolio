import React from 'react';
import { SEO } from '@/components/shared/SEO';

import { AmbientCodeBackground } from '@/components/shared/AmbientCodeBackground';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen relative overflow-hidden">
      <AmbientCodeBackground intensity="low" />
      <SEO 
        title="About Us" 
        description="We are a highly capable engineering unit combining Full-Stack Development, DevOps, and QA to build production-ready web products." 
        url="https://yourdomain.com/about"
        type="website"
      />
      
      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        <section className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Who We Are</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We are a small, highly capable engineering unit that takes web products from development through deployment and quality assurance.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border">
              <h3 className="font-semibold text-lg mb-2">Full-Stack Development</h3>
              <p className="text-muted-foreground">Architecting scalable backends and building dynamic, accessible frontends.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border">
              <h3 className="font-semibold text-lg mb-2">DevOps & Infrastructure</h3>
              <p className="text-muted-foreground">Automating deployments, managing CI/CD pipelines, and ensuring high availability.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border">
              <h3 className="font-semibold text-lg mb-2">QA & Testing</h3>
              <p className="text-muted-foreground">Rigorous testing methodologies to guarantee production-ready software quality.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">How We Work</h2>
          <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl bg-secondary/30 border">
            <div className="text-center font-medium">Discovery</div>
            <div className="text-primary hidden md:block">→</div>
            <div className="text-center font-medium">Development</div>
            <div className="text-primary hidden md:block">→</div>
            <div className="text-center font-medium">QA</div>
            <div className="text-primary hidden md:block">→</div>
            <div className="text-center font-medium">Deployment</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
