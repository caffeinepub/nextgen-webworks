# Nextgen Webworks Agency Portfolio

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full single-page agency portfolio website for "Nextgen Webworks"
- Hero section with agency name, tagline, headline, description, and two CTA buttons
- Services section with 6 animated cards (Website Making, AI Receptionist, AI Assistant, Website Editing & Redesign, Social Media Management, Video Ads Creation)
- Portfolio section with statement about 50+ websites and two project cards with external links
- Stats/Achievements section with animated counters (50+ websites, 20+ countries, 100+ clients, 8 days delivery)
- Client Reviews section with 4 testimonials and star ratings, overall 4.9/5 average
- Order Your Website section with a multi-field form (name, email, business name, country, service type, business type, features, design style, budget range) and submit button
- About Us section with agency description and 3 founder profiles (Vinay, Bhavya, Aarav)
- Contact section with contact form, email, social media links
- Smooth scroll navigation between sections
- Backend: store order form submissions and contact form submissions in Motoko canister

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Select no external Caffeine components (no auth, storage, email needed)
2. Generate Motoko backend with two stable stores: project order requests and contact messages
3. Build full frontend:
   - Sticky dark navbar with nav links and CTA
   - Hero section with animated text and dual CTAs
   - Services section with hover-animated cards using tech icons
   - Portfolio section with project cards and external links
   - Stats section with intersection-observer animated counters
   - Testimonials section with star ratings
   - Order form section with all specified fields, connected to backend
   - About section with founder cards
   - Contact section with form and social links, connected to backend
   - Footer
   - Scroll animations via framer-motion or CSS transitions
   - Fully responsive mobile layout
