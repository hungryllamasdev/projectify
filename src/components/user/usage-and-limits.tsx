import { Progress } from '@/components/ui/progress'

const usageData = [
  { name: 'Active Projects', current: 15, limit: 20 },
  { name: 'Team Members', current: 8, limit: 10 },
  { name: 'Storage Used', current: 75, limit: 100, unit: 'GB' },
]

export function UsageAndLimits() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Usage & Limits</h2>
      <div className="space-y-6">
        {usageData.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-500">
                {item.current} / {item.limit} {item.unit}
              </span>
            </div>
            <Progress value={(item.current / item.limit) * 100} />
            {item.current / item.limit > 0.8 && (
              <p className="text-sm text-yellow-600 mt-1">
                Approaching limit. Consider upgrading.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

