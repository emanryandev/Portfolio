import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function DesignSystem() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-12 max-w-7xl mx-auto" dir="ltr">
      
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-4xl font-bold tracking-tight">Design System</h1>
        <p className="text-muted-foreground text-lg">Foundations and primitives for the Portfolio project.</p>
      </header>

      {/* FOUNDATIONS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Foundations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ColorSwatch name="Background" className="bg-background border border-border" />
              <ColorSwatch name="Foreground" className="bg-foreground text-background" />
              <ColorSwatch name="Primary" className="bg-primary text-primary-foreground" />
              <ColorSwatch name="Secondary" className="bg-secondary text-secondary-foreground" />
              <ColorSwatch name="Muted" className="bg-muted text-muted-foreground" />
              <ColorSwatch name="Accent" className="bg-accent text-accent-foreground" />
              <ColorSwatch name="Destructive" className="bg-destructive text-destructive-foreground" />
              <ColorSwatch name="Border" className="bg-border" />
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Typography</h3>
            <div className="space-y-2">
              <div className="text-4xl font-bold">Heading 1</div>
              <div className="text-3xl font-semibold">Heading 2</div>
              <div className="text-2xl font-medium">Heading 3</div>
              <div className="text-xl">Heading 4</div>
              <p className="text-base">Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-sm text-muted-foreground">Small text. Sed do eiusmod tempor incididunt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTS */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Components</h2>

        {/* Buttons */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Buttons</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Inputs & Forms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input type="email" placeholder="Enter your email" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Disabled Input
              </label>
              <Input disabled placeholder="Disabled" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Message
              </label>
              <Textarea placeholder="Type your message here." />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Badges</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Project Title</CardTitle>
                <CardDescription>Deployed in Production</CardDescription>
              </CardHeader>
              <CardContent>
                <p>A full-stack application built with Laravel and React.</p>
              </CardContent>
              <CardFooter>
                <Button>View Details</Button>
              </CardFooter>
            </Card>

            <Card className="bg-secondary/20">
              <CardHeader>
                <CardTitle>Team Member</CardTitle>
                <CardDescription>Senior Developer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">Laravel</Badge>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Feedback / Toast */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Feedback (Toast)</h3>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Success",
                  description: "Your action was completed successfully.",
                })
              }}
            >
              Show Toast
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Something went wrong. Please try again.",
                })
              }}
            >
              Show Error Toast
            </Button>
          </div>
        </div>

      </section>

      <Toaster />
    </div>
  );
}

function ColorSwatch({ name, className }: { name: string, className: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-16 w-full rounded-md shadow-sm flex items-center justify-center p-2 text-xs text-center font-medium ${className}`}>
        {name}
      </div>
    </div>
  );
}
