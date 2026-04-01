import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, firstName, role, company } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    await prisma.waitlistEntry.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        firstName: firstName ?? undefined,
        role: role ?? undefined,
        company: company ?? undefined,
      },
      create: {
        email: email.toLowerCase().trim(),
        firstName: firstName ?? null,
        role: role ?? null,
        company: company ?? null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
