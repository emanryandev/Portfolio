import { SEO } from '@/components/shared/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Globe, Mail, MapPin, Phone, Settings as SettingsIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SettingsStub() {
  return (
    <div className="space-y-8 max-w-4xl pb-24">
      <SEO title="Settings" description="Manage application settings" />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your portfolio's global configuration.</p>
      </div>

      <Alert variant="default" className="border-primary/20 bg-primary/5 text-primary">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          Settings management will be available in a future release. This page is currently a preview.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="border-border/40 opacity-70 pointer-events-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-muted-foreground" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Basic information about your portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input value="My Portfolio" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Site Tagline</Label>
              <Input value="Full Stack Developer & Designer" readOnly />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border/40 opacity-70 pointer-events-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Contact Information</CardTitle>
            </div>
            <CardDescription>How clients can reach you directly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input value="hello@example.com" className="pl-9" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input value="+1 (555) 000-0000" className="pl-9" readOnly />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location / Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value="San Francisco, CA" className="pl-9" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Defaults */}
        <Card className="border-border/40 opacity-70 pointer-events-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <CardTitle>SEO Defaults</CardTitle>
            </div>
            <CardDescription>Default meta tags for search engines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Meta Description</Label>
              <Input value="Welcome to my professional portfolio showcasing my best work." readOnly />
            </div>
          </CardContent>
        </Card>

      </div>
      
      <div className="flex justify-end pt-4">
        <Button disabled>Save Settings</Button>
      </div>
    </div>
  );
}
