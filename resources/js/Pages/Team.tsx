import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Mail, 
  Linkedin, 
  Twitter, 
  Github,
  ArrowRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';

export default function Team() {
  const route = useRoute();

  // Leadership team data
  const leadershipTeam = [
    {
      name: 'John Mulenga',
      role: 'Chief Executive Officer',
      bio: 'John has over 15 years of experience in the technology industry, with a focus on software development and business strategy. He founded Tekrem with a vision to empower Zambian businesses through innovative technology solutions.',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      social: {
        email: 'john@tekrem.com',
        linkedin: 'https://linkedin.com/in/johnmulenga',
        twitter: 'https://twitter.com/johnmulenga'
      }
    },
    {
      name: 'Sarah Banda',
      role: 'Chief Technology Officer',
      bio: 'Sarah leads our technical team with her extensive knowledge of software architecture and emerging technologies. She has a passion for developing scalable solutions that address complex business challenges.',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      social: {
        email: 'sarah@tekrem.com',
        linkedin: 'https://linkedin.com/in/sarahbanda',
        github: 'https://github.com/sarahbanda'
      }
    },
    {
      name: 'Michael Phiri',
      role: 'Chief Operations Officer',
      bio: 'Michael oversees our day-to-day operations, ensuring that we deliver high-quality solutions on time and within budget. His background in project management and business operations is invaluable to our success.',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      social: {
        email: 'michael@tekrem.com',
        linkedin: 'https://linkedin.com/in/michaelphiri',
        twitter: 'https://twitter.com/michaelphiri'
      }
    },
    {
      name: 'Grace Tembo',
      role: 'Chief Marketing Officer',
      bio: 'Grace brings her creative vision and strategic thinking to our marketing efforts. She has a deep understanding of the local market and is passionate about showcasing how technology can transform businesses.',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      social: {
        email: 'grace@tekrem.com',
        linkedin: 'https://linkedin.com/in/gracetembo',
        twitter: 'https://twitter.com/gracetembo'
      }
    }
  ];

  // Technical team data
  const technicalTeam = [
    {
      name: 'David Zulu',
      role: 'Lead Software Developer',
      bio: 'David leads our software development team, bringing expertise in full-stack development and software architecture. He specializes in web and mobile application development.',
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
      social: {
        email: 'david@tekrem.com',
        github: 'https://github.com/davidzulu',
        linkedin: 'https://linkedin.com/in/davidzulu'
      }
    },
    {
      name: 'Charity Mwanza',
      role: 'Senior UI/UX Designer',
      bio: 'Charity creates intuitive and visually appealing user interfaces for our applications. Her design philosophy centers on creating experiences that are both beautiful and functional.',
      image: 'https://randomuser.me/api/portraits/women/6.jpg',
      social: {
        email: 'charity@tekrem.com',
        linkedin: 'https://linkedin.com/in/charitymwanza',
        twitter: 'https://twitter.com/charitymwanza'
      }
    },
    {
      name: 'Emmanuel Banda',
      role: 'DevOps Engineer',
      bio: 'Emmanuel manages our infrastructure and deployment pipelines, ensuring that our applications are reliable, secure, and scalable. He has extensive experience with cloud platforms and containerization.',
      image: 'https://randomuser.me/api/portraits/men/7.jpg',
      social: {
        email: 'emmanuel@tekrem.com',
        github: 'https://github.com/emmanuelbanda',
        linkedin: 'https://linkedin.com/in/emmanuelbanda'
      }
    },
    {
      name: 'Natasha Mutale',
      role: 'Data Scientist',
      bio: 'Natasha leads our AI and data science initiatives, developing models and algorithms that extract valuable insights from data. She has a background in mathematics and computer science.',
      image: 'https://randomuser.me/api/portraits/women/8.jpg',
      social: {
        email: 'natasha@tekrem.com',
        github: 'https://github.com/natashamutale',
        linkedin: 'https://linkedin.com/in/natashamutale'
      }
    },
    {
      name: 'Brian Chanda',
      role: 'Network Engineer',
      bio: 'Brian designs and implements our networking solutions, ensuring secure and reliable connectivity for our clients. He has expertise in network security and infrastructure design.',
      image: 'https://randomuser.me/api/portraits/men/9.jpg',
      social: {
        email: 'brian@tekrem.com',
        linkedin: 'https://linkedin.com/in/brianchanda',
        twitter: 'https://twitter.com/brianchanda'
      }
    },
    {
      name: 'Linda Mwape',
      role: 'Quality Assurance Specialist',
      bio: 'Linda ensures that our solutions meet the highest quality standards through rigorous testing and quality control processes. Her attention to detail is key to delivering reliable products.',
      image: 'https://randomuser.me/api/portraits/women/10.jpg',
      social: {
        email: 'linda@tekrem.com',
        linkedin: 'https://linkedin.com/in/lindamwape',
        github: 'https://github.com/lindamwape'
      }
    }
  ];

  // Business team data
  const businessTeam = [
    {
      name: 'Peter Mumba',
      role: 'Business Development Manager',
      bio: 'Peter leads our business development efforts, identifying new opportunities and building relationships with clients. His understanding of the local business landscape is invaluable.',
      image: 'https://randomuser.me/api/portraits/men/11.jpg',
      social: {
        email: 'peter@tekrem.com',
        linkedin: 'https://linkedin.com/in/petermumba',
        twitter: 'https://twitter.com/petermumba'
      }
    },
    {
      name: 'Ruth Chisanga',
      role: 'Project Manager',
      bio: 'Ruth oversees our project delivery, ensuring that we meet our clients' requirements on time and within budget. Her organizational skills and attention to detail drive our project success.',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
      social: {
        email: 'ruth@tekrem.com',
        linkedin: 'https://linkedin.com/in/ruthchisanga',
        twitter: 'https://twitter.com/ruthchisanga'
      }
    },
    {
      name: 'Joseph Lungu',
      role: 'Customer Success Manager',
      bio: 'Joseph works closely with our clients to ensure they get the most value from our solutions. His focus on client satisfaction has been key to building long-term relationships.',
      image: 'https://randomuser.me/api/portraits/men/13.jpg',
      social: {
        email: 'joseph@tekrem.com',
        linkedin: 'https://linkedin.com/in/josephlungu',
        twitter: 'https://twitter.com/josephlungu'
      }
    },
    {
      name: 'Mary Sichone',
      role: 'Finance Manager',
      bio: 'Mary manages our financial operations, ensuring that we maintain financial health and compliance. Her expertise in financial management supports our sustainable growth.',
      image: 'https://randomuser.me/api/portraits/women/14.jpg',
      social: {
        email: 'mary@tekrem.com',
        linkedin: 'https://linkedin.com/in/marysichone',
        twitter: 'https://twitter.com/marysichone'
      }
    }
  ];

  // Team member card component
  const TeamMemberCard = ({ member }) => (
    <Card>
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
      <CardContent>
        <p className="text-muted-foreground mb-4">{member.bio}</p>
        <div className="flex justify-center gap-4">
          {member.social.email && (
            <a href={`mailto:${member.social.email}`} className="text-muted-foreground hover:text-primary">
              <Mail className="h-5 w-5" />
            </a>
          )}
          {member.social.linkedin && (
            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {member.social.twitter && (
            <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </a>
          )}
          {member.social.github && (
            <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <GuestLayout title="Our Team | Tekrem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-xl text-muted-foreground">
              Meet the talented individuals behind Tekrem's innovative technology solutions.
              Our diverse team brings together expertise across various domains to deliver excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our leadership team brings together decades of experience in technology, business, and innovation.
              They guide our vision and ensure we deliver exceptional value to our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Technical Team Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Technical Team</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our technical team comprises skilled developers, designers, and engineers who bring our solutions to life.
              Their expertise spans across various technologies and domains.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalTeam.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Business Team Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Business Team</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our business team ensures smooth operations, client satisfaction, and sustainable growth.
              They bridge the gap between technology and business value.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {businessTeam.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="bg-card rounded-lg p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We're always looking for talented individuals to join our team. If you're passionate about technology and innovation, we'd love to hear from you.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Collaborative and inclusive work environment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Opportunities for professional growth and development</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Work on innovative projects with cutting-edge technologies</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Competitive compensation and benefits</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Button asChild>
                    <Link href={route('contact', { service: 'careers' })}>
                      View Open Positions <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25"></div>
                <div className="relative bg-background rounded-lg shadow-xl overflow-hidden">
                  <img
                    src="https://via.placeholder.com/600x400?text=Join+Our+Team"
                    alt="Join Our Team"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}

// Missing components
const Code = ({ className }: { className?: string }) => (
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
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const Briefcase = ({ className }: { className?: string }) => (
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
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
