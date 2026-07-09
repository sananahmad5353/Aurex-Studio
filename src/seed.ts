import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

async function seed() {
  console.log('Seeding database...');

  const existingAdmin = await db.admin.findFirst({ where: { email: 'sananahmad5353@gmail.com' } });
  if (!existingAdmin) {
    await db.admin.create({
      data: { email: 'sananahmad5353@gmail.com', password: hashPassword('senan0020') },
    });
    console.log('Admin created');
  }

  const settings = [
    { key: 'siteName', value: 'Aurex Studio' },
    { key: 'tagline', value: 'Elevate Your Digital Presence' },
    { key: 'whatsappNumber', value: '+923237939393' },
    { key: 'contactEmail', value: 'sananahmad5353@gmail.com' },
    { key: 'aboutTitle', value: 'About Aurex Studio' },
    { key: 'aboutDescription', value: 'We are a full-service digital marketing agency dedicated to helping businesses grow their online presence. With data-driven strategies and creative excellence, we deliver measurable results that drive real business growth. Our team of experts combines cutting-edge technology with proven marketing methodologies to create campaigns that convert.' },
    { key: 'aboutStats', value: JSON.stringify([{ label: 'Projects Completed', value: '500+' }, { label: 'Happy Clients', value: '200+' }, { label: 'Team Members', value: '50+' }, { label: 'Years Experience', value: '8+' }]) },
    { key: 'ctaTitle', value: 'Ready to Transform Your Business?' },
    { key: 'ctaDescription', value: "Let's discuss how our digital marketing expertise can help you achieve your business goals and drive sustainable growth." },
    { key: 'ctaButtonText', value: 'Start Your Project' },
  ];
  for (const s of settings) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  if ((await db.heroSlide.count()) === 0) {
    await db.heroSlide.createMany({
      data: [
        { title: 'Digital Marketing That Drives Real Results', subtitle: 'We craft data-driven strategies that transform your online presence and deliver measurable business growth.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80&auto=format&fit=crop', ctaText: 'Get Started', ctaLink: '#contact', order: 0 },
        { title: 'Scale Your Business with Performance Marketing', subtitle: 'Maximize your ROI with smart paid campaigns, conversion optimization, and advanced analytics across all channels.', imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1920&q=80&auto=format&fit=crop', ctaText: 'Learn More', ctaLink: '#services', order: 1 },
        { title: 'Build a Brand That Stands Out', subtitle: 'From strategy to execution, we help you create a powerful brand identity that resonates with your audience.', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop', ctaText: 'Explore Services', ctaLink: '#services', order: 2 },
        { title: 'Generate Leads That Convert to Revenue', subtitle: 'Our automated lead generation systems capture, qualify, and nurture prospects into loyal customers.', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80&auto=format&fit=crop', ctaText: 'See How It Works', ctaLink: '#services', order: 3 },
      ],
    });
    console.log('Hero slides created');
  }

  if ((await db.service.count()) === 0) {
    await db.service.createMany({
      data: [
        { title: 'Digital Marketing Strategy', description: 'Build clear campaigns that target audiences, increase visibility, improve engagement, and generate consistent business growth results monthly.', icon: 'Target', order: 0 },
        { title: 'Performance Marketing', description: 'Run paid ads with smart budgets, optimize conversions, track returns, and scale profitable campaigns across channels effectively.', icon: 'BarChart3', order: 1 },
        { title: 'Business Development', description: 'Create growth opportunities through partnerships, outreach systems, market research, and strategies that increase long term revenue steadily.', icon: 'TrendingUp', order: 2 },
        { title: 'Brand Growth Strategy', description: 'Strengthen market presence with positioning, messaging, audience trust, and campaigns that build lasting recognition for businesses.', icon: 'Rocket', order: 3 },
        { title: 'Lead Generation Systems', description: 'Develop automated systems that capture prospects, qualify leads, and deliver steady inquiries for your sales team daily.', icon: 'Users', order: 4 },
        { title: 'Funnel Optimization', description: 'Improve every funnel step to reduce drop offs, increase conversions, and maximize customer lifetime value efficiently.', icon: 'Filter', order: 5 },
        { title: 'Client Acquisition Strategy', description: 'Use proven outreach methods, nurturing flows, and sales processes to win high value clients consistently online.', icon: 'Handshake', order: 6 },
        { title: 'Mentorship & Business Consulting', description: 'Get expert guidance, practical plans, and personalized advice to solve challenges and grow faster confidently.', icon: 'Lightbulb', order: 7 },
      ],
    });
    console.log('Services created');
  }

  if ((await db.partner.count()) === 0) {
    await db.partner.createMany({
      data: [
        { name: 'Google Partners', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', website: 'https://www.google.com', order: 0 },
        { name: 'Meta Business', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png', website: 'https://www.meta.com', order: 1 },
        { name: 'HubSpot', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/HubSpot_Logo.svg', website: 'https://www.hubspot.com', order: 2 },
        { name: 'Shopify', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Shopify_logo_2022.svg', website: 'https://www.shopify.com', order: 3 },
        { name: 'Stripe', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo_%282018%29.svg', website: 'https://stripe.com', order: 4 },
        { name: 'Mailchimp', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Mailchimp_logo.svg', website: 'https://mailchimp.com', order: 5 },
      ],
    });
    console.log('Partners created');
  }

  if ((await db.testimonial.count()) === 0) {
    await db.testimonial.createMany({
      data: [
        { name: 'Ahmed Khan', role: 'CEO', company: 'TechVentures PK', content: 'Aurex Studio completely transformed our online presence. Their data-driven approach increased our leads by 300% in just 3 months. The team is incredibly responsive and truly understands digital marketing.', rating: 5, order: 0 },
        { name: 'Sarah Mitchell', role: 'Marketing Director', company: 'GrowthLab', content: 'Working with Aurex Studio has been a game-changer for our brand. Their strategic campaigns and creative content helped us build strong brand recognition and double our customer base.', rating: 5, order: 1 },
        { name: 'Ali Raza', role: 'Founder', company: 'EcomPro', content: 'The performance marketing team at Aurex Studio is exceptional. They optimized our ad campaigns and reduced our cost per acquisition by 45% while increasing conversions. Highly recommended!', rating: 5, order: 2 },
        { name: 'Fatima Noor', role: 'Business Owner', company: 'StyleHive', content: 'From brand strategy to lead generation, Aurex Studio delivered beyond our expectations. Their mentorship and consulting helped us scale from a startup to a profitable business.', rating: 4, order: 3 },
        { name: 'James Peterson', role: 'VP of Sales', company: 'NexGen Solutions', content: 'Their funnel optimization work was brilliant. We saw a 60% improvement in our conversion rates and the lead quality improved dramatically. Professional and results-oriented team.', rating: 5, order: 4 },
        { name: 'Hina Shahid', role: 'E-commerce Manager', company: 'DigiMart', content: 'Aurex Studio helped us build an automated lead generation system that delivers consistent inquiries daily. Their business development strategies opened doors we never knew existed.', rating: 5, order: 5 },
      ],
    });
    console.log('Testimonials created');
  }

  console.log('Seeding complete!');
}

seed().catch((e) => { console.error(e); process.exit(1); }).finally(() => { void db.$disconnect(); });