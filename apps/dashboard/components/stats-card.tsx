import React from 'react'
import { Card, CardContent, CardTitle } from './ui/card'

export default function StatsCard({ title, value }: { value: string | number, title: string }) {
  return (
    <Card className="w-full min-h-28 pb-0 mb-0">
      <CardContent className="flex flex-col gap-3 h-full py-4">
        <CardTitle>{title}</CardTitle>
        <p className="text-[clamp(1.5rem, 5vw, 2rem)] font-bold leading-relaxed">{value}</p>
      </CardContent>
    </Card>
  )
}
