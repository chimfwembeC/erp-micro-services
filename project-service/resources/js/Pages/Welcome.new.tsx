import React from 'react';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import useRoute from '@/Hooks/useRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Users, Building, Code, BarChart } from 'lucide-react';

interface Props {
  canLogin: boolean;
  canRegister: boolean;
  laravelVersion: string;
  phpVersion: string;
}

export default function Welcome({
  canLogin,
  canRegister,
  laravelVersion,
  phpVersion,
}: Props) {
  const route = useRoute();

  // Team members data
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      name: 'Jane Smith',
      role: 'CTO',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      name: 'Michael Johnson',
      role: 'Lead Developer',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      name: 'Sarah Williams',
      role: 'UX Designer',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
  ];

  // Partners data
  const partners = [
    {
      name: 'Acme Inc',
      logo: 'https://via.placeholder.com/150x80?text=Acme+Inc',
    },
    {
      name: 'TechCorp',
      logo: 'https://via.placeholder.com/150x80?text=TechCorp',
    },
    {
      name: 'Innovate Ltd',
      logo: 'https://via.placeholder.com/150x80?text=Innovate+Ltd',
    },
    {
      name: 'Future Systems',
      logo: 'https://via.placeholder.com/150x80?text=Future+Systems',
    },
  ];

  // Blog posts data
  const blogPosts = [
    {
      title: 'Introducing TekRem ERP System',
      excerpt: 'Learn about our new microservices-based ERP system designed for businesses in Zambia.',
      date: 'May 10, 2024',
      image: 'https://via.placeholder.com/600x400?text=ERP+System',
    },
    {
      title: 'The Benefits of Microservices Architecture',
      excerpt: 'Discover why we chose microservices architecture for our ERP system and how it benefits our clients.',
      date: 'May 5, 2024',
      image: 'https://via.placeholder.com/600x400?text=Microservices',
    },
    {
      title: 'Empowering Zambian Businesses with Technology',
      excerpt: 'How TekRem is helping local businesses leverage technology for growth and efficiency.',
      date: 'April 28, 2024',
      image: 'https://via.placeholder.com/600x400?text=Zambian+Tech',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "TekRem's ERP system has transformed our business operations. We've seen a 30% increase in efficiency since implementation.",
      author: "David Mulenga",
      company: "Zambia Manufacturing Ltd",
    },
    {
      quote: "The customer support team at TekRem is exceptional. They're always available to help with any issues we encounter.",
      author: "Charity Banda",
      company: "Lusaka Retail Group",
    },
    {
      quote: "We've been able to scale our business thanks to the flexibility of TekRem's ERP system. Highly recommended!",
      author: "Michael Phiri",
      company: "Copperbelt Mining Solutions",
    },
  ];

  return (
    <GuestLayout title="Welcome to TekRem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-20 md:py-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Empower Your Business with TekRem ERP
              </h1>
              <p className="text-xl text-muted-foreground">
                A comprehensive microservices-based ERP system designed for Zambian businesses to streamline operations and drive growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href={route('register')}>Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={route('contact')}>Contact Sales</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25"></div>
              <div className="relative bg-background rounded-lg shadow-xl overflow-hidden">
                <img
                  src="https://via.placeholder.com/600x400?text=TekRem+ERP"
                  alt="TekRem ERP Dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive ERP Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our microservices architecture provides a modular approach to enterprise resource planning, allowing you to use only what you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Authentication & User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Secure user authentication, role-based access control, and comprehensive user management.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="gap-2" asChild>
                  <Link href="#">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Code className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Project & Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Track projects, manage tasks, and monitor time logs with our intuitive project management tools.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="gap-2" asChild>
                  <Link href="#">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Building className="h-12 w-12 text-primary mb-4" />
                <CardTitle>CRM & Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage client relationships, track leads, and streamline communication with your customers.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="gap-2" asChild>
                  <Link href="#">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <BarChart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Analytics & Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gain insights into your business with comprehensive analytics and customizable reports.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="gap-2" asChild>
                  <Link href="#">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Leading Companies</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're proud to partner with businesses across Zambia and beyond.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 md:h-20 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The talented individuals behind TekRem's innovative solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardHeader className="text-center pt-6">
                  <div className="mx-auto mb-4 relative w-24 h-24 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href={route('team')}>View Full Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog/Insights Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Insights</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest news and insights from TekRem.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="gap-2" asChild>
                    <Link href="#">
                      Read more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href={route('blog')}>View All Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-muted/50">
                <CardHeader>
                  <svg className="h-12 w-12 text-primary/20" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-4">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Have questions about our ERP system? Contact us today to learn how we can help your business.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Customized Solutions</h3>
                    <p>Tailored to meet the specific needs of your business</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Local Support</h3>
                    <p>Based in Zambia, we provide responsive local support</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Scalable Architecture</h3>
                    <p>Our microservices approach grows with your business</p>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                      <input id="first-name" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                      <input id="last-name" className="w-full p-2 border rounded-md" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input id="email" type="email" className="w-full p-2 border rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">Company</label>
                    <input id="company" className="w-full p-2 border rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea id="message" rows={4} className="w-full p-2 border rounded-md"></textarea>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Send Message</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}
