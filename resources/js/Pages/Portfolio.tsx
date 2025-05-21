import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Code, 
  Cloud, 
  Network, 
  Lightbulb, 
  PenTool,
  ArrowRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';

export default function Portfolio() {
  const route = useRoute();
  const [selectedProject, setSelectedProject] = useState(null);

  // Portfolio projects data
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      client: 'Zambia Retail Group',
      category: 'software',
      tags: ['Web Development', 'E-Commerce', 'Laravel', 'React'],
      description: 'A comprehensive e-commerce platform with inventory management, payment processing, and customer management features.',
      challenge: 'The client needed a scalable e-commerce solution that could handle their growing product catalog and customer base.',
      solution: 'We developed a custom e-commerce platform using Laravel and React, with a focus on performance and scalability.',
      results: 'The platform has helped the client increase online sales by 45% and streamline their inventory management process.',
      technologies: ['Laravel', 'React', 'MySQL', 'AWS', 'Stripe'],
      image: 'https://via.placeholder.com/600x400?text=E-Commerce+Platform',
      images: [
        'https://via.placeholder.com/800x600?text=E-Commerce+Homepage',
        'https://via.placeholder.com/800x600?text=Product+Catalog',
        'https://via.placeholder.com/800x600?text=Shopping+Cart',
        'https://via.placeholder.com/800x600?text=Admin+Dashboard'
      ]
    },
    {
      id: 2,
      title: 'Hospital Management System',
      client: 'Lusaka Medical Center',
      category: 'software',
      tags: ['Web Application', 'Healthcare', 'PHP', 'MySQL'],
      description: 'A comprehensive hospital management system that streamlines patient records, appointments, billing, and inventory.',
      challenge: 'The hospital was struggling with paper-based records and inefficient processes, leading to delays and errors.',
      solution: 'We developed a custom hospital management system that digitized all aspects of hospital operations.',
      results: 'The system reduced administrative workload by 60% and improved patient wait times by 40%.',
      technologies: ['PHP', 'MySQL', 'jQuery', 'Bootstrap', 'AJAX'],
      image: 'https://via.placeholder.com/600x400?text=Hospital+Management+System',
      images: [
        'https://via.placeholder.com/800x600?text=Patient+Records',
        'https://via.placeholder.com/800x600?text=Appointment+Scheduling',
        'https://via.placeholder.com/800x600?text=Billing+Module',
        'https://via.placeholder.com/800x600?text=Inventory+Management'
      ]
    },
    {
      id: 3,
      title: 'AI-Powered Crop Analysis',
      client: 'Zambia Agricultural Research Institute',
      category: 'ai-cloud',
      tags: ['AI', 'Machine Learning', 'Agriculture', 'Python'],
      description: 'An AI-powered system that analyzes crop health and predicts yields based on satellite imagery and weather data.',
      challenge: 'The institute needed a way to monitor crop health across large areas and predict yields more accurately.',
      solution: 'We developed an AI model that analyzes satellite imagery and combines it with weather data to assess crop health and predict yields.',
      results: 'The system has improved yield prediction accuracy by 35% and helped farmers identify crop issues earlier.',
      technologies: ['Python', 'TensorFlow', 'Google Cloud', 'Satellite API', 'Weather API'],
      image: 'https://via.placeholder.com/600x400?text=AI+Crop+Analysis',
      images: [
        'https://via.placeholder.com/800x600?text=Satellite+Imagery+Analysis',
        'https://via.placeholder.com/800x600?text=Crop+Health+Dashboard',
        'https://via.placeholder.com/800x600?text=Yield+Prediction+Charts',
        'https://via.placeholder.com/800x600?text=Weather+Data+Integration'
      ]
    },
    {
      id: 4,
      title: 'Enterprise Network Infrastructure',
      client: 'Copperbelt Mining Corporation',
      category: 'networking',
      tags: ['Networking', 'Security', 'Enterprise', 'Cisco'],
      description: 'A comprehensive network infrastructure upgrade for a large mining corporation with multiple sites.',
      challenge: 'The client needed a secure, reliable network infrastructure to connect their headquarters with remote mining sites.',
      solution: 'We designed and implemented a robust network infrastructure with redundant connections and advanced security features.',
      results: 'The new infrastructure has improved network reliability to 99.99% uptime and enhanced security against cyber threats.',
      technologies: ['Cisco', 'Fortinet', 'VPN', 'MPLS', 'Network Monitoring'],
      image: 'https://via.placeholder.com/600x400?text=Network+Infrastructure',
      images: [
        'https://via.placeholder.com/800x600?text=Network+Topology',
        'https://via.placeholder.com/800x600?text=Security+Implementation',
        'https://via.placeholder.com/800x600?text=Monitoring+Dashboard',
        'https://via.placeholder.com/800x600?text=Remote+Site+Connection'
      ]
    },
    {
      id: 5,
      title: 'Digital Transformation Strategy',
      client: 'Zambia National Bank',
      category: 'consultancy',
      tags: ['Consultancy', 'Digital Transformation', 'Banking', 'Strategy'],
      description: 'A comprehensive digital transformation strategy for a national bank, covering all aspects of their operations.',
      challenge: 'The bank was facing increasing competition from digital-first financial institutions and needed to modernize their operations.',
      solution: 'We developed a phased digital transformation strategy, covering technology infrastructure, customer experience, and internal processes.',
      results: 'The strategy has helped the bank reduce operational costs by 25% and improve customer satisfaction scores by 30%.',
      technologies: ['Digital Strategy', 'Process Optimization', 'Change Management', 'Technology Assessment'],
      image: 'https://via.placeholder.com/600x400?text=Digital+Transformation',
      images: [
        'https://via.placeholder.com/800x600?text=Strategy+Document',
        'https://via.placeholder.com/800x600?text=Implementation+Roadmap',
        'https://via.placeholder.com/800x600?text=Technology+Stack+Diagram',
        'https://via.placeholder.com/800x600?text=Process+Optimization+Charts'
      ]
    },
    {
      id: 6,
      title: 'Corporate Brand Identity',
      client: 'Zambia Tourism Agency',
      category: 'graphics',
      tags: ['Branding', 'Logo Design', 'Marketing', 'Tourism'],
      description: 'A complete brand identity redesign for the national tourism agency, including logo, color palette, and marketing materials.',
      challenge: 'The agency needed a modern, distinctive brand identity to attract international tourists to Zambia.',
      solution: 'We created a vibrant, authentic brand identity that captures the essence of Zambia's natural beauty and cultural heritage.',
      results: 'The new brand identity has increased brand recognition by 40% and contributed to a 25% increase in tourism inquiries.',
      technologies: ['Adobe Creative Suite', 'Brand Strategy', 'Typography', 'Color Theory'],
      image: 'https://via.placeholder.com/600x400?text=Brand+Identity',
      images: [
        'https://via.placeholder.com/800x600?text=Logo+Design',
        'https://via.placeholder.com/800x600?text=Brand+Guidelines',
        'https://via.placeholder.com/800x600?text=Marketing+Materials',
        'https://via.placeholder.com/800x600?text=Website+Design'
      ]
    },
    {
      id: 7,
      title: 'Mobile Banking App',
      client: 'First Capital Bank',
      category: 'software',
      tags: ['Mobile App', 'Banking', 'React Native', 'API'],
      description: 'A secure, user-friendly mobile banking application for Android and iOS platforms.',
      challenge: 'The bank needed a mobile app that would provide a seamless banking experience while maintaining the highest security standards.',
      solution: 'We developed a cross-platform mobile app using React Native, with biometric authentication and real-time transaction processing.',
      results: 'The app has been downloaded over 100,000 times and has a 4.7/5 rating on app stores.',
      technologies: ['React Native', 'Node.js', 'MongoDB', 'RESTful API', 'Biometric Authentication'],
      image: 'https://via.placeholder.com/600x400?text=Mobile+Banking+App',
      images: [
        'https://via.placeholder.com/800x600?text=App+Login+Screen',
        'https://via.placeholder.com/800x600?text=Account+Dashboard',
        'https://via.placeholder.com/800x600?text=Transaction+History',
        'https://via.placeholder.com/800x600?text=Fund+Transfer+Screen'
      ]
    },
    {
      id: 8,
      title: 'Cloud Migration',
      client: 'Zambia Insurance Corporation',
      category: 'ai-cloud',
      tags: ['Cloud', 'Migration', 'AWS', 'DevOps'],
      description: 'A comprehensive migration of on-premises infrastructure to AWS cloud, including applications, databases, and storage.',
      challenge: 'The client needed to modernize their IT infrastructure, reduce costs, and improve scalability and reliability.',
      solution: 'We designed and executed a phased cloud migration strategy, minimizing disruption while maximizing the benefits of cloud computing.',
      results: 'The migration reduced IT infrastructure costs by 35% and improved system availability to 99.95%.',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
      image: 'https://via.placeholder.com/600x400?text=Cloud+Migration',
      images: [
        'https://via.placeholder.com/800x600?text=Migration+Strategy',
        'https://via.placeholder.com/800x600?text=Cloud+Architecture',
        'https://via.placeholder.com/800x600?text=DevOps+Pipeline',
        'https://via.placeholder.com/800x600?text=Monitoring+Dashboard'
      ]
    },
    {
      id: 9,
      title: 'School Management System',
      client: 'Lusaka Education Board',
      category: 'software',
      tags: ['Web Application', 'Education', 'Laravel', 'Vue.js'],
      description: 'A comprehensive school management system for managing students, teachers, classes, and administrative tasks.',
      challenge: 'The education board needed a centralized system to manage multiple schools, streamline administrative tasks, and improve communication.',
      solution: 'We developed a web-based school management system with modules for student management, attendance tracking, grade management, and more.',
      results: 'The system has reduced administrative workload by 50% and improved communication between schools, parents, and the education board.',
      technologies: ['Laravel', 'Vue.js', 'MySQL', 'Redis', 'WebSockets'],
      image: 'https://via.placeholder.com/600x400?text=School+Management+System',
      images: [
        'https://via.placeholder.com/800x600?text=Student+Management',
        'https://via.placeholder.com/800x600?text=Attendance+Tracking',
        'https://via.placeholder.com/800x600?text=Grade+Management',
        'https://via.placeholder.com/800x600?text=Parent+Portal'
      ]
    }
  ];

  // Function to open project details modal
  const openProjectDetails = (project) => {
    setSelectedProject(project);
  };

  // Function to close project details modal
  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  return (
    <GuestLayout title="Portfolio | Tekrem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Portfolio</h1>
            <p className="text-xl text-muted-foreground">
              Explore our successful projects across various industries and technologies.
              Each project represents our commitment to excellence and client satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Tabs Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
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

            {/* All Projects Tab */}
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} onClick={() => openProjectDetails(project)} />
                ))}
              </div>
            </TabsContent>

            {/* Software Projects Tab */}
            <TabsContent value="software">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects
                  .filter((project) => project.category === 'software')
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} onClick={() => openProjectDetails(project)} />
                  ))}
              </div>
            </TabsContent>

            {/* AI & Cloud Projects Tab */}
            <TabsContent value="ai-cloud">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects
                  .filter((project) => project.category === 'ai-cloud')
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} onClick={() => openProjectDetails(project)} />
                  ))}
              </div>
            </TabsContent>

            {/* Networking Projects Tab */}
            <TabsContent value="networking">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects
                  .filter((project) => project.category === 'networking')
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} onClick={() => openProjectDetails(project)} />
                  ))}
              </div>
            </TabsContent>

            {/* Consultancy Projects Tab */}
            <TabsContent value="consultancy">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects
                  .filter((project) => project.category === 'consultancy')
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} onClick={() => openProjectDetails(project)} />
                  ))}
              </div>
            </TabsContent>

            {/* Graphics Projects Tab */}
            <TabsContent value="graphics">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects
                  .filter((project) => project.category === 'graphics')
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} onClick={() => openProjectDetails(project)} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Contact us today to discuss how we can help bring your vision to life.
            </p>
            <Button size="lg" asChild>
              <Link href={route('contact')}>
                Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <button
                  onClick={closeProjectDetails}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Client</h3>
                  <p>{selectedProject.client}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <p className="capitalize">{selectedProject.category.replace('-', ' & ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Project Overview</h3>
                  <p>{selectedProject.description}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Challenge</h3>
                  <p>{selectedProject.challenge}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Solution</h3>
                  <p>{selectedProject.solution}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Results</h3>
                  <p>{selectedProject.results}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, index) => (
                    <Badge key={index}>{tech}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Project Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedProject.title} - Image ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button onClick={closeProjectDetails}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GuestLayout>
  );
}

// Project Card Component
function ProjectCard({ project, onClick }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.client}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline">+{project.tags.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onClick}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
