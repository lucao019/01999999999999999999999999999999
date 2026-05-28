"use client"

import { CodeXml } from "lucide-react"

export function MonstroLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/40 bg-red-600/20 text-red-500 shadow-lg shadow-red-900/30">
        <CodeXml className="h-6 w-6" />
      </div>
    </div>
  )
}

export function MonstroLogoIcon() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-red-500/40 bg-red-600/20 text-red-500 shadow-lg shadow-red-900/30">
      <CodeXml className="h-9 w-9" />
    </div>
  )
}