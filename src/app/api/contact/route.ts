import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Store in database
    await db.contactMessage.create({
      data: { name, email, phone: phone || '', subject: subject || '', message },
    });

    // Get WhatsApp number and email from settings
    const whatsappSetting = await db.siteSetting.findUnique({ where: { key: 'whatsappNumber' } });
    const emailSetting = await db.siteSetting.findUnique({ where: { key: 'contactEmail' } });
    const whatsappNumber = whatsappSetting?.value || '+923237939393';
    const contactEmail = emailSetting?.value || 'sananahmad5353@gmail.com';

    // Build WhatsApp message
    const waMessage = encodeURIComponent(
      `*New Contact Form Submission*\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      (phone ? `*Phone:* ${phone}\n` : '') +
      (subject ? `*Subject:* ${subject}\n` : '') +
      `*Message:* ${message}\n\n` +
      `---\nSent from Aurex Studio Website`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${waMessage}`;

    // Build mailto link
    const mailSubject = encodeURIComponent(subject || `New Contact: ${name}`);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${subject ? `Subject: ${subject}\n\n` : ''}Message:\n${message}\n\n---\nSent from Aurex Studio Website`
    );
    const mailtoUrl = `mailto:${contactEmail}?subject=${mailSubject}&body=${mailBody}`;

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      whatsappUrl,
      mailtoUrl,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString('utf-8');
    const admin = await db.admin.findUnique({ where: { id: decoded.split(':')[0] } });
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('markRead');

    if (id) {
      await db.contactMessage.update({ where: { id }, data: { read: true } });
      return NextResponse.json({ success: true });
    }

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString('utf-8');
    const admin = await db.admin.findUnique({ where: { id: decoded.split(':')[0] } });
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}