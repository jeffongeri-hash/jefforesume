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
      title: "Antimicrobial Atlas — Antibacterials, Antivirals & Antifungals",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "An antimicrobial atlas covering bacterial classification, antibiotic mechanism of action, antivirals, antifungals, and stewardship — with spectrum tables, resistance patterns, and clinical pearls.",
      image: businessPost,
      slug: "antimicrobial-atlas",
      tags: ["Antibiotics", "Infectious Disease", "Clinical Education"]
    },
    {
      title: "OB/GYN Emergency Atlas — First, Second, Third Trimester & GYN Emergencies",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "An OB/GYN emergency atlas covering first, second, and third trimester emergencies plus gynecologic crises — with clinical pearls, ultrasound findings, and management pearls for the emergency department.",
      image: businessPost,
      slug: "obgyn-emergency-atlas",
      tags: ["OB/GYN", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Pediatric EM Atlas — Board Review",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 19, 2026",
      excerpt: "A pediatric EM board-review atlas covering resuscitation, neonatal emergencies, respiratory distress, GI/surgical mimics, NAT, and pediatric infectious disease with age-specific dosing and red flags.",
      image: businessPost,
      slug: "pediatric-em-atlas",
      tags: ["Pediatrics", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Fluid Dynamics Atlas — IV Fluids, Physiology & Special Considerations",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 19, 2026",
      excerpt: "A fluid dynamics atlas covering crystalloids, colloids, blood products, and compartment physiology with special considerations for sepsis, DKA, burns, heart failure, and pediatrics.",
      image: businessPost,
      slug: "fluid-dynamics-atlas",
      tags: ["IV Fluids", "Critical Care", "Clinical Education"]
    },
    {
      title: "Resuscitation Atlas — Shock, Pressors, Fluids & Electrolytes",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A resuscitation atlas covering the four shock types, matching pressors, fluid strategy, and electrolyte derangements with a structured bedside approach to recognition, dosing, and reassessment.",
      image: businessPost,
      slug: "resuscitation-atlas",
      tags: ["Resuscitation", "Critical Care", "Clinical Education"]
    },
    {
      title: "ABG Interpreter — Acid-Base, Step by Step",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A step-by-step interactive ABG interpreter covering pH, PaCO₂, HCO₃⁻, anion gap, and expected compensation to identify primary and mixed acid-base disturbances.",
      image: businessPost,
      slug: "abg-interpreter",
      tags: ["Acid-Base", "Critical Care", "Clinical Education"]
    },
    {
      title: "Reduction Field Manual — Joint Dislocations",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A bedside field manual for joint reductions with traction vectors, sedation considerations, and post-reduction checks across shoulder, elbow, hip, patella, and finger.",
      image: businessPost,
      slug: "reduction-field-manual",
      tags: ["Orthopedics", "Procedures", "Clinical Education"]
    },
    {
      title: "POCUS Atlas — Probe, Window, Screen & Pitfall",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A point-of-care ultrasound atlas mapping each common exam to its probe choice, acoustic window, expected anatomy, and the pitfalls that fool clinicians.",
      image: businessPost,
      slug: "pocus-atlas",
      tags: ["POCUS", "Ultrasound", "Clinical Education"]
    },
    {
      title: "Toxidrome Atlas — Recognition, Overdoses & Antidotes",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A visual atlas of the major toxidromes — sympathomimetic, anticholinergic, cholinergic, opioid, and sedative-hypnotic — with vitals patterns, agents, and antidotes.",
      image: businessPost,
      slug: "toxidrome-atlas",
      tags: ["Toxicology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Ventilator Atlas — Modes, Numbers & Troubleshooting",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A ventilator atlas covering AC, SIMV, PRVC, PS, and APRV modes, the numbers that matter, and a structured approach to alarms and waveform troubleshooting.",
      image: businessPost,
      slug: "ventilator-atlas",
      tags: ["Critical Care", "Mechanical Ventilation", "Clinical Education"]
    },
    {
      title: "EKG Strip Atlas — Pattern, Location & Mechanism",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "An interactive visual atlas mapping each EKG strip to its pattern, cardiac location, and electrophysiologic mechanism — with waveform annotations and mechanism callouts clinicians use at the bedside.",
      image: businessPost,
      slug: "ekg-strip-atlas",
      tags: ["Cardiology", "ECG", "Clinical Education"]
    },
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