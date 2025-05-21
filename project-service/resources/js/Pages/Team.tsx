import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Mail } from 'lucide-react';

export default function Team() {
  // Leadership team data
  const leadershipTeam = [
    {
      name: 'John Doe',
      role: 'Chief Executive Officer',
      bio: 'John has over 15 years of experience in the technology sector, with a focus on enterprise software solutions. He founded TekRem in 2020 with a vision to transform businesses in Zambia through technology.',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe',
        email: 'john@tekrem.com',
      },
    },
    {
      name: 'Jane Smith',
      role: 'Chief Technology Officer',
      bio: 'With a background in computer science and 12 years of experience in software architecture, Jane leads our technical team in developing innovative solutions. She specializes in microservices architecture and cloud computing.',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/janesmith',
        twitter: 'https://twitter.com/janesmith',
        email: 'jane@tekrem.com',
      },
    },
    {
      name: 'Michael Johnson',
      role: 'Chief Operations Officer',
      bio: 'Michael brings 10 years of operational experience to TekRem. He oversees the day-to-day operations of the company and ensures that our projects are delivered on time and within budget.',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/michaeljohnson',
        twitter: 'https://twitter.com/michaeljohnson',
        email: 'michael@tekrem.com',
      },
    },
  ];

  // Development team data
  const developmentTeam = [
    {
      name: 'David Mulenga',
      role: 'Lead Developer',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/davidmulenga',
      },
    },
    {
      name: 'Sarah Williams',
      role: 'UX Designer',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/sarahwilliams',
      },
    },
    {
      name: 'Robert Chen',
      role: 'Backend Developer',
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/robertchen',
      },
    },
    {
      name: 'Charity Banda',
      role: 'Frontend Developer',
      image: 'https://randomuser.me/api/portraits/women/5.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/charitybanda',
      },
    },
    {
      name: 'James Phiri',
      role: 'DevOps Engineer',
      image: 'https://randomuser.me/api/portraits/men/6.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/jamesphiri',
      },
    },
    {
      name: 'Linda Mutale',
      role: 'QA Engineer',
      image: 'https://randomuser.me/api/portraits/women/6.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/lindamutale',
      },
    },
  ];

  // Business team data
  const businessTeam = [
    {
      name: 'Thomas Zulu',
      role: 'Sales Director',
      image: 'https://randomuser.me/api/portraits/men/7.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/thomaszulu',
      },
    },
    {
      name: 'Grace Tembo',
      role: 'Marketing Manager',
      image: 'https://randomuser.me/api/portraits/women/7.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/gracetembo',
      },
    },
    {
      name: 'Daniel Mwanza',
      role: 'Customer Success Manager',
      image: 'https://randomuser.me/api/portraits/men/8.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/danielmwanza',
      },
    },
    {
      name: 'Patricia Lungu',
      role: 'HR Manager',
      image: 'https://randomuser.me/api/portraits/women/8.jpg',
      social: {
        linkedin: 'https://linkedin.com/in/patricialungu',
      },
    },
  ];

  return (
    <GuestLayout title="Our Team">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-20 md:py-32">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The talented individuals behind TekRem's innovative solutions. Our diverse team brings together expertise in software development, design, and business strategy.
          </p>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the visionaries guiding TekRem's mission and strategy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipTeam.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square w-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{member.bio}</p>
                  <div className="flex gap-4">
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
                    {member.social.email && (
                      <a href={`mailto:${member.social.email}`} className="text-muted-foreground hover:text-primary">
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Development Team Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The talented developers and designers who build our innovative solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {developmentTeam.map((member, index) => (
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
                <CardContent className="text-center">
                  <div className="flex justify-center gap-4">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Team Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Business Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The professionals who drive our sales, marketing, and customer success.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {businessTeam.map((member, index) => (
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
                <CardContent className="text-center">
                  <div className="flex justify-center gap-4">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            We're always looking for talented individuals to join our growing team. Check out our current openings or send us your resume.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="/careers">View Openings</a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}
