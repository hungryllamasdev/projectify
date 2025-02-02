"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { TaskStatus } from "@prisma/client"
import type { FinancialData } from "@/utils/types"

interface KeyMetricsProps {
  data: {
    status: TaskStatus
    count: number
  }[]
  financialData: FinancialData
}

export default function KeyMetrics({ data, financialData }: KeyMetricsProps) {
  const totalBudget = financialData.budget || 0
  const totalExpenses = financialData.items.reduce(
    (sum, item) => (item.type === "EXPENSE" ? sum + Number(item.amount) : sum),
    0,
  )
  const budgetSpent = (totalExpenses / totalBudget) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">120h</div>
              <p className="text-xs text-muted-foreground">Total Hours Logged</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Budget Spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{budgetSpent.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Budget Utilization</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total Budget</p>
            </CardContent>
          </Card>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="status" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="count" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

