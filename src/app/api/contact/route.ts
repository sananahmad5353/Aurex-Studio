import { db } from '@/lib/db';
import { validateContactForm, sanitizeString } from '@/lib/validate';
import { getClientIp } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateContactForm(body);

    if (validated.errors.length > 0) {
      return NextResponse.json({ error: validated.errors[0] }, { status: 400 });
    }

    // Store in database (values already sanitized)
    await db.contactMessage.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        subject: validated.subject,
        message: validated.message,
      },
    });

    // Get WhatsApp number and email from settings
    const [whatsappSetting, emailSetting] = await Promise.all([
      db.siteSetting.findUnique({ where: { key: 'whatsappNumber' } }),
      db.siteSetting.findUnique({ where: { key: 'contactEmail' } }),
    ]);
    const whatsappNumber = sanitizeString(whatsappSetting?.value || '+923115139781', 20);
    const contactEmail = sanitizeString(emailSetting?.value || 'sananahmad5353@gmail.com', 254);

    // Build WhatsApp message (values already sanitized above)
    const waMessage = encodeURIComponent(
      `*New Contact Form Submission*\n\n` +
      `*Name:* ${validated.name}\n` +
      `*Email:* ${validated.email}\n` +
      (validated.phone ? `*Phone:* ${validated.phone}\n` : '') +
      (validated.subject ? `*Subject:* ${validated.subject}\n` : '') +
      `*Message:* ${validated.message}\n\n` +
      `---\nSent from Aurex Studio Website`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${waMessage}`;

    // Build mailto link
    const mailSubject = encodeURIComponent(validated.subject || `New Contact: ${validated.name}`);
    const mailBody = encodeURIComponent(
      `Name: ${validated.name}\nEmail: ${validated.email}\n${validated.phone ? `Phone: ${validated.phone}\n` : ''}${validated.subject ? `Subject: ${validated.subject}\n\n` : ''}Message:\n${validated.message}\n\n---\nSent from Aurex Studio Website`
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

    // Import verifyAuthToken dynamically
    const { verifyAuthToken } = await import('@/lib/auth');
    const payload = verifyAuthToken(authHeader.replace('Bearer ', ''));
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await db.admin.findUnique({ where: { id: payload.adminId } });
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('markRead');

    if (id) {
      // Sanitize the ID (should be a cuid)
      if (!/^[a-z0-9]+$/.test(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
      }
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

    const { verifyAuthToken } = await import('@/lib/auth');
    const payload = verifyAuthToken(authHeader.replace('Bearer ', ''));
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await db.admin.findUnique({ where: { id: payload.adminId } });
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || !/^[a-z0-9]+$/.test(id)) {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 });
    }
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}