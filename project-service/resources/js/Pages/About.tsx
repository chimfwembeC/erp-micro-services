import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, Building, Code, BarChart, Clock, Shield, Globe } from 'lucide-react';

export default function About() {
  // Company milestones
  const milestones = [
    {
      year: '2020',
      title: 'Founded in Lusaka',
      description: 'TekRem was established with a vision to transform businesses in Zambia through technology.',
    },
    {
      year: '2021',
      title: 'First Major Client',
      description: 'Secured our first enterprise client and began developing custom software solutions.',
    },
    {
      year: '2022',
      title: 'Team Expansion',
      description: 'Grew our team to 15 talented developers, designers, and business analysts.',
    },
    {
      year: '2023',
      title: 'ERP Development',
      description: 'Started development of our microservices-based ERP system for Zambian businesses.',
    },
    {
      year: '2024',
      title: 'Official ERP Launch',
      description: 'Launched the TekRem ERP system to help businesses streamline operations and drive growth.',
    },
  ];

  // Company values
  const values = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Customer-Centric',
      description: 'We put our customers at the center of everything we do, ensuring our solutions meet their specific needs.',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Integrity',
      description: 'We operate with honesty, transparency, and ethical standards in all our business dealings.',
    },
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: 'Innovation',
      description: 'We continuously explore new technologies and approaches to deliver cutting-edge solutions.',
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: 'Local Impact',
      description: 'We are committed to contributing to the growth of the Zambian tech ecosystem and economy.',
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Reliability',
      description: 'We deliver on our promises and ensure our systems are dependable and available when needed.',
    },
    {
      icon: <Building className="h-8 w-8 text-primary" />,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork, both internally and with our clients and partners.',
    },
  ];

  return (
    <GuestLayout title="About TekRem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                About TekRem
              </h1>
              <p className="text-xl text-muted-foreground">
                Technology Remedies Innovations (TekRem) is a leading software development company based in Zambia, focused on creating innovative solutions for businesses across Africa.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25"></div>
              <div className="relative bg-background rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://via.placeholder.com/600x400?text=TekRem+Office" 
                  alt="TekRem Office" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary rounded-lg blur opacity-25"></div>
              <div className="relative bg-background rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://via.placeholder.com/600x400?text=Our+Story" 
                  alt="TekRem Story" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                Founded in 2020, TekRem was born out of a passion to address the technological challenges faced by businesses in Zambia. Our founders recognized that many local companies were struggling with outdated systems and processes that hindered their growth and efficiency.
              </p>
              <p className="text-lg text-muted-foreground">
                Starting with a small team of dedicated developers, we began creating custom software solutions for local businesses. As our reputation for quality and reliability grew, so did our team and our ambitions.
              </p>
              <p className="text-lg text-muted-foreground">
                In 2023, we embarked on our most ambitious project yet: developing a comprehensive, microservices-based ERP system specifically designed for the Zambian market. Today, we're proud to offer this solution to businesses of all sizes, helping them streamline operations, improve decision-making, and drive growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="bg-background/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                  <p className="text-lg">
                    To empower Zambian businesses with innovative technology solutions that drive efficiency, growth, and competitive advantage in the global marketplace.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p>Develop high-quality, reliable software solutions</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p>Provide exceptional customer service and support</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p>Foster technological innovation in Zambia</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p>Build long-term partnerships with our clients</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                  <p className="text-lg">
                    To be the leading technology partner for businesses in Zambia and across Africa, recognized for our innovation, reliability, and positive impact on the region's economic development.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p>Become the go-to ERP provider in Zambia</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p>Expand our services across Southern Africa</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p>Contribute to the growth of the local tech ecosystem</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <p>Create employment opportunities for local talent</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The core principles that guide our work and relationships.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-primary/10 rounded-full">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Key milestones in TekRem's growth and development.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10">
                    {milestone.year.slice(2)}
                  </div>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-bold mb-1">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{milestone.year}</p>
                        <p>{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join the growing number of businesses that trust TekRem for their technology needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent" asChild>
              <a href="/register">Get Started</a>
            </Button>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}
