# Careers Page Builder 🚀

A high-performance, multi-tenant Careers Page Builder designed for modern recruiting teams. This platform empowers companies to showcase their culture, manage job postings, and provide a seamless application experience for candidates.

---

## 🛠 What I Built

The project is a full-stack Next.js application integrated with Supabase. Key highlights include:

- **Branding Engine**: A real-time customization suite where recruiters can define primary/secondary colors, upload logos/banners, and embed culture videos.
- **Dynamic Content Sections**: A flexible layout system using JSONB arrays in PostgreSQL, allowing for custom "About Us", "Culture", and "Values" sections.
- **Job Management Dashboard**: A full CRUD interface for recruiters to manage employment opportunities, featuring salary range inputs, dynamic "Add More" lists for items like responsibilities, and support for external application URLs.
- **Candidate Hub**: A SEO-optimized, lightning-fast public-facing careers page with advanced filtering (Search, Location, Job Type) and a sleek responsive design.
- **Security & Isolation**: Multi-tenancy implemented via Supabase Row Level Security (RLS), ensuring data isolation between different company accounts.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **package manager**: npm or pnpm
- **Database**: A Supabase project (URL and Anon Key required)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone [your-repo-url]
   cd careers-page-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   # For local development redirects
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
   ```

4. **Initialize Database**:
   - Navigate to the Supabase SQL Editor.
   - Run the scripts found in `/scripts/` in order (001 -> 002 -> 003).
   - *Optional*: Run `004_seed_sample_data.sql` to populate the dashboard with demo information.

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

---

## 📖 Step-by-Step User Guide

### 1. For Recruiters (Building Your Brand)

Step 1: **Authentication**  
Sign up at `/auth/sign-up`. After verification, you will be redirected to the setup wizard.

Step 2: **Company Setup**  
Define your company name and choose a unique **URL Slug** (e.g., `techcorp`). This slug will be your public careers page link.

Step 3: **Customize Branding**  
Navigate to the **Branding** tab. Here you can:
- Upload your Company Logo and Hero Banner.
- Set your brand's primary and secondary colors using the color picker.
- Add a punchy tagline that reflects your mission.

Step 4: **Add Job Postings**  
Go to the **Jobs** tab and click "Add Job". Fill in the title, description, and salary details. Use the dynamic "Add Item" inputs to list responsibilities and perks. You can also provide an **External Application URL** to link directly to your existing ATS. Toggle "Active" to make the job visible to candidates.

Step 5: **Publish & Share**  
Once satisfied with the **Preview**, toggle the "Publish" switch. Your page is now live at `[your-base-url]/[your-slug]/careers`.

---

### 2. For Candidates (Finding the Right Role)

Step 1: **Browse Jobs**  
Visit the company's public URL. Use the search bar to find specific roles or filter by **Location** and **Type** (Full-time, Remote, etc.).

Step 2: **View Details**  
Click on any job card to open the detailed view. Review responsibilities, qualifications, and benefits.

Step 3: **Apply**  
Hit the "Apply" button to start the submission process. If an external URL is provided, you will be seamlessly redirected to the company's application site.

---

## 📈 Improvement Plan (Roadmap)

### Phase 1: Near-Term Enhancements
- [ ] **Asset Management**: Integration with Vercel Blob for superior image handling and optimization.
- [ ] **Application Tracking (ATS)**: A dedicated dashboard for recruiters to review, score, and move candidates through hiring stages.
- [ ] **Email Automation**: Automated "Application Received" and status update emails.

### Phase 2: Scale & Insights
- [ ] **Advanced Analytics**: Visual reports on page traffic, application conversion rates, and source tracking.
- [ ] **Custom Form Builder**: Allow recruiters to add custom questions to the application process.
- [ ] **Team Permissions**: Invite multiple recruiters with granular access controls (Admin vs. Editor).

### Phase 3: Enterprise Features
- [ ] **Custom Domains**: Allow companies to point their own `careers.company.com` domains to the builder.
- [ ] **AI-Assisted Job Descriptions**: Drafting tool to help recruiters write faster and more inclusive job posts.
- [ ] **Multi-language Support**: Full i18n support for global recruitment teams.

---

## 🏗 Architecture Decisions

- **Supabase SSR**: Leverages `@supabase/ssr` to handle authentication and data fetching on the server, improving security and initial load times.
- **Zod & React Hook Form**: Robust client-side and server-side validation to ensure data integrity.
- **Lucide Icons & Framer Motion**: Used throughout the UI for a premium, interactive feel without sacrificing performance.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
