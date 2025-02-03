import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { pid: string } }) {
  try {
    const { pid } = await params;
    if (!pid) return NextResponse.json({ error: "Project ID missing" }, { status: 400 });

    const body = await request.json();
    const { budget } = body;

    const updatedProject = await prisma.project.update({
      where: { id: pid },
      data: { budget: Number(budget) },
      include: { financialItems: true },
    });

    return NextResponse.json({
      budget: updatedProject.budget,
      items: updatedProject.financialItems,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}