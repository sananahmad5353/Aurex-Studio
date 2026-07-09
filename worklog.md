---
Task ID: 1
Agent: main
Task: Add reels from Instagram/TikTok with admin control, fix partner images, add social icons to footer, update contact form subject to dropdown

Work Log:
- Read all current project files to understand state
- Fixed AdminPanel fetchData to include /api/reels fetch (was missing, causing empty reels tab)
- Added Instagram URL, TikTok URL, YouTube URL fields to admin Settings tab
- Added YouTube option to reels platform dropdown in admin panel
- Fixed TrustedPartners component with image error handling (onError fallback to text display)
- Added 6 partner seeds with working image URLs (Google Ads, Meta Business, Shopify, HubSpot, WordPress, TikTok Ads)
- Added social media URL settings to seed (instagram: engr.usman93, tiktok: engr.usman80)
- Updated Footer with Instagram (gradient hover), TikTok, and YouTube (red hover) SVG icons
- Updated ContactForm subject field from text input to dropdown with services list + "Other" option
- When "Other" selected, a custom subject input appears with animation
- Updated SocialReels with YouTube embed support, profile follow buttons, and proper platform icons
- Updated page.tsx to pass services, instagramUrl, tiktokUrl, youtubeUrl as props
- Added 8 service seeds to replace data lost during db reset
- Re-seeded database and verified all data via /api/public endpoint
- Build succeeded with zero errors

Stage Summary:
- All 8 changes implemented and build-verified
- Admin panel now fully manages reels (create/edit/delete with Instagram/TikTok/YouTube platform support)
- Footer has 3 social icons (Instagram with gradient hover, TikTok, YouTube with red hover)
- Contact form has dropdown subject list populated from services + "Other" custom input option
- Partner images now gracefully fall back to text name when image fails to load
- Social media URLs (Instagram/TikTok/YouTube) manageable from admin Settings tab