import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { blogPosts } from './AllPosts';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  // All posts data combined from different pages
  const allPosts = blogPosts;

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query)
    );
  }, [searchQuery, allPosts]);

  // Update search query when URL params change
  useEffect(() => {
    const queryParam = searchParams.get('q') || '';
    setSearchQuery(queryParam);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const currentQuery = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Search Results
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-md">
              <label htmlFor="search-input" className="sr-only">Search articles</label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12 py-3"
                aria-label="Search articles"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          {/* Search Results */}
          {currentQuery ? (
            <div>
              <div className="mb-6">
                <p className="text-lg text-muted-foreground">
                  {filteredPosts.length > 0 
                    ? `Found ${filteredPosts.length} result${filteredPosts.length === 1 ? '' : 's'} for "${currentQuery}"`
                    : `No results found for "${currentQuery}"`
                  }
                </p>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <BlogCard
                      key={post.slug}
                      title={post.title}
                      category={post.category}
                      date={post.date}
                      excerpt={post.excerpt}
                      image={post.image}
                      href={`/blog/${post.slug}`}
                      isSmall={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    No articles found
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or browse our categories:
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/business')}>
                      Business
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/technology')}>
                      Technology
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/podcast')}>
                      Podcast
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/posts')}>
                      All Posts
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                What are you looking for?
              </h2>
              <p className="text-muted-foreground mb-6">
                Enter a search term above to find articles, or browse our latest content:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" onClick={() => navigate('/posts')}>
                  All Posts
                </Button>
                <Button variant="outline" onClick={() => navigate('/business')}>
                  Business
                </Button>
                <Button variant="outline" onClick={() => navigate('/technology')}>
                  Technology
                </Button>
                <Button variant="outline" onClick={() => navigate('/podcast')}>
                  Podcast
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;