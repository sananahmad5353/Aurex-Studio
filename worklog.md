---
Task ID: 2
Agent: main
Task: Multi-page architecture, SEO metadata, logo upload, Google Maps, admin management

Work Log:
- Converted single-page app to multi-page architecture (6 separate pages)
- Created SiteShell shared layout component (Navbar + Footer + WhatsApp + AdminPanel)
- Updated Navbar with Next.js Link routing, usePathname for active states, logo support
- Created 5 new pages with server-side generateMetadata for SEO: /about, /services, /contact, /reels, /reviews
- Each page has gradient header with breadcrumb navigation (Home > Page Name)
- Home page shows hero, partners, services, about preview, 3 review cards, reels CTA banner, CTA section
- Added Google Maps embed to /contact page (I-8 Markaz, Islamabad)
- Contact page includes address card, phone, email, WhatsApp, social links sidebar
- Created /api/upload/logo API with sharp auto-resize (logo, logo-lg, favicon, og-image in WebP)
- Accepts any format (PNG, JPG, SVG, WebP, GIF, BMP), max 10MB, auto-transparent/white background
- Added SEO & Logo tab to admin panel (meta title, description, keywords, OG image, address, logo upload)
- Updated Footer links from hash (#) to actual page routes (/)
- Added Reels and Reviews to footer quick links
- Removed cache-control meta tags from root layout (hurts SEO)
- Added SEO settings to seed: metaTitle, metaDescription, metaKeywords, address, logoUrl, ogImageUrl
- Made ContactForm support minimal mode (for embedding in contact page without section wrapper)
- Verified all 6 pages return HTTP 200 with proper SEO metadata in HTML

Stage Summary:
- 6 pages: /, /about, /services, /contact, /reels, /reviews
- Full SEO: unique title, description, keywords, OG tags, Twitter cards per page
- Logo upload: any format/size, auto-resized to 4 sizes (200x200, 400x400, 32x32, 1200x630)
- Google Maps: embedded at /contact with I-8 Markaz, Islamabad location
- All manageable from admin panel SEO & Logo tab
- Footer and Navbar use page routes (no hash links)