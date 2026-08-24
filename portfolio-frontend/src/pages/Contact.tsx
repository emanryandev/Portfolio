import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTeam } from '@/features/team/api/queries';
import { useServices } from '@/features/services/api/queries';
import { useSubmitContactRequest } from '@/features/contact/api/mutations';
import { SEO } from '@/components/shared/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, ArrowRight, ArrowLeft, Loader2, User, Building2 } from 'lucide-react';
import { AmbientCodeBackground } from '@/components/shared/AmbientCodeBackground';

type Step = 'who' | 'need' | 'project' | 'details' | 'review' | 'success';

interface FormData {
  recipientId: number | 'team' | null;
  serviceId: number | null;
  projectName: string;
  projectDescription: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
}

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialRecipient = searchParams.get('recipient') ? Number(searchParams.get('recipient')) : null;
  const initialService = searchParams.get('service') ? Number(searchParams.get('service')) : null;

  const [step, setStep] = useState<Step>('who');
  const [formData, setFormData] = useState<FormData>({
    recipientId: initialRecipient,
    serviceId: initialService,
    projectName: '',
    projectDescription: '',
    budget: '',
    name: '',
    email: '',
    phone: '',
  });

  const { data: teamData, isLoading: teamLoading } = useTeam();
  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const submitMutation = useSubmitContactRequest();

  const team = teamData?.data || [];
  const services = servicesData?.data || [];

  // Smart Recommendation Logic
  useEffect(() => {
    if (step === 'need' && formData.serviceId) {
      const selectedService = services.find(s => s.id === formData.serviceId);
      if (selectedService && formData.recipientId === 'team') {
        // Simple heuristic: if service name contains 'Full-Stack', suggest Filipater (or role match)
        // Since we don't hardcode IDs, we just match by role or name keywords
        const keywordMatch = team.find(m => 
          m.role.toLowerCase().includes(selectedService.name.toLowerCase().split(' ')[0]) ||
          selectedService.name.toLowerCase().includes(m.role.toLowerCase().split(' ')[0])
        );
        if (keywordMatch) {
          // Could show a toast or alert, but let's keep it simple and just update if they haven't explicitly chosen someone else
          // Actually, let's not auto-override, maybe just suggest in the UI.
        }
      }
    }
  }, [formData.serviceId, step, services, team]);

  const handleNext = (nextStep: Step) => {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: `Project: ${formData.projectName}\n\n${formData.projectDescription}`,
        budget: formData.budget || undefined,
        service_id: formData.serviceId || undefined,
        recipients: formData.recipientId && formData.recipientId !== 'team' ? [formData.recipientId] : undefined,
      });
      handleNext('success');
    } catch (error) {
      console.error('Failed to submit contact request', error);
      // Let error boundary or axios interceptor handle toast
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 'who': return formData.recipientId !== null;
      case 'need': return formData.serviceId !== null;
      case 'project': return formData.projectName.length > 2 && formData.projectDescription.length > 10;
      case 'details': return formData.name.length > 2 && /^\S+@\S+\.\S+$/.test(formData.email);
      default: return true;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/10 relative overflow-hidden">
      <AmbientCodeBackground 
        intensity="low" 
        snippets={[
          '> initialize_project()',
          '> define_scope()',
          '> build()',
          '> test()',
          '> deploy()'
        ]} 
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <SEO title="Start a Project" description="Contact our team to discuss your next digital product." url="https://yourdomain.com/contact" />
        
        <section className="py-12 md:py-20">
          <div className="container px-4 max-w-3xl mx-auto">
          
          {step !== 'success' && (
            <div className="mb-12 relative z-10">
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border/20 -z-10 rounded-full"></div>
                
                {['who', 'need', 'project', 'details', 'review'].map((s, idx, arr) => {
                  const isActive = step === s;
                  const isPassed = arr.indexOf(step) > idx;
                  return (
                    <div key={s} className={`flex flex-col items-center gap-2 bg-background px-2`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500
                        ${isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg shadow-primary/20' : 
                          isPassed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-xs hidden sm:block transition-colors ${isActive || isPassed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Card className="border-border/20 shadow-2xl bg-card/60 backdrop-blur-xl overflow-hidden relative z-10">
            <div className="h-1 bg-primary/20 w-full relative">
              <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-500" style={{ 
                width: step === 'who' ? '20%' : step === 'need' ? '40%' : step === 'project' ? '60%' : step === 'details' ? '80%' : step === 'review' ? '100%' : '100%'
              }}></div>
            </div>
            <CardContent className="p-6 md:p-12">
              
              {/* STEP 1: WHO */}
              {step === 'who' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-2xl font-bold">Who do you want to work with?</h2>
                    <p className="text-muted-foreground">Select a specific team member or the entire team.</p>
                  </div>
                  
                  {teamLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        className={`cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center text-center gap-4 transition-all
                          ${formData.recipientId === 'team' ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-primary/40 bg-background'}`}
                        onClick={() => setFormData({...formData, recipientId: 'team'})}
                      >
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold">The Entire Team</h3>
                          <p className="text-xs text-muted-foreground mt-1">Best for complete projects</p>
                        </div>
                      </div>

                      {team.map(member => (
                        <div 
                          key={member.id}
                          className={`cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center text-center gap-4 transition-all
                            ${formData.recipientId === member.id ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-primary/40 bg-background'}`}
                          onClick={() => setFormData({...formData, recipientId: member.id})}
                        >
                          <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden">
                            {member.image_url ? (
                              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-full h-full p-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold">{member.name.split(' ')[0]}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button onClick={() => handleNext('need')} disabled={!isStepValid()}>
                      Next Step <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: NEED */}
              {step === 'need' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-2xl font-bold">What do you need?</h2>
                    <p className="text-muted-foreground">Select the service that best matches your requirements.</p>
                  </div>
                  
                  {servicesLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {services.map(service => (
                        <div 
                          key={service.id}
                          className={`cursor-pointer rounded-xl border-2 p-4 flex items-center justify-between transition-all
                            ${formData.serviceId === service.id ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-primary/40 bg-background'}`}
                          onClick={() => setFormData({...formData, serviceId: service.id})}
                        >
                          <div>
                            <h3 className="font-bold text-lg">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-4
                            ${formData.serviceId === service.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            {formData.serviceId === service.id && <Check className="w-4 h-4" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => handleNext('who')}>
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <Button onClick={() => handleNext('project')} disabled={!isStepValid()}>
                      Next Step <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: PROJECT */}
              {step === 'project' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-2xl font-bold">Tell us about the project</h2>
                    <p className="text-muted-foreground">Give us a high-level overview of what you're looking to build.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name / Title <span className="text-destructive">*</span></Label>
                      <Input 
                        id="projectName" 
                        placeholder="e.g. E-commerce Platform Rewrite"
                        value={formData.projectName}
                        onChange={e => setFormData({...formData, projectName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="projectDesc">Project Description <span className="text-destructive">*</span></Label>
                      <Textarea 
                        id="projectDesc" 
                        placeholder="Describe your goals, requirements, and timeline..."
                        className="min-h-[150px]"
                        value={formData.projectDescription}
                        onChange={e => setFormData({...formData, projectDescription: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Estimated Budget (Optional)</Label>
                      <Input 
                        id="budget" 
                        placeholder="e.g. $5,000 - $10,000"
                        value={formData.budget}
                        onChange={e => setFormData({...formData, budget: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => handleNext('need')}>
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <Button onClick={() => handleNext('details')} disabled={!isStepValid()}>
                      Next Step <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: DETAILS */}
              {step === 'details' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-2xl font-bold">Your contact details</h2>
                    <p className="text-muted-foreground">How should we get back to you?</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                      <Input 
                        id="name" 
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => handleNext('project')}>
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <Button onClick={() => handleNext('review')} disabled={!isStepValid()}>
                      Review <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW */}
              {step === 'review' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-2xl font-bold">Review & Submit</h2>
                    <p className="text-muted-foreground">Please review your information before submitting.</p>
                  </div>
                  
                  <div className="rounded-lg border border-border/40 divide-y divide-border/40 bg-background text-sm">
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                      <div className="text-muted-foreground font-medium">To</div>
                      <div className="sm:col-span-2 font-semibold">
                        {formData.recipientId === 'team' ? 'The Entire Team' : team.find(m => m.id === formData.recipientId)?.name}
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                      <div className="text-muted-foreground font-medium">Service</div>
                      <div className="sm:col-span-2 font-semibold">
                        {services.find(s => s.id === formData.serviceId)?.name}
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                      <div className="text-muted-foreground font-medium">Project</div>
                      <div className="sm:col-span-2">
                        <span className="font-semibold block mb-1">{formData.projectName}</span>
                        <p className="text-muted-foreground whitespace-pre-wrap">{formData.projectDescription}</p>
                        {formData.budget && <p className="mt-2 text-primary font-medium">Budget: {formData.budget}</p>}
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                      <div className="text-muted-foreground font-medium">Contact</div>
                      <div className="sm:col-span-2">
                        <span className="block font-semibold">{formData.name}</span>
                        <span className="block text-muted-foreground">{formData.email}</span>
                        {formData.phone && <span className="block text-muted-foreground">{formData.phone}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => handleNext('details')} disabled={submitMutation.isPending}>
                      <ArrowLeft className="mr-2 w-4 h-4" /> Edit Details
                    </Button>
                    <Button onClick={handleSubmit} disabled={submitMutation.isPending} className="w-32">
                      {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                    </Button>
                  </div>
                </div>
              )}

              {/* SUCCESS STATE */}
              {step === 'success' && (
                <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">Request Sent Successfully!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto text-lg">
                    Thank you for reaching out, {formData.name.split(' ')[0]}. We've received your request and will get back to you within 24-48 hours.
                  </p>
                  <div className="pt-8">
                    <Button onClick={() => window.location.href = '/'} size="lg">
                      Return to Homepage
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground relative z-10 flex-wrap">
            <span className="font-medium text-foreground w-full sm:w-auto text-center">Or reach out directly:</span>
            <a href="mailto:hello@yourdomain.com" className="hover:text-primary transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email
            </a>
            {/* TODO: Add WhatsApp, LinkedIn, and GitHub links here once the real URLs are configured */}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
