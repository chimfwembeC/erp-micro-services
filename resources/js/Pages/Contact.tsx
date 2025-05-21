import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle
} from 'lucide-react';
import useRoute from '@/Hooks/useRoute';

export default function Contact({ service = null }) {
  const route = useRoute();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Service options for dropdown
  const serviceOptions = [
    { value: '', label: 'Select a service' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-app-development', label: 'Mobile App Development' },
    { value: 'desktop-applications', label: 'Desktop Applications' },
    { value: 'cloud-infrastructure', label: 'Cloud Infrastructure' },
    { value: 'ai-solutions', label: 'AI Solutions' },
    { value: 'devops-ci-cd', label: 'DevOps & CI/CD' },
    { value: 'network-design', label: 'Network Design & Implementation' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'it-infrastructure', label: 'IT Infrastructure Management' },
    { value: 'project-development', label: 'Project Development' },
    { value: 'devops-consulting', label: 'DevOps Consulting' },
    { value: 'training-workshops', label: 'Training & Workshops' },
    { value: 'brand-identity', label: 'Brand Identity Design' },
    { value: 'ui-ux-design', label: 'UI/UX Design' },
    { value: 'marketing-materials', label: 'Marketing Materials' },
    { value: 'other', label: 'Other' }
  ];

  // Initialize form with Inertia
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: service || '',
    message: '',
    subscribe: false,
    captcha: ''
  });

  // Set service from URL parameter if provided
  useEffect(() => {
    if (service) {
      setData('service', service);
    }
  }, [service]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      // Show success message
      toast.success('Your message has been sent successfully!', {
        description: 'We will get back to you as soon as possible.',
        action: {
          label: 'Close',
          onClick: () => console.log('Closed')
        }
      });
      
      // Reset form
      reset();
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <GuestLayout title="Contact Us | Tekrem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Have questions or ready to start your project? Get in touch with our team.
              We're here to help you with all your technology needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Fill out the form and our team will get back to you within 24 hours.
                You can also reach us directly using the contact information below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-muted-foreground">info@tekrem.com</p>
                    <p className="text-muted-foreground">support@tekrem.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="text-muted-foreground">+260 XXX XXX XXX</p>
                    <p className="text-muted-foreground">+260 XXX XXX XXX</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Address</h3>
                    <p className="text-muted-foreground">123 Cairo Road</p>
                    <p className="text-muted-foreground">Lusaka, Zambia</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Business Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p className="text-muted-foreground">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              {/* Google Map */}
              <div className="mt-8 rounded-lg overflow-hidden h-[300px] bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15546.308371324772!2d28.27889!3d-15.424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19408b9a7e70d4b5%3A0x2b4d60793f443b13!2sLusaka%2C%20Zambia!5e0!3m2!1sen!2sus!4v1623345678901!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <CheckCircle className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                      <p className="text-muted-foreground mb-6">
                        Your message has been sent successfully. We'll get back to you as soon as possible.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                          <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                          />
                          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                          <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                          />
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                          />
                          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company/Organization</Label>
                          <Input
                            id="company"
                            value={data.company}
                            onChange={(e) => setData('company', e.target.value)}
                          />
                          {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service">Service of Interest</Label>
                        <Select
                          value={data.service}
                          onValueChange={(value) => setData('service', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                        <Textarea
                          id="message"
                          rows={5}
                          value={data.message}
                          onChange={(e) => setData('message', e.target.value)}
                          required
                        />
                        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="subscribe"
                          checked={data.subscribe}
                          onCheckedChange={(checked) => setData('subscribe', checked)}
                        />
                        <Label htmlFor="subscribe" className="text-sm">
                          Subscribe to our newsletter for updates and industry insights
                        </Label>
                      </div>
                      
                      {/* Simple CAPTCHA (replace with a real CAPTCHA solution) */}
                      <div className="space-y-2">
                        <Label htmlFor="captcha">
                          Please type "TEKREM" to verify you're human <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="captcha"
                          value={data.captcha}
                          onChange={(e) => setData('captcha', e.target.value)}
                          required
                        />
                        {errors.captcha && <p className="text-sm text-destructive">{errors.captcha}</p>}
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message <Send className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>How quickly can you start on my project?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our typical turnaround time for project initiation is 1-2 weeks after the initial consultation and agreement. 
                    For urgent projects, we can sometimes accommodate faster timelines. Please contact us to discuss your specific needs.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Do you offer ongoing support after project completion?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Yes, we offer various support and maintenance packages to ensure your solution continues to perform optimally. 
                    Our support options include regular updates, bug fixes, security patches, and feature enhancements.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>What is your pricing structure?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our pricing varies based on project scope, complexity, and timeline. We offer both fixed-price and time-and-materials 
                    pricing models. After our initial consultation, we'll provide a detailed proposal with transparent pricing.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Do you work with clients outside of Zambia?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Yes, we work with clients globally. Our team is experienced in remote collaboration and we use various tools to 
                    ensure effective communication and project management regardless of geographical location.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}
