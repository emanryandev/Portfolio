import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SEO } from '@/components/shared/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Mail, MapPin, Phone, Settings as SettingsIcon, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import { settingsSchema, SettingsFormValues } from '@/features/settings/schemas/settingsSchema';
import { useSettings } from '@/features/settings/api/queries';
import { useUpdateSettings } from '@/features/settings/api/admin';
import { useToast } from '@/hooks/use-toast';
import { PageLoader } from '@/components/shared/PageLoader';

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: '',
      site_tagline: '',
      contact_email: '',
      contact_phone: '',
      contact_location: '',
      seo_default_description: '',
      logo_url: '/images/logo/logo.jpeg'
    }
  });

  useEffect(() => {
    if (settings) {
      reset({
        site_name: settings.site_name,
        site_tagline: settings.site_tagline,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        contact_location: settings.contact_location,
        seo_default_description: settings.seo_default_description,
        logo_url: settings.logo_url
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await updateSettings.mutateAsync(data);
      reset(data); // Reset isDirty state
      toast({
        title: 'Settings saved',
        description: 'Your global settings have been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to save',
        description: error.message || 'An error occurred while saving settings.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-24">
      <SEO title="Settings" description="Manage application settings" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your portfolio's global configuration.</p>
        </div>
        <Button type="submit" disabled={!isDirty || updateSettings.isPending}>
          {updateSettings.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-muted-foreground" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Basic information about your portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input {...register('site_name')} />
                {errors.site_name && <p className="text-xs text-destructive">{errors.site_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Site Tagline</Label>
                <Input {...register('site_tagline')} />
                {errors.site_tagline && <p className="text-xs text-destructive">{errors.site_tagline.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label>Logo URL</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input {...register('logo_url')} className="pl-9" placeholder="/images/logo/logo.jpeg" />
              </div>
              <p className="text-xs text-muted-foreground">Path to your logo image file.</p>
              {errors.logo_url && <p className="text-xs text-destructive">{errors.logo_url.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border/40">
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
                  <Input {...register('contact_email')} className="pl-9" />
                </div>
                {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input {...register('contact_phone')} className="pl-9" />
                </div>
                {errors.contact_phone && <p className="text-xs text-destructive">{errors.contact_phone.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location / Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input {...register('contact_location')} className="pl-9" />
              </div>
              {errors.contact_location && <p className="text-xs text-destructive">{errors.contact_location.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* SEO Defaults */}
        <Card className="border-border/40">
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
              <Input {...register('seo_default_description')} />
              {errors.seo_default_description && <p className="text-xs text-destructive">{errors.seo_default_description.message}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
