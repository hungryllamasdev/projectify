"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import type { FinancialData } from "@/utils/types"

interface FinancialOverviewProps {
  data: FinancialData
}

export default function FinancialOverview({ data }: FinancialOverviewProps) {
  const totalIncome = data.items.reduce((sum, item) => (item.type === "INCOME" ? sum + Number(item.amount) : sum), 0)
  const totalExpenses = data.items.reduce((sum, item) => (item.type === "EXPENSE" ? sum + Number(item.amount) : sum), 0)
  const balance = totalIncome - totalExpenses

  const chartData = [
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpenses },
    { name: "Balance", amount: balance },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Balance</h3>
            <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

