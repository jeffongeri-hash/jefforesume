import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import PageFilter, { Post } from '@/components/PageFilter';
import { useState } from 'react';
import techPost from '@/assets/tech-post.jpg';
import businessPost from '@/assets/business-post.jpg';
import pslfPost from '@/assets/pslf-hospitals.jpg';
import relocationPost from '@/assets/relocation-budget.jpg';
import sacramentoSuburbs from '@/assets/sacramento-suburbs.jpg';
import pslfFinder from '@/assets/pslf-finder.jpg';
import sanJoseSuburbs from '@/assets/san-jose-suburbs.jpg';
import phoenixSuburbs from '@/assets/phoenix-suburbs.jpg';
import houstonSuburbs from '@/assets/houston-suburbs.jpg';

const AllPosts = () => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const blogPosts: Post[] = [
    {
      title: "Arrhythmia Origin Atlas — Where Each One Lives",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 9, 2026",
      excerpt: "An interactive visual atlas mapping each major arrhythmia to its anatomic origin in the conduction system, with the ECG signatures clinicians use to recognize them.",
      image: businessPost,
      slug: "arrhythmia-origin-atlas",
      tags: ["Cardiology", "ECG", "Clinical Education"]
    },
    {
      title: "Houston Suburb & TMC Neighborhood Guide: 3BR Housing, Commute & Monthly Budget",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 16, 2026",
      excerpt: "A full breakdown of 15 Houston suburbs and TMC-adjacent neighborhoods ranked by 3BR rent, hospital commute, yard value, and monthly budget on a single PA income.",
      image: houstonSuburbs,
      slug: "houston-suburb-guide-3br-housing-tmc-commute",
      tags: ["Relocation", "Houston", "Healthcare Careers"]
    },
    {
      title: "Phoenix Metro Suburb Guide: 3BR Housing, Hospital Commute & Neighborhood Breakdown",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 15, 2026",
      excerpt: "A city-by-city and neighborhood-level breakdown of Phoenix, Mesa, Chandler, Scottsdale, and Glendale — ranked by 3BR rent, hospital access, ER PA salary signals, and move-ready cash on a single income.",
      image: phoenixSuburbs,
      slug: "phoenix-metro-suburb-guide-3br-housing-hospital-commute",
      tags: ["Relocation", "Phoenix", "Healthcare Careers"]
    },
    {
      title: "San Jose Suburb Guide: 3BR Housing, Hospital Commute & Move-Ready Cash",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 15, 2026",
      excerpt: "A suburb-by-suburb comparison of 8 San Jose-area communities ranked by 3BR rent, hospital commute fit, move-ready cash, and monthly surplus on a single PA income.",
      image: sanJoseSuburbs,
      slug: "san-jose-suburb-guide-3br-housing-commute-hospital",
      tags: ["Relocation", "San Jose", "Healthcare Careers"]
    },
    {
      title: "Find PSLF-Qualifying Hospitals by City or Zip Code",
      category: "HEALTHCARE",
      subcategory: "Student Loans",
      date: "March 15, 2026",
      excerpt: "Search PSLF-qualifying hospitals and clinics across 6 markets by city, zip code, or health system. Includes government and nonprofit employer verification guidance.",
      image: pslfFinder,
      slug: "pslf-hospital-finder-by-city-zip",
      tags: ["PSLF", "Student Loans", "Healthcare Careers"]
    },
    {
      title: "Sacramento Suburb Guide: 3BR Housing, Commute & Monthly Budget for Every Orbit",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 15, 2026",
      excerpt: "A suburb-by-suburb comparison of 12 Sacramento-area communities ranked by 3BR rent, commute time, and monthly surplus on a single PA income.",
      image: sacramentoSuburbs,
      slug: "sacramento-suburb-guide-3br-housing-commute-budget",
      tags: ["Relocation", "Sacramento", "Healthcare Careers"]
    },
    {
      title: "2-Adult Relocation Budget: 3BR House, Groceries & Move-Ready Cash by Market",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 12, 2026",
      excerpt: "A full relocation budget comparing 3BR housing, Walmart grocery costs, monthly living expenses, and move-ready cash targets across five markets.",
      image: relocationPost,
      slug: "relocation-budget-3br-move-ready-cash",
      tags: ["Relocation", "Budgeting", "Healthcare Careers"]
    },
    {
      title: "PSLF-Qualifying Hospitals in California & Arizona: A Comprehensive Guide",
      category: "HEALTHCARE",
      subcategory: "Student Loans",
      date: "March 12, 2026",
      excerpt: "A consolidated guide to PSLF-qualifying hospitals in California and Arizona, with verification tips for government and nonprofit employers.",
      image: pslfPost,
      slug: "pslf-qualifying-hospitals-california-arizona",
      tags: ["PSLF", "Student Loans", "Healthcare Careers"]
    },
    {
      title: "The AI Bubble: Should We Be Concerned?",
      category: "TECHNOLOGY",
      subcategory: "Artificial Intelligence", 
      date: "December 15, 2025",
      excerpt: "Examining the rapid rise of AI investments and whether we're heading toward another tech bubble.",
      image: techPost,
      slug: "ai-bubble-concerns",
      tags: ["AI", "Investment", "Technology Trends"]
    },
    {
      title: "The Benefits of Seamless EHR Transfers: Improving Patient Care",
      category: "HEALTHCARE", 
      subcategory: "Health IT",
      date: "December 10, 2025",
      excerpt: "How seamless electronic health record transfers can transform patient outcomes and healthcare efficiency.",
      image: businessPost,
      slug: "seamless-ehr-transfers-benefits",
      tags: ["EHR", "Healthcare IT", "Patient Care"]
    }
  ];

  const postsToShow = filteredPosts.length > 0 ? filteredPosts : blogPosts;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>All Posts by Jefney Ongeri | Healthcare, Technology & Finance Blog</title>
        <meta name="description" content="Browse all blog posts by Jefney Ongeri covering healthcare careers, PSLF, relocation guides, technology trends, and professional development." />
        <meta name="keywords" content="Jefney Ongeri, blog, healthcare, technology, PSLF, relocation, physician assistant" />
        <link rel="canonical" href="https://jefneyongeri.com/posts" />
      </Helmet>
      <Header />
      <main id="main-content" className="container-blog py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            All Posts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights on healthcare, technology, and professional development.
          </p>
        </div>

        <PageFilter
          posts={blogPosts}
          onFilteredPostsChange={setFilteredPosts}
          availableCategories={["TECHNOLOGY", "HEALTHCARE"]}
          showCategoryFilter={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {postsToShow.map((post, index) => (
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
      </main>
      <Footer />
    </div>
  );
};

export default AllPosts;