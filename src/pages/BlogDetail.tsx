import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/BlogCard';
import SocialShare from '@/components/SocialShare';
import ReadingProgress from '@/components/ReadingProgress';
import BackToTop from '@/components/BackToTop';
import techPost from '@/assets/tech-post.jpg';
import businessPost from '@/assets/business-post.jpg';
import pslfPost from '@/assets/pslf-hospitals.jpg';

const blogPosts = {
  "pslf-qualifying-hospitals-california-arizona": {
    title: "PSLF-Qualifying Hospitals in California & Arizona: A Comprehensive Guide",
    category: "HEALTHCARE",
    date: "March 12, 2026",
    readTime: "10 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: pslfPost,
    content: `
      <p><strong>Important:</strong> PSLF is based on your actual employer/W-2 entity, not just the hospital building. Government employers and 501(c)(3) nonprofit systems are the strongest bets, but you should still verify the exact employer in the federal PSLF tool before signing.</p>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">California</h2>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Sacramento / El Dorado County</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>UC Davis Health / UC Davis Medical Center</strong> — public nonprofit UC institution.</li>
        <li><strong>Sutter Health hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>Sutter Medical Center, Sacramento</li>
            <li>Sutter Davis Hospital</li>
            <li>California Pacific Medical Center in San Francisco</li>
          </ul>
          <p class="mt-1 text-sm italic">Sutter says it is a not-for-profit health system.</p>
        </li>
        <li><strong>Dignity Health / CommonSpirit hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>Mercy General Hospital</li>
            <li>Methodist Hospital of Sacramento</li>
            <li>Mercy San Juan Medical Center</li>
            <li>Mercy Hospital of Folsom</li>
            <li>St. Mary's Medical Center</li>
            <li>Saint Francis Memorial Hospital</li>
          </ul>
          <p class="mt-1 text-sm italic">CommonSpirit describes itself as a nonprofit health system.</p>
        </li>
        <li><strong>Marshall Medical Center</strong> — nonprofit corporation.</li>
        <li><strong>Barton Memorial Hospital / Barton Health</strong> — El Dorado County identifies Barton Memorial Hospital as the county's designated base hospital and a Level III Trauma Center; prior county and nonprofit-sector sources identify Barton Health as not-for-profit.</li>
      </ul>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">San Francisco / Bay Area</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>UCSF Health</strong> — UCSF says it is a public nonprofit institution exempt under 501(c)(3).</li>
        <li><strong>Zuckerberg San Francisco General Hospital and Trauma Center</strong> — part of the San Francisco Department of Public Health, so government employment.</li>
        <li><strong>Laguna Honda Hospital and Rehabilitation Center</strong> — also part of San Francisco DPH.</li>
        <li><strong>San Francisco VA Medical Center / VA system</strong> — federal government employer.</li>
        <li><strong>Alameda Health System hospitals</strong> — public health system.</li>
        <li><strong>Contra Costa Regional Medical Center</strong> — county health system.</li>
        <li><strong>Santa Clara Valley Medical Center</strong> — county health system.</li>
        <li><strong>San Mateo Medical Center</strong> — county health system.</li>
        <li><strong>MarinHealth Medical Center</strong> — nonprofit-backed system; MarinHealth Foundation is 501(c)(3). Verify exact employing entity on the offer.</li>
        <li><strong>Stanford Health Care</strong> — California nonprofit public benefit corporation described in 501(c)(3).</li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Arizona</h2>

      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Phoenix / Mesa / Scottsdale</h3>

      <ul class="list-disc pl-6 my-4">
        <li><strong>Valleywise Health Medical Center</strong> — public system tied to the Maricopa County Special Health Care District.</li>
        <li><strong>Banner Health hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>Banner Desert Medical Center</li>
            <li>Banner University Medical Center Phoenix</li>
          </ul>
          <p class="mt-1 text-sm italic">Banner says it is a nonprofit health system.</p>
        </li>
        <li><strong>HonorHealth hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>HonorHealth Scottsdale Osborn Medical Center</li>
            <li>HonorHealth Deer Valley Medical Center</li>
          </ul>
          <p class="mt-1 text-sm italic">HonorHealth says it is a nonprofit 501(c)(3) organization.</p>
        </li>
        <li><strong>Dignity Health / CommonSpirit Arizona hospitals</strong>, including:
          <ul class="list-disc pl-6 mt-2">
            <li>Arizona General Hospital Mesa</li>
          </ul>
          <p class="mt-1 text-sm italic">Dignity Health Arizona's hospital network is part of nonprofit CommonSpirit.</p>
        </li>
        <li><strong>Mayo Clinic Hospital, Phoenix</strong> — Mayo Clinic is nonprofit; verify exact employing entity.</li>
        <li><strong>Phoenix Children's Hospital</strong> — nonprofit 501(c)(3) hospital.</li>
        <li><strong>Phoenix VA Health Care System</strong> — federal government employer.</li>
        <li><strong>Phoenix Indian Medical Center</strong> — Indian Health Service federal employer.</li>
      </ul>

      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Safest PSLF Bets from This Whole List</h2>

      <p>The least ambiguous options are the government/federal hospitals:</p>

      <ul class="list-disc pl-6 my-4">
        <li>Zuckerberg San Francisco General</li>
        <li>Laguna Honda</li>
        <li>VA hospitals</li>
        <li>Alameda Health System</li>
        <li>Contra Costa Regional Medical Center</li>
        <li>Santa Clara Valley Medical Center</li>
        <li>San Mateo Medical Center</li>
        <li>Valleywise Health Medical Center</li>
        <li>Phoenix Indian Medical Center</li>
      </ul>

      <p>These government and federal employers offer the most straightforward path to PSLF qualification, as there is no ambiguity about their nonprofit or public status. For all other employers on this list, always verify the exact W-2 entity through the <a href="https://studentaid.gov/pslf/" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">federal PSLF Help Tool</a> before committing.</p>
    `
  },
  "ai-bubble-concerns": {
    title: "The AI Bubble: Should We Be Concerned?",
    category: "TECHNOLOGY",
    date: "December 15, 2025",
    readTime: "8 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: techPost,
    content: `
      <p>The artificial intelligence sector has experienced unprecedented growth over the past few years, with valuations reaching stratospheric levels. From startups to tech giants, everyone seems to be racing to integrate AI into their products and services. But as someone who closely follows both technology and investment trends, I find myself asking: are we witnessing genuine innovation, or are we inflating another bubble?</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Numbers Behind the Hype</h2>
      
      <p>Investment in AI companies has skyrocketed. Venture capital funding for AI startups exceeded $50 billion in 2024 alone, with some companies receiving valuations that seem disconnected from their actual revenue or even their path to profitability. This pattern is eerily reminiscent of the dot-com bubble of the late 1990s and early 2000s.</p>
      
      <p>The key difference, proponents argue, is that AI delivers tangible value. Unlike many dot-com companies that promised future utility, AI tools like ChatGPT and various enterprise solutions are already transforming how millions of people work. But does current utility justify current valuations?</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Lessons from Healthcare Technology</h2>
      
      <p>In my work in healthcare, I've seen firsthand how technology adoption often follows a predictable pattern. Initial enthusiasm leads to massive investment, followed by a period of disillusionment when the technology doesn't immediately deliver on all its promises. Eventually, a more realistic understanding emerges, and the technology finds its proper place in the ecosystem.</p>
      
      <p>AI in healthcare is going through this cycle right now. Early promises of AI replacing physicians have given way to more nuanced discussions about AI as a tool that augments clinical decision-making. This is healthy and necessary maturation.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Signs of Bubble Behavior</h2>
      
      <p>Several warning signs suggest we may be in bubble territory:</p>
      
      <ul class="list-disc pl-6 my-4">
        <li><strong>FOMO-driven investment:</strong> Companies are adding "AI" to their descriptions to attract funding, regardless of whether AI is central to their product</li>
        <li><strong>Unsustainable burn rates:</strong> Many AI startups are spending far more than they earn, betting on future market dominance</li>
        <li><strong>Talent wars:</strong> AI engineers command salaries that seem detached from the value they can immediately create</li>
        <li><strong>Concentration risk:</strong> A few large players control the foundational models, creating potential fragility in the ecosystem</li>
      </ul>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Case Against the Bubble Narrative</h2>
      
      <p>However, there are compelling arguments against the bubble theory. AI represents a genuine technological paradigm shift, not just incremental improvement. The productivity gains from AI are measurable and significant. Enterprise adoption is accelerating, suggesting real demand rather than speculative interest.</p>
      
      <p>Moreover, the infrastructure being built—data centers, specialized chips, new software frameworks—represents lasting value that will persist regardless of short-term market fluctuations.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">A Balanced Perspective</h2>
      
      <p>My view is nuanced. I believe AI is transformative technology with genuine long-term value. However, current valuations for many AI companies likely exceed their realistic near-term potential. This doesn't mean a dramatic crash is inevitable—a gradual correction and consolidation is equally possible.</p>
      
      <p>For investors and professionals alike, the key is to focus on fundamentals: which companies are building sustainable businesses, which applications of AI deliver genuine value, and which trends are driven by hype rather than utility.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Implications for Healthcare Professionals</h2>
      
      <p>For those of us in healthcare, this analysis has practical implications. We should embrace AI tools that genuinely improve patient care and clinical efficiency. At the same time, we should maintain healthy skepticism about AI solutions that promise more than they can deliver.</p>
      
      <p>The goal isn't to resist technological change but to adopt it thoughtfully, ensuring that innovation serves our patients and our profession rather than simply enriching investors.</p>
      
      <p>As I continue to work at the intersection of healthcare and technology, I remain optimistic about AI's potential while staying vigilant about its limitations. That balance, I believe, is the healthiest approach to navigating this transformative moment in technology history.</p>
    `
  },
  "seamless-ehr-transfers-benefits": {
    title: "The Benefits of Seamless EHR Transfers: Improving Patient Care",
    category: "HEALTHCARE",
    date: "December 10, 2025",
    readTime: "7 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: businessPost,
    content: `
      <p>As a practicing physician assistant, I've witnessed countless situations where incomplete or delayed access to patient health records has compromised care quality. The promise of electronic health records (EHRs) was to solve this problem, but fragmented systems and poor interoperability have often created new challenges. However, the movement toward seamless EHR transfers offers genuine hope for transforming patient care.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Current State of Health Information Exchange</h2>
      
      <p>Today's healthcare landscape is characterized by information silos. A patient may have records scattered across multiple providers, hospitals, and health systems, each using different EHR platforms that don't communicate effectively with each other. The result is incomplete clinical pictures, redundant testing, and potential safety risks.</p>
      
      <p>In my clinical practice, I regularly encounter patients who can't remember their complete medication lists or who are unaware of critical findings from previous visits to other providers. This fragmentation doesn't just inconvenience healthcare workers—it puts patients at risk.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">What Seamless EHR Transfer Looks Like</h2>
      
      <p>Seamless EHR transfer means that when a patient moves between providers, their complete health information follows them—instantly and accurately. This includes:</p>
      
      <ul class="list-disc pl-6 my-4">
        <li><strong>Complete medication history:</strong> Including dosages, prescribing dates, and any documented allergies or adverse reactions</li>
        <li><strong>Laboratory and imaging results:</strong> With full historical context and trends</li>
        <li><strong>Clinical notes:</strong> From specialists, primary care, and hospital encounters</li>
        <li><strong>Immunization records:</strong> Critical for preventive care</li>
        <li><strong>Social and family history:</strong> Important context for clinical decision-making</li>
      </ul>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Benefits for Patient Safety</h2>
      
      <p>The safety implications of seamless data transfer are profound. Consider a patient presenting to an emergency department with chest pain. With complete access to their cardiology records from another system, the emergency physician can immediately see previous stress test results, cardiac catheterization findings, and established treatment plans. This context can be life-saving.</p>
      
      <p>Drug-drug interactions represent another critical area. When providers can see complete medication lists across all prescribers, they can identify potentially dangerous combinations that might otherwise be missed.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Reducing Healthcare Costs</h2>
      
      <p>Redundant testing is a massive source of healthcare waste. Patients frequently undergo repeated imaging studies, laboratory panels, and diagnostic procedures because their results from other institutions aren't accessible. Seamless EHR transfer can eliminate much of this redundancy.</p>
      
      <p>Beyond direct cost savings, improved information flow can reduce hospital readmissions by ensuring that discharge summaries and follow-up plans are immediately available to outpatient providers.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Improving Clinical Efficiency</h2>
      
      <p>As a clinician, significant portions of my day are spent gathering information—calling other offices, requesting records, and waiting for faxes (yes, faxes are still common in healthcare). Seamless data transfer would reclaim this time for direct patient care.</p>
      
      <p>The documentation burden on providers could also decrease, as relevant historical information would auto-populate rather than requiring manual re-entry.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">Challenges and Considerations</h2>
      
      <p>Of course, seamless EHR transfer isn't without challenges. Privacy and security concerns are paramount—health information is among the most sensitive data types, and any transfer system must maintain rigorous protections. Patient consent frameworks need to be clear and accessible.</p>
      
      <p>Technical standards, while improving, still need work. The FHIR (Fast Healthcare Interoperability Resources) standard represents significant progress, but widespread adoption remains incomplete.</p>
      
      <h2 class="text-xl font-bold text-foreground mb-4 mt-8">The Path Forward</h2>
      
      <p>Recent federal regulations, including the 21st Century Cures Act, are pushing the industry toward greater interoperability by prohibiting "information blocking." Health systems that previously resisted data sharing are now required to enable it.</p>
      
      <p>As healthcare technology continues to evolve, seamless EHR transfer will become the norm rather than the exception. This transition represents one of the most meaningful improvements we can make to healthcare delivery—not through new treatments or procedures, but through better coordination of the care we already provide.</p>
      
      <p>For patients, this means safer, more efficient care. For providers, it means more time for what matters most: the patient relationship. And for the healthcare system as a whole, it means better outcomes at lower cost. That's a vision worth pursuing.</p>
    `
  },
  "default": {
    title: "Blog Post Not Found",
    category: "GENERAL",
    date: "December 1, 2025",
    readTime: "1 min read",
    author: "Jefney Ongeri",
    authorAvatar: "/placeholder-avatar.jpg",
    heroImage: techPost,
    content: `<p>This blog post could not be found. Please check the URL or return to the homepage.</p>`
  }
};

const popularPosts = [
  {
    title: "PSLF-Qualifying Hospitals in California & Arizona",
    category: "HEALTHCARE",
    date: "March 12, 2026",
    image: pslfPost,
    slug: "pslf-qualifying-hospitals-california-arizona"
  },
  {
    title: "The AI Bubble: Should We Be Concerned?",
    category: "TECHNOLOGY",
    date: "December 15, 2025",
    image: techPost,
    slug: "ai-bubble-concerns"
  },
  {
    title: "The Benefits of Seamless EHR Transfers",
    category: "HEALTHCARE", 
    date: "December 10, 2025",
    image: businessPost,
    slug: "seamless-ehr-transfers-benefits"
  }
];

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts[slug as keyof typeof blogPosts] || blogPosts.default;

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />
      
      <main id="main-content">
        {/* Hero Section */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img 
            src={post.heroImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="container-blog">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-blog py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-2">
              <div 
                className="prose prose-lg max-w-none text-foreground
                  prose-headings:text-foreground 
                  prose-p:text-muted-foreground 
                  prose-p:leading-relaxed
                  prose-ul:text-muted-foreground
                  prose-li:text-muted-foreground
                  prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Share */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Share this article</h3>
                <SocialShare title={post.title} />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Popular Posts */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">More Articles</h3>
                <div className="space-y-4">
                  {popularPosts
                    .filter(p => p.title !== post.title)
                    .map((popular, index) => (
                    <BlogCard
                      key={index}
                      title={popular.title}
                      category={popular.category}
                      date={popular.date}
                      image={popular.image}
                      href={`/blog/${popular.slug}`}
                      isSmall={true}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      
      <BackToTop />
      <Footer />
    </div>
  );
};

export default BlogDetail;