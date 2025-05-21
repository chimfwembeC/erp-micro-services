import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User } from 'lucide-react';
import useTranslate from '@/Hooks/useTranslate';

export default function Blog() {
  // Initialize translation hook
  const { t } = useTranslate();

  // State for category filtering and pagination
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visiblePostsCount, setVisiblePostsCount] = useState(3);

  // Blog posts data
  const featuredPost = {
    title: 'Introducing TekRem ERP System',
    excerpt: 'Learn about our new microservices-based ERP system designed for businesses in Zambia. Our comprehensive solution includes modules for authentication, project management, CRM, billing, HR, support ticketing, developer resources, and analytics.',
    content: 'TekRem is proud to announce the launch of our new microservices-based ERP system, specifically designed for businesses in Zambia. After years of development and testing, we are excited to bring this comprehensive solution to the market...',
    date: 'May 10, 2024',
    author: 'John Doe',
    category: 'Product',
    image: 'https://via.placeholder.com/1200x600?text=TekRem+ERP',
  };

  const blogPosts = [
    {
      title: 'The Benefits of Microservices Architecture',
      excerpt: 'Discover why we chose microservices architecture for our ERP system and how it benefits our clients.',
      date: 'May 5, 2024',
      author: 'Jane Smith',
      category: 'Technology',
      image: 'https://via.placeholder.com/600x400?text=Microservices',
    },
    {
      title: 'Empowering Zambian Businesses with Technology',
      excerpt: 'How TekRem is helping local businesses leverage technology for growth and efficiency.',
      date: 'April 28, 2024',
      author: 'Michael Johnson',
      category: 'Business',
      image: 'https://via.placeholder.com/600x400?text=Zambian+Tech',
    },
    {
      title: 'Security Best Practices for ERP Systems',
      excerpt: 'Learn how to keep your ERP system secure with these essential security practices.',
      date: 'April 20, 2024',
      author: 'David Mulenga',
      category: 'Security',
      image: 'https://via.placeholder.com/600x400?text=ERP+Security',
    },
    {
      title: 'Streamlining Your Business Processes',
      excerpt: 'Tips and strategies for optimizing your business workflows using our ERP system.',
      date: 'April 15, 2024',
      author: 'Sarah Williams',
      category: 'Productivity',
      image: 'https://via.placeholder.com/600x400?text=Business+Processes',
    },
    {
      title: 'The Future of ERP Systems in Africa',
      excerpt: 'Exploring the trends and innovations shaping the future of ERP systems in African markets.',
      date: 'April 8, 2024',
      author: 'John Doe',
      category: 'Trends',
      image: 'https://via.placeholder.com/600x400?text=Future+ERP',
    },
    {
      title: 'Customer Success Story: Zambia Manufacturing Ltd',
      excerpt: 'How Zambia Manufacturing Ltd improved efficiency by 30% with TekRem ERP.',
      date: 'April 1, 2024',
      author: 'Grace Tembo',
      category: 'Case Study',
      image: 'https://via.placeholder.com/600x400?text=Success+Story',
    },
  ];

  // Categories
  const categories = [
    'All',
    'Product',
    'Technology',
    'Business',
    'Security',
    'Productivity',
    'Trends',
    'Case Study',
  ];

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  // Get posts to display based on visible count
  const visiblePosts = filteredPosts.slice(0, visiblePostsCount);

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // Reset visible posts count when changing category
    setVisiblePostsCount(3);
  };

  // Handle load more click
  const handleLoadMoreClick = () => {
    setVisiblePostsCount(prevCount => prevCount + 3);
  };

  return (
    <GuestLayout title={t('blog.title', 'Blog')}>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {t('blog.title', 'TekRem Blog')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('blog.subtitle', 'Insights, updates, and resources for businesses using our ERP system.')}
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category === selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category)}
              >
                {t(`blog.categories.${category.toLowerCase()}`, category)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">{t('blog.featuredPost', 'Featured Post')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 rounded-lg overflow-hidden">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {featuredPost.category}
                </span>
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {featuredPost.date}
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h3>
              <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{t('blog.post.by', 'By')} {featuredPost.author}</span>
                </div>
              </div>
              <Button className="w-fit" asChild>
                <a href="#">{t('blog.readMore', 'Read More')}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            {selectedCategory === 'All'
              ? t('blog.recentPosts', 'Recent Posts')
              : `${selectedCategory} ${t('blog.post.category', 'Category')}`
            }
          </h2>

          {visiblePosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {t('blog.noPosts', 'No posts found in this category.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.map((post, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3" />
                          <span>{t('blog.post.by', 'By')} {post.author}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{post.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="gap-2" asChild>
                      <a href="#">
                        {t('blog.readMore', 'Read more')} <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Show Load More button only if there are more posts to load */}
          {visiblePosts.length < filteredPosts.length && (
            <div className="flex justify-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMoreClick}
              >
                {t('blog.loadMore', 'Load More')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('blog.newsletter.title', 'Subscribe to Our Newsletter')}</h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('blog.newsletter.description', 'Stay updated with the latest insights, tips, and news about TekRem ERP and business technology.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('blog.newsletter.placeholder', 'Your email address')}
              className="flex-1 px-4 py-2 rounded-md border"
            />
            <Button>{t('blog.newsletter.button', 'Subscribe')}</Button>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}
