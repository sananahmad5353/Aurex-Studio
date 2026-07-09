import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

async function seed() {
  console.log('Seeding database...');

  const existingAdmin = await db.admin.findFirst({ where: { email: 'sananahmad5353@gmail.com' } });
  if (!existingAdmin) {
    await db.admin.create({ email: 'sananahmad5353@gmail.com', password: hashPassword('senan0020') });
    console.log('Admin created');
  }

  const settings = [
    { key: 'siteName', value: 'Aurex Studio' },
    { key: 'tagline', value: 'Elevate Your Digital Presence' },
    { key: 'whatsappNumber', value: '+923237939393' },
    { key: 'contactEmail', value: 'sananahmad5353@gmail.com' },
    { key: 'aboutTitle', value: 'About Aurex Studio' },
    { key: 'aboutDescription', value: 'Aurex Studio is a full-service digital marketing agency based in Pakistan, dedicated to helping businesses grow their online presence. With data-driven strategies, creative excellence, and deep understanding of the local market, we deliver measurable results that drive real business growth. Our team of experts combines cutting-edge technology with proven marketing methodologies to create campaigns that convert and build lasting brand value.' },
    { key: 'aboutStats', value: JSON.stringify([{ label: 'Projects Completed', value: '500+' }, { label: 'Happy Clients', value: '200+' }, { label: 'Team Members', value: '50+' }, { label: 'Years Experience', value: '8+' }]) },
    { key: 'aboutImages', value: JSON.stringify([
      'https://sfile.chatglm.cn/images-ppt/1f40a979f6b5.jpg',
      'https://sfile.chatglm.cn/images-ppt/a3d51ca2c3b1.png',
      'https://sfile.chatglm.cn/images-ppt/1b880d7958b7.png',
      'https://sfile.chatglm.cn/images-ppt/e5cedb6c668d.jpg',
    ]) },
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

  // Delete old reels and re-create
  const oldReels = await db.reel.findMany();
  if (oldReels.length > 0) {
    await db.reel.deleteMany({ where: { id: { in: oldReels.map(r => r.id) } } });
  }
  await db.reel.createMany({
    data: [
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/C8pGkVhM_qZ/', order: 0 },
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/C6W4qZJM1sR/', order: 1 },
      { platform: 'tiktok', reelUrl: 'https://www.tiktok.com/@garyvee/video/7275286284979773984/', order: 2 },
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/C5vPp8YMS8X/', order: 3 },
      { platform: 'tiktok', reelUrl: 'https://www.tiktok.com/@digitalmarketinghub/video/7304613203273774891/', order: 4 },
      { platform: 'instagram', reelUrl: 'https://www.instagram.com/reel/C4xPpbPMmhS/', order: 5 },
    ],
  });
  console.log('Sample reels created');

  console.log('Seeding complete!');
}

seed().catch((e) => { console.error(e); process.exit(1); }).finally(() => { void db.$disconnect(); });