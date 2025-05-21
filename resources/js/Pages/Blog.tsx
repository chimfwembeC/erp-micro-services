import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';

export default function Blog() {
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Introducing TekRem ERP System',
      excerpt: 'Learn about our new microservices-based ERP system designed for businesses in Zambia.',
      content: 'Our new ERP system is built on a microservices architecture, providing flexibility, scalability, and reliability for businesses of all sizes. The system includes modules for finance, inventory, HR, and more, all integrated seamlessly to provide a comprehensive solution for business management.',
      date: 'May 10, 2024',
      author: 'John Mulenga',
      category: 'Product',
      tags: ['ERP', 'Microservices', 'Business'],
      image: 'https://via.placeholder.com/800x400?text=ERP+System'
    },
    {
      id: 2,
      title: 'The Benefits of Microservices Architecture',
      excerpt: 'Discover why we chose microservices architecture for our ERP system and how it benefits our clients.',
      content: 'Microservices architecture offers numerous benefits over traditional monolithic applications, including improved scalability, flexibility, and resilience. By breaking down applications into smaller, independent services, we can develop, deploy, and scale each component separately, resulting in faster development cycles and more reliable systems.',
      date: 'May 5, 2024',
      author: 'Sarah Banda',
      category: 'Technology',
      tags: ['Microservices', 'Architecture', 'Software Development'],
      image: 'https://via.placeholder.com/800x400?text=Microservices'
    },
    {
      id: 3,
      title: 'Empowering Zambian Businesses with Technology',
      excerpt: 'How TekRem is helping local businesses leverage technology for growth and efficiency.',
      content: 'At TekRem, we're committed to empowering Zambian businesses with technology solutions that drive growth and efficiency. From small startups to large enterprises, we work closely with our clients to understand their unique challenges and develop tailored solutions that address their specific needs.',
      date: 'April 28, 2024',
      author: 'Michael Phiri',
      category: 'Business',
      tags: ['Zambia', 'Business', 'Technology'],
      image: 'https://via.placeholder.com/800x400?text=Zambian+Tech'
    },
    {
      id: 4,
      title: 'Securing Your Business in the Digital Age',
      excerpt: 'Essential cybersecurity practices for businesses in today's digital landscape.',
      content: 'As businesses increasingly rely on digital technologies, cybersecurity has become a critical concern. This article explores essential cybersecurity practices that businesses should implement to protect their data, systems, and reputation from cyber threats.',
      date: 'April 20, 2024',
      author: 'David Zulu',
      category: 'Security',
      tags: ['Cybersecurity', 'Digital', 'Protection'],
      image: 'https://via.placeholder.com/800x400?text=Cybersecurity'
    },
    {
      id: 5,
      title: 'Cloud Migration Strategies for Businesses',
      excerpt: 'A comprehensive guide to migrating your business operations to the cloud.',
      content: 'Migrating to the cloud can significantly enhance your business operations, but it requires careful planning and execution. This guide provides a step-by-step approach to cloud migration, covering assessment, planning, execution, and optimization phases.',
      date: 'April 15, 2024',
      author: 'Emmanuel Banda',
      category: 'Cloud',
      tags: ['Cloud', 'Migration', 'Strategy'],
      image: 'https://via.placeholder.com/800x400?text=Cloud+Migration'
    },
    {
      id: 6,
      title: 'The Role of AI in Modern Business',
      excerpt: 'How artificial intelligence is transforming business operations and decision-making.',
      content: 'Artificial intelligence is revolutionizing how businesses operate and make decisions. From predictive analytics to automated customer service, AI technologies are helping businesses improve efficiency, reduce costs, and enhance customer experiences.',
      date: 'April 8, 2024',
      author: 'Natasha Mutale',
      category: 'AI',
      tags: ['AI', 'Business', 'Innovation'],
      image: 'https://via.placeholder.com/800x400?text=AI+in+Business'
    },
    {
      id: 7,
      title: 'Designing User-Centric Applications',
      excerpt: 'Principles and practices for creating applications that users love.',
      content: 'User-centric design is essential for creating applications that users love and adopt. This article explores key principles and practices for designing applications that prioritize user needs, preferences, and experiences.',
      date: 'April 1, 2024',
      author: 'Charity Mwanza',
      category: 'Design',
      tags: ['UX', 'Design', 'User-Centric'],
      image: 'https://via.placeholder.com/800x400?text=User+Centric+Design'
    },
    {
      id: 8,
      title: 'Optimizing Network Performance for Remote Work',
      excerpt: 'Strategies for ensuring reliable and secure network connectivity for remote teams.',
      content: 'With the rise of remote work, ensuring reliable and secure network connectivity has become crucial for business continuity. This article provides strategies for optimizing network performance, securing remote connections, and supporting distributed teams.',
      date: 'March 25, 2024',
      author: 'Brian Chanda',
      category: 'Networking',
      tags: ['Remote Work', 'Network', 'Connectivity'],
      image: 'https://via.placeholder.com/800x400?text=Network+Performance'
    },
    {
      id: 9,
      title: 'The Importance of Quality Assurance in Software Development',
      excerpt: 'Why QA is critical for delivering reliable and high-quality software products.',
      content: 'Quality assurance is a critical component of the software development process, ensuring that products meet quality standards and user expectations. This article explores the importance of QA and provides best practices for implementing effective QA processes.',
      date: 'March 18, 2024',
      author: 'Linda Mwape',
      category: 'Development',
      tags: ['QA', 'Software', 'Quality'],
      image: 'https://via.placeholder.com/800x400?text=Quality+Assurance'
    }
  ];

  // Categories
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Product', label: 'Product' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Business', label: 'Business' },
    { value: 'Security', label: 'Security' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'AI', label: 'AI' },
    { value: 'Design', label: 'Design' },
    { value: 'Networking', label: 'Networking' },
    { value: 'Development', label: 'Development' }
  ];

  // Filter posts based on search query and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <GuestLayout title="Blog | Tekrem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tekrem Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, news, and updates from the Tekrem team.
              Stay informed about the latest in technology, business, and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full md:w-1/3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16">
        <div className="container mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {post.author}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Read more <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Reset filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">1</Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
                <span className="mx-1">...</span>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">8</Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Stay updated with the latest insights, news, and updates from the Tekrem team.
              We'll send you a monthly digest of our best content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" className="flex-grow" />
              <Button>Subscribe</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}
