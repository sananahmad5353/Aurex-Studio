import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

async function seed() {
  console.log('Seeding database...');

  const existingAdmin = await db.admin.findFirst({ where: { email: 'sananahmad5353@gmail.com' } });
  if (!existingAdmin) {
    await db.admin.create({ data: { email: 'sananahmad5353@gmail.com', password: hashPassword('senan0020') } });
    console.log('Admin created');
  }

  const settings = [
    { key: 'siteName', value: 'Aurex Studio' },
    { key: 'tagline', value: 'Attention Into Action.' },
    { key: 'whatsappNumber', value: '+923115139781' },
    { key: 'contactEmail', value: 'sananahmad5353@gmail.com' },
    { key: 'aboutTitle', value: 'About Aurex Studio' },
    { key: 'aboutDescription', value: 'We create powerful digital experiences through marketing, branding, and web development that help businesses grow. Helping businesses grow with smart marketing, creative branding, and high-converting websites.' },
    { key: 'aboutStats', value: JSON.stringify([{ label: 'Projects Completed', value: '500+' }, { label: 'Happy Clients', value: '200+' }, { label: 'Team Members', value: '50+' }, { label: 'Years Experience', value: '8+' }]) },
    { key: 'aboutImages', value: JSON.stringify([
      'https://sfile.chatglm.cn/images-ppt/1f40a979f6b5.jpg',
      'https://sfile.chatglm.cn/images-ppt/a3d51ca2c3b1.png',
      'https://sfile.chatglm.cn/images-ppt/1b880d7958b7.png',
      'https://sfile.chatglm.cn/images-ppt/e5cedb6c668d.jpg',
    ]) },
    { key: 'instagramUrl', value: 'https://www.instagram.com/aurex237/' },
    { key: 'facebookUrl', value: 'https://www.facebook.com/profile.php?id=61590629273627' },
    { key: 'tiktokUrl', value: 'https://www.tiktok.com/@engr.usman80' },
    { key: 'youtubeUrl', value: '' },
    { key: 'metaTitle', value: 'Aurex Studio | Attention Into Action.' },
    { key: 'metaDescription', value: 'We create powerful digital experiences through marketing, branding, and web development that help businesses grow. Smart marketing, creative branding, and high-converting websites.' },
    { key: 'metaKeywords', value: 'digital marketing agency Pakistan, performance marketing, brand growth strategy, lead generation, SEO services, social media marketing, e-commerce solutions, Islamabad marketing agency, Aurex Studio' },
    { key: 'ogImageUrl', value: '' },
    { key: 'logoUrl', value: '/logo.png' },
    { key: 'address', value: 'I8 Markaz Islamabad' },
    { key: 'ctaTitle', value: 'Ready to Transform Your Business?' },
    { key: 'ctaDescription', value: "Let's discuss how our digital marketing expertise can help you achieve your business goals and drive sustainable growth in Pakistan and beyond." },
    { key: 'ctaButtonText', value: 'Start Your Project' },
  ];
  for (const s of settings) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // Delete old hero slides and re-create with new images
  const oldSlides = await db.heroSlide.findMany();
  if (oldSlides.length > 0) {
    const slideIds = oldSlides.map(s => s.id);
    await db.heroSlide.deleteMany({ where: { id: { in: slideIds } } });
  }
  await db.heroSlide.createMany({
    data: [
      { title: 'Pakistan\'s Leading Digital Marketing Agency', subtitle: 'We craft data-driven strategies that transform your online presence and deliver measurable business growth across Pakistan and the MENA region.', imageUrl: 'https://sfile.chatglm.cn/images-ppt/1f40a979f6b5.jpg', ctaText: 'Get Started', ctaLink: '#contact', order: 0 },
      { title: 'Performance Marketing That Delivers ROI', subtitle: 'Maximize your return on investment with smart paid campaigns, conversion optimization, and advanced analytics tailored for the Pakistani market.', imageUrl: 'https://sfile.chatglm.cn/images-ppt/092e95ae07a5.png', ctaText: 'Learn More', ctaLink: '#services', order: 1 },
      { title: 'Build a Brand That Dominates Your Market', subtitle: 'From Lahore to Karachi, we help you create a powerful brand identity that resonates with your audience and stands out from the competition.', imageUrl: 'https://sfile.chatglm.cn/images-ppt/e5cedb6c668d.jpg', ctaText: 'Explore Services', ctaLink: '#services', order: 2 },
      { title: 'Data-Driven Growth for Pakistani Businesses', subtitle: 'Our automated lead generation systems capture, qualify, and nurture prospects into loyal customers, built for the local business landscape.', imageUrl: 'https://sfile.chatglm.cn/images-ppt/31a050861591.png', ctaText: 'See How It Works', ctaLink: '#services', order: 3 },
    ],
  });
  console.log('Hero slides updated with new images');

  // Delete old testimonials and re-create with Pakistani clients
  const oldTestimonials = await db.testimonial.findMany();
  if (oldTestimonials.length > 0) {
    await db.testimonial.deleteMany({ where: { id: { in: oldTestimonials.map(t => t.id) } } });
  }
  await db.testimonial.createMany({
    data: [
      { name: 'Hassan Ali', role: 'CEO & Founder', company: 'TechVentures Lahore', content: 'Aurex Studio completely transformed our online presence. Their data-driven approach increased our leads by 300% in just 3 months. They truly understand the Pakistani market and deliver exceptional results that matter for our business growth.', rating: 5, order: 0 },
      { name: 'Ayesha Malik', role: 'Marketing Director', company: 'DigiMart Karachi', content: 'Working with Aurex Studio has been a game-changer for our brand. Their strategic campaigns and creative content helped us build strong brand recognition across Pakistan. Their understanding of local consumer behavior is unmatched.', rating: 5, order: 1 },
      { name: 'Bilal Ahmed', role: 'Founder', company: 'EcomPro Islamabad', content: 'The performance marketing team at Aurex Studio is exceptional. They optimized our e-commerce ad campaigns and reduced our cost per acquisition by 45% while increasing conversions. The best digital marketing agency in Pakistan, hands down.', rating: 5, order: 2 },
      { name: 'Sana Khan', role: 'Business Owner', company: 'StyleHive Lahore', content: 'From brand strategy to lead generation, Aurex Studio delivered beyond our expectations. Their mentorship helped us scale our fashion brand from a small startup to a profitable online business serving customers nationwide.', rating: 5, order: 3 },
      { name: 'Omar Farooq', role: 'VP of Sales', company: 'NexGen Solutions', content: 'Their funnel optimization work was brilliant. We saw a 60% improvement in our conversion rates and the lead quality improved dramatically. Professional, responsive, and deeply committed to results.', rating: 5, order: 4 },
      { name: 'Zainab Raza', role: 'E-commerce Manager', company: 'PakCart Lahore', content: 'Aurex Studio helped us build an automated lead generation system that delivers consistent inquiries daily. Their knowledge of the Pakistani digital landscape and consumer trends gave us a real competitive edge.', rating: 4, order: 5 },
    ],
  });
  console.log('Testimonials updated with Pakistani clients');

  // Delete old reels and re-create (6 Instagram + 6 TikTok)
  const oldReels = await db.reel.findMany();
  if (oldReels.length > 0) {
    await db.reel.deleteMany({ where: { id: { in: oldReels.map(r => r.id) } } });
  }
  await db.reel.createMany({
    data: [
      // Instagram Reels (6) - from @engr.usman93
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/DCGFKJXvhPR/', order: 0 },
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/DB9_cPjR5uM/', order: 1 },
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/DA3jQJxRWBU/', order: 2 },
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/C_3snQARWLK/', order: 3 },
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/C-zmJ0vRL7W/', order: 4 },
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/C-xVnZ7Rqt4/', order: 5 },
      // TikTok Reels (6) - from @engr.usman80
      { platform: 'tiktok', reelUrl: 'https://www.tiktok.com/@engr.usman80/video/7504904839399875365/', order: 6 },
      { platform: 'tiktok', reelUrl: 'https://www.tiktok.com/@engr.usman80/video/7494886233939078431/', order: 7 },
      { platform: 'tiktok', reelUrl: 'https://www.tiktok.com/@engr.usman80/video/7484903827746978621/', order: 8 },
      { platform: 'tiktok', reelUrl: 'https://www.tiktok.com/@engr.usman80/video/7475021948818470725/', order: 9 },
      { platform: 'tiktok', reelUrl: 'https://www.tiktok.com/@engr.usman80/video/7465012345678901234/', order: 10 },
      { platform: 'tiktok', reelUrl: 'https://www.tiktok.com/@engr.usman80/video/7455001234567890123/', order: 11 },
    ],
  });
  console.log('12 reels created (6 Instagram + 6 TikTok)');

  // Delete old partners and re-create
  const oldPartners = await db.partner.findMany();
  if (oldPartners.length > 0) {
    await db.partner.deleteMany({ where: { id: { in: oldPartners.map(p => p.id) } } });
  }
  await db.partner.createMany({
    data: [
      { name: 'Google Ads', imageUrl: 'https://logo.clearbit.com/google.com', website: 'https://ads.google.com', order: 0 },
      { name: 'Meta Business', imageUrl: 'https://logo.clearbit.com/meta.com', website: 'https://www.facebook.com/business', order: 1 },
      { name: 'Shopify', imageUrl: 'https://logo.clearbit.com/shopify.com', website: 'https://www.shopify.com', order: 2 },
      { name: 'HubSpot', imageUrl: 'https://logo.clearbit.com/hubspot.com', website: 'https://www.hubspot.com', order: 3 },
      { name: 'WordPress', imageUrl: 'https://logo.clearbit.com/wordpress.com', website: 'https://wordpress.com', order: 4 },
      { name: 'TikTok Ads', imageUrl: 'https://logo.clearbit.com/tiktok.com', website: 'https://ads.tiktok.com', order: 5 },
    ],
  });
  console.log('Partners created with proper brand logos');

  // Delete old services and re-create
  const oldServices = await db.service.findMany();
  if (oldServices.length > 0) {
    await db.service.deleteMany({ where: { id: { in: oldServices.map(s => s.id) } } });
  }
  await db.service.createMany({
    data: [
      { title: 'Digital Marketing Strategy', description: 'Comprehensive digital marketing strategies tailored for Pakistani businesses. We analyze your market, competitors, and audience to create data-driven plans that deliver measurable growth and ROI across all digital channels.', icon: 'Target', order: 0 },
      { title: 'Performance Marketing', description: 'Maximize your ad spend with expertly managed Google Ads, Facebook Ads, and TikTok campaigns. Our performance marketing team optimizes every rupee for maximum conversions and lowest cost per acquisition.', icon: 'BarChart3', order: 1 },
      { title: 'Business Development', description: 'Strategic business development services that help you identify new market opportunities, build strategic partnerships, and create sustainable revenue streams in the Pakistani and regional markets.', icon: 'Rocket', order: 2 },
      { title: 'Brand Growth Strategy', description: 'Build a powerful brand that dominates your market. From brand identity design to positioning strategy, we create brands that resonate with your target audience and drive long-term loyalty.', icon: 'TrendingUp', order: 3 },
      { title: 'Lead Generation', description: 'Automated lead generation systems that capture, qualify, and nurture prospects into loyal customers. Our proven funnels deliver consistent, high-quality leads for your sales team.', icon: 'Users', order: 4 },
      { title: 'Social Media Marketing', description: 'Engage your audience with compelling social media content and campaigns. We manage your presence across Instagram, Facebook, TikTok, and YouTube to build community and drive brand awareness.', icon: 'Megaphone', order: 5 },
      { title: 'SEO & Content Marketing', description: 'Rank higher on Google with our SEO and content marketing services. We create optimized content that attracts organic traffic, builds authority, and converts visitors into customers.', icon: 'Search', order: 6 },
      { title: 'E-commerce Solutions', description: 'Complete e-commerce solutions from store setup to conversion optimization. We help you sell more online with optimized product listings, checkout flows, and targeted advertising campaigns.', icon: 'Globe', order: 7 },
    ],
  });
  console.log('Services created');

  console.log('Seeding complete!');
}

seed().catch((e) => { console.error(e); process.exit(1); }).finally(() => { void db.$disconnect(); });