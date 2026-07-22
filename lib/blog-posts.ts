export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  slug: string;
  content: string;
}

export const posts: BlogPost[] = [
  {
    title: "How to collect testimonials that actually convert",
    excerpt: "Not all testimonials are created equal. Learn the framework for asking customers the right questions to get powerful, conversion-driving social proof.",
    date: "July 12, 2026",
    author: "Alex Rivera",
    category: "Guides",
    slug: "how-to-collect-testimonials",
    content: `
      <p>The difference between a testimonial that gets glanced over and one that drives 20% more conversions often comes down to three things: specificity, context, and placement.</p>

      <h2>Ask for specifics, not adjectives</h2>
      <p>Instead of "How do you feel about our product?", try "What was the specific outcome you achieved in the first 30 days?" Specific outcomes like "cut onboarding time by 40%" are far more credible than generic praise.</p>

      <h2>Capture the before and after</h2>
      <p>The most powerful testimonials include a clear baseline. "I used to spend 4 hours a week on reporting. Now it takes 20 minutes." That contrast is what buyers use to justify their own decision.</p>

      <h2>Place testimonials near the point of friction</h2>
      <p>Don't hide reviews on a dedicated page. Put relevant testimonials near pricing, signup forms, and checkout. A testimonial about "easy setup" next to your signup button reduces friction at the exact moment it matters.</p>

      <h2>Collect continuously</h2>
      <p>Drip campaigns, post-purchase emails, and in-app prompts all work. The key is timing: ask while the experience is fresh, ideally within 24 to 48 hours of a key milestone.</p>

      <h2>Use video when you can</h2>
      <p>A 30-second video testimonial from a recognizable customer is worth three text quotes. Video carries tone, expression, and trust signals that text simply cannot replicate.</p>
    `,
  },
  {
    title: "Why video testimonials are the future of SaaS marketing",
    excerpt: "Text reviews are great, but video builds authentic trust. See how adding just 3 video testimonials to your landing page can boost conversions by 30%.",
    date: "June 24, 2026",
    author: "Sarah Chen",
    category: "Marketing",
    slug: "video-testimonials-future",
    content: `
      <p>Video testimonials are no longer a nice-to-have. For SaaS brands, they are becoming one of the highest-ROI assets on a landing page.</p>

      <h2>Trust is visual</h2>
      <p>Buyers read with their eyes, but they trust with their gut. A real person speaking directly to the camera triggers mirror neurons and builds credibility faster than any written review.</p>

      <h2>Length matters</h2>
      <p>Short-form video testimonials between 20 and 60 seconds perform best. They are long enough to show authenticity, but short enough to hold attention on a fast-loading page.</p>

      <h2>The 3-video rule</h2>
      <p>Research and A/B tests consistently show that adding 3 video testimonials to a landing page can increase conversion rates by up to 30%. The key is variety: short-form, long-form, and screen-capture with voiceover.</p>

      <h2>Production tips</h2>
      <p>You don't need a studio. Good lighting, a clean background, and a natural tone outperform overproduced corporate videos. Ask customers to speak in their own words, from their own desk.</p>
    `,
  },
  {
    title: "Social proof best practices for 2026",
    excerpt: "From Shadow DOM isolation to AI tagging, discover the modern technical and psychological strategies for leveraging customer love.",
    date: "June 5, 2026",
    author: "Alex Rivera",
    category: "Strategy",
    slug: "social-proof-best-practices",
    content: `
      <p>Social proof has evolved. In 2026, it is less about slapping a few quotes on a homepage and more about embedding trust throughout the entire buyer journey.</p>

      <h2>Match proof to the stage</h2>
      <p>Awareness-stage visitors need broad trust signals: logos, star ratings, and aggregate stats. Decision-stage visitors need specific outcomes, case studies, and peer comparisons. Serve different proof formats at each stage.</p>

      <h2>Make it real-time</h2>
      <p>Static testimonials age. Live counters, recent activity feeds, and real-time review streams keep your social proof feeling current and alive.</p>

      <h2>Technical discipline</h2>
      <p>Widgets should use Shadow DOM isolation to avoid CSS conflicts. Embed scripts should be async and non-blocking. Caching should respect invalidation so updates appear instantly.</p>

      <h2>What is coming next</h2>
      <p>AI-powered tagging, sentiment analysis, and auto-curation are on the horizon. Expect widgets that automatically surface the most relevant testimonials based on visitor context.</p>
    `,
  },
  {
    title: "How we built WallProud to be the fastest widget on the web",
    excerpt: "A deep dive into our architecture, edge caching, and why we chose Shadow DOM to guarantee zero style conflicts and sub-100ms load times.",
    date: "May 18, 2026",
    author: "James Wilson",
    category: "Engineering",
    slug: "building-fastest-widget",
    content: `
      <p>Speed is a feature. When we set out to build WallProud, we wanted embed scripts that load fast, render instantly, and never break your site's design.</p>

      <h2>Edge runtime embed scripts</h2>
      <p>Every widget script is generated on the edge, cached aggressively, and served with proper CORS headers. This means the script body is essentially static HTML plus CSS, with no runtime JS dependencies beyond a tiny self-invoking function.</p>

      <h2>Shadow DOM isolation</h2>
      <p>We render each widget inside a Shadow DOM root. This guarantees that your site's Tailwind, Bootstrap, or custom CSS never leaks into the widget, and the widget's styles never leak out. Zero style conflicts, guaranteed.</p>

      <h2>Inlined assets</h2>
      <p>Instead of loading external CSS files or web fonts, we inline everything into the embed script. The tradeoff is a slightly larger script payload, but the win is a single network request and no render-blocking stylesheets.</p>

      <h2>Sub-100ms Time to Interactive</h2>
      <p>By keeping the payload lean, avoiding runtime dependencies, and caching at the edge, most WallProud widgets reach interactive state in under 100ms on a good connection.</p>
    `,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
