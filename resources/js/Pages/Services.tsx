import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Cloud, 
  Network, 
  Lightbulb, 
  PenTool, 
  CheckCircle, 
  ArrowRight,
  Globe,
  Smartphone,
  Monitor,
  Database,
  Server,
  Cpu,
  Wifi,
  Users,
  FileCode,
  Layers
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';

export default function Services() {
  const route = useRoute();

  // Software Development services
  const softwareServices = [
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: 'Web Development',
      description: 'Custom web applications, responsive websites, e-commerce platforms, and content management systems.',
      features: [
        'Frontend development with React, Vue, Angular',
        'Backend development with Laravel, Node.js',
        'E-commerce solutions',
        'Progressive Web Apps (PWAs)',
        'API development and integration'
      ]
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android devices.',
      features: [
        'Native iOS and Android development',
        'Cross-platform with React Native, Flutter',
        'Mobile app UI/UX design',
        'App maintenance and support',
        'App Store and Play Store deployment'
      ]
    },
    {
      icon: <Monitor className="h-10 w-10 text-primary" />,
      title: 'Desktop Applications',
      description: 'Custom desktop software for Windows, macOS, and Linux platforms.',
      features: [
        'Cross-platform desktop applications',
        'Electron-based applications',
        'Legacy system modernization',
        'Desktop application integration',
        'Performance optimization'
      ]
    }
  ];

  // AI & Cloud services
  const aiCloudServices = [
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: 'Cloud Infrastructure',
      description: 'Scalable and secure cloud infrastructure setup, migration, and management.',
      features: [
        'AWS, Azure, Google Cloud setup',
        'Cloud migration strategies',
        'Infrastructure as Code (IaC)',
        'Serverless architecture',
        'Cloud cost optimization'
      ]
    },
    {
      icon: <Cpu className="h-10 w-10 text-primary" />,
      title: 'AI Solutions',
      description: 'Custom AI and machine learning solutions to automate processes and gain insights.',
      features: [
        'Machine learning models',
        'Natural Language Processing (NLP)',
        'Computer Vision applications',
        'Predictive analytics',
        'AI-powered chatbots and assistants'
      ]
    },
    {
      icon: <Server className="h-10 w-10 text-primary" />,
      title: 'DevOps & CI/CD',
      description: 'Streamline development and deployment with DevOps practices and CI/CD pipelines.',
      features: [
        'CI/CD pipeline setup',
        'Container orchestration with Kubernetes',
        'Docker containerization',
        'Infrastructure monitoring',
        'Automated testing and deployment'
      ]
    }
  ];

  // Networking services
  const networkingServices = [
    {
      icon: <Wifi className="h-10 w-10 text-primary" />,
      title: 'Network Design & Implementation',
      description: 'Comprehensive network design, implementation, and management services.',
      features: [
        'Network architecture design',
        'LAN/WAN implementation',
        'Wireless network setup',
        'Network security implementation',
        'Network performance optimization'
      ]
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'Cybersecurity',
      description: 'Protect your business with comprehensive cybersecurity solutions.',
      features: [
        'Security assessments and audits',
        'Firewall implementation and management',
        'Intrusion detection and prevention',
        'Data encryption solutions',
        'Security awareness training'
      ]
    },
    {
      icon: <Server className="h-10 w-10 text-primary" />,
      title: 'IT Infrastructure Management',
      description: 'End-to-end management of your IT infrastructure for optimal performance.',
      features: [
        'Server management and maintenance',
        'Storage solutions',
        'Backup and disaster recovery',
        'IT helpdesk support',
        'Infrastructure monitoring'
      ]
    }
  ];

  // Consultancy services
  const consultancyServices = [
    {
      icon: <FileCode className="h-10 w-10 text-primary" />,
      title: 'Project Development',
      description: 'Expert guidance and management for your technology projects.',
      features: [
        'Project planning and scoping',
        'Technology stack selection',
        'Project management',
        'Quality assurance',
        'Post-launch support'
      ]
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: 'DevOps Consulting',
      description: 'Transform your development and operations processes for greater efficiency.',
      features: [
        'DevOps assessment and strategy',
        'Process automation',
        'Tool selection and implementation',
        'Team training and enablement',
        'Continuous improvement'
      ]
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Training & Workshops',
      description: 'Comprehensive training programs to enhance your team's technical skills.',
      features: [
        'Custom training programs',
        'Technical workshops',
        'Team skill assessment',
        'Hands-on practical sessions',
        'Ongoing learning support'
      ]
    }
  ];

  // Graphics Design services
  const graphicsServices = [
    {
      icon: <PenTool className="h-10 w-10 text-primary" />,
      title: 'Brand Identity Design',
      description: 'Create a distinctive brand identity that resonates with your audience.',
      features: [
        'Logo design',
        'Brand guidelines',
        'Business cards and stationery',
        'Brand color palette',
        'Typography selection'
      ]
    },
    {
      icon: <Layout className="h-10 w-10 text-primary" />,
      title: 'UI/UX Design',
      description: 'User-centered design for websites, applications, and digital products.',
      features: [
        'User interface design',
        'User experience design',
        'Wireframing and prototyping',
        'Usability testing',
        'Design system creation'
      ]
    },
    {
      icon: <Image className="h-10 w-10 text-primary" />,
      title: 'Marketing Materials',
      description: 'Eye-catching marketing materials to promote your business.',
      features: [
        'Social media graphics',
        'Brochures and flyers',
        'Banners and posters',
        'Email templates',
        'Presentation design'
      ]
    }
  ];

  // Service process steps
  const processSteps = [
    {
      number: '01',
      title: 'Consultation',
      description: 'We begin with a thorough consultation to understand your business needs and objectives.'
    },
    {
      number: '02',
      title: 'Planning',
      description: 'Our team develops a detailed plan outlining the scope, timeline, and deliverables.'
    },
    {
      number: '03',
      title: 'Development',
      description: 'We execute the plan, keeping you informed and involved throughout the process.'
    },
    {
      number: '04',
      title: 'Testing',
      description: 'Rigorous testing ensures the solution meets all requirements and quality standards.'
    },
    {
      number: '05',
      title: 'Deployment',
      description: 'We carefully deploy the solution, ensuring a smooth transition and minimal disruption.'
    },
    {
      number: '06',
      title: 'Support',
      description: 'Our relationship continues with ongoing support and maintenance to ensure long-term success.'
    }
  ];

  return (
    <GuestLayout title="Services | Tekrem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive technology solutions tailored to your business needs.
              From software development to networking, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Tabs Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <Tabs defaultValue="software" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
                <TabsTrigger value="software" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span className="hidden md:inline">Software</span>
                </TabsTrigger>
                <TabsTrigger value="ai-cloud" className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  <span className="hidden md:inline">AI & Cloud</span>
                </TabsTrigger>
                <TabsTrigger value="networking" className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  <span className="hidden md:inline">Networking</span>
                </TabsTrigger>
                <TabsTrigger value="consultancy" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden md:inline">Consultancy</span>
                </TabsTrigger>
                <TabsTrigger value="graphics" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  <span className="hidden md:inline">Graphics</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Software Development Tab */}
            <TabsContent value="software" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Software Development</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Custom software solutions designed to streamline your business processes, 
                  enhance productivity, and drive growth.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {softwareServices.map((service, index) => (
                  <Card key={index} className="flex flex-col">
                    <CardHeader>
                      <div className="mb-4">{service.icon}</div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href={route('contact', { service: service.title })}>
                          Request this Service
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AI & Cloud Tab */}
            <TabsContent value="ai-cloud" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">AI & Cloud Solutions</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Harness the power of artificial intelligence and cloud computing to transform 
                  your business operations and gain competitive advantage.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {aiCloudServices.map((service, index) => (
                  <Card key={index} className="flex flex-col">
                    <CardHeader>
                      <div className="mb-4">{service.icon}</div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href={route('contact', { service: service.title })}>
                          Request this Service
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Networking Tab */}
            <TabsContent value="networking" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Networking Services</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Robust networking solutions to ensure secure, reliable, and high-performance 
                  connectivity for your business.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {networkingServices.map((service, index) => (
                  <Card key={index} className="flex flex-col">
                    <CardHeader>
                      <div className="mb-4">{service.icon}</div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href={route('contact', { service: service.title })}>
                          Request this Service
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Consultancy Tab */}
            <TabsContent value="consultancy" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Consultancy Services</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Expert guidance and support to help you navigate the complex technology landscape 
                  and make informed decisions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {consultancyServices.map((service, index) => (
                  <Card key={index} className="flex flex-col">
                    <CardHeader>
                      <div className="mb-4">{service.icon}</div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href={route('contact', { service: service.title })}>
                          Request this Service
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Graphics Design Tab */}
            <TabsContent value="graphics" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Graphics Design</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Creative design solutions to enhance your brand identity and visual communication.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {graphicsServices.map((service, index) => (
                  <Card key={index} className="flex flex-col">
                    <CardHeader>
                      <div className="mb-4">{service.icon}</div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href={route('contact', { service: service.title })}>
                          Request this Service
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We follow a structured approach to ensure the successful delivery of every project.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      {step.number}
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-xl mb-8">
                Contact us today to discuss how our services can help you achieve your business goals.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href={route('contact')}>
                  Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}

// Missing components
const Shield = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const Layout = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const Image = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
