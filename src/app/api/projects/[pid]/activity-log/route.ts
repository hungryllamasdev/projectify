import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { pid: string } }
) {
  try {
    const { pid } = await params
    const { searchParams } = new URL(req.url)

    // Validate project ID
    if (!pid) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Parse query parameters
    const searchTerm = searchParams.get('search')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build filter conditions
    const where: any = {
      projectId: pid,
      ...(userId && userId !== 'all' && { userId })
    }

    // Date filter
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // Search filter
    if (searchTerm) {
      where.OR = [
        { task: { title: { contains: searchTerm, mode: 'insensitive' } } },
        { taskId: { contains: searchTerm } }
      ]
    }

    const activities = await prisma.activityLog.findMany({
      where,
      include: {
        user: { select: { name: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 100 // Limit results for performance
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activity log:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}