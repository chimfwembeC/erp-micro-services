import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Building, 
  Target, 
  Users, 
  Award, 
  CheckCircle, 
  BarChart, 
  Clock, 
  Briefcase 
} from 'lucide-react';

export default function About() {
  // Company milestones
  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'Tekrem was founded with a vision to provide innovative technology solutions to businesses in Zambia.'
    },
    {
      year: '2019',
      title: 'First Major Client',
      description: 'Secured our first major client and successfully delivered a comprehensive ERP solution.'
    },
    {
      year: '2020',
      title: 'Expanded Service Offerings',
      description: 'Added AI & Cloud services to our portfolio to meet growing demand for advanced technology solutions.'
    },
    {
      year: '2021',
      title: 'Team Growth',
      description: 'Expanded our team to include specialized experts in various technology domains.'
    },
    {
      year: '2022',
      title: 'Office Expansion',
      description: 'Moved to a larger office space to accommodate our growing team and operations.'
    },
    {
      year: '2023',
      title: 'International Clients',
      description: 'Started serving clients beyond Zambia, expanding our reach to neighboring countries.'
    },
    {
      year: '2024',
      title: 'Microservices Architecture',
      description: 'Launched our innovative microservices-based ERP system for enhanced scalability and flexibility.'
    }
  ];

  // Core values
  const coreValues = [
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: 'Integrity',
      description: 'We conduct our business with the highest ethical standards and transparency.'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, delivering high-quality solutions.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and collaborative problem-solving.'
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'Innovation',
      description: 'We continuously innovate to stay ahead of technological advancements.'
    }
  ];

  return (
    <GuestLayout title="About Us | Tekrem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Tekrem</h1>
            <p className="text-xl text-muted-foreground">
              We are a leading technology solutions provider dedicated to empowering businesses 
              through innovative software development, AI & cloud solutions, networking services, 
              consultancy, and graphics design.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Company Overview</h2>
              <div className="space-y-4">
                <p>
                  Founded in 2018, Tekrem has established itself as a trusted technology partner for businesses 
                  across Zambia and beyond. Our name, Technology Remedies Innovations, reflects our commitment 
                  to providing innovative solutions to technology challenges.
                </p>
                <p>
                  At Tekrem, we combine technical expertise with industry knowledge to deliver tailored solutions 
                  that drive business growth and operational efficiency. Our team of skilled professionals is 
                  dedicated to understanding your unique needs and developing solutions that exceed expectations.
                </p>
                <p>
                  We pride ourselves on building long-term relationships with our clients, serving as a trusted 
                  technology partner rather than just a service provider. This approach has enabled us to grow 
                  steadily and expand our service offerings to meet the evolving needs of our clients.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25"></div>
              <div className="relative bg-background rounded-lg shadow-xl overflow-hidden">
                <img
                  src="https://via.placeholder.com/600x400?text=Tekrem+Office"
                  alt="Tekrem Office"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p>
                    To empower businesses through innovative technology solutions that drive growth, 
                    efficiency, and competitive advantage in an increasingly digital world.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <BarChart className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p>
                    To be the leading technology solutions provider in Zambia and beyond, 
                    recognized for excellence, innovation, and transformative impact on our clients' success.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Building className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Approach</h3>
                  <p>
                    We take a collaborative, client-centered approach, focusing on understanding 
                    your unique challenges and delivering tailored solutions that create lasting value.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground">
              These principles guide everything we do at Tekrem, from how we develop solutions 
              to how we interact with our clients and each other.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    {value.icon}
                    <h3 className="text-xl font-bold mt-4 mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Market Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6">Who We Serve</h2>
              <div className="space-y-4">
                <p>
                  Tekrem serves a diverse range of clients across various industries, from small 
                  businesses to large enterprises. Our solutions are particularly valuable for:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Small and Medium Enterprises (SMEs)</strong> looking to leverage technology for growth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Large Corporations</strong> seeking to optimize operations and enhance efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Government Agencies</strong> aiming to improve service delivery through technology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Educational Institutions</strong> looking to enhance learning through digital solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Non-Profit Organizations</strong> seeking to maximize impact through technology</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-6 shadow-md">
                <Briefcase className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Business</h3>
                <p className="text-sm text-muted-foreground">Empowering businesses with technology solutions</p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-md">
                <Building className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <p className="text-sm text-muted-foreground">Scalable solutions for large organizations</p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-md">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Education</h3>
                <p className="text-sm text-muted-foreground">Digital solutions for modern learning</p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-md">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Non-Profit</h3>
                <p className="text-sm text-muted-foreground">Technology for social impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Milestones Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">
              From our humble beginnings to where we are today, here's a look at the key milestones 
              in Tekrem's journey.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-card rounded-lg p-6 shadow-md">
                      <div className="inline-block bg-primary/10 text-primary font-bold px-3 py-1 rounded-full mb-3">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Information Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Legal Information</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Company Registration</h3>
                    <p>
                      Tekrem is registered as a limited liability company in Zambia under registration 
                      number 123456789. Our operations comply with all applicable laws and regulations.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Data Protection</h3>
                    <p>
                      We are committed to protecting your data and privacy. Our operations comply with 
                      the Data Protection Act and other relevant data protection regulations.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Certifications</h3>
                    <p>
                      Tekrem holds various industry certifications, including ISO 27001 for information 
                      security management, demonstrating our commitment to maintaining the highest standards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}
