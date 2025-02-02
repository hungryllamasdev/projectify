import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { FinancialItemType, Frequency } from "@prisma/client"

export async function GET(request: Request, { params }: { params: { pid: string } }) {
  try {
    const { pid } = await params;
    const project = await prisma.project.findUnique({
      where: { id: pid },
      include: { financialItems: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      budget: project.budget,
      items: project.financialItems,
    });
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { pid: string } }) {
  try {
    const { pid } = await params;
    const body = await request.json();
    const { type, category, description, amount, frequency, linkedTo, date } = body;

    const newItem = await prisma.financialItem.create({
      data: {
        projectId: pid,
        type: type as FinancialItemType,
        category,
        description,
        amount: Number(amount),
        frequency: frequency as Frequency,
        linkedTo,
        date: new Date(date),
      },
    });

    const updatedProject = await prisma.project.findUnique({
      where: { id: pid },
      include: { financialItems: true },
    });

    return NextResponse.json({
      budget: updatedProject?.budget,
      items: updatedProject?.financialItems,
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding financial item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}