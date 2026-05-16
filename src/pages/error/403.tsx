import { ShieldOff } from 'lucide-react'
import { Link } from 'react-router'

export default function Error403Page() {
  return (
    <div className="flex-center min-h-screen bg-[hsl(var(--page-bg))]">
      <div className="w-full max-w-md rounded-2xl bg-card p-12 text-center shadow-lg border border-border">
        <div className="flex-center mb-6">
          <span className="rounded-full bg-primary/10 p-5">
            <ShieldOff className="h-12 w-12 text-primary" strokeWidth={1.5} />
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">403</h1>
        <p className="mt-2 text-lg font-medium text-foreground">无访问权限</p>
        <p className="mt-3 text-sm text-muted-foreground">您没有权限访问此页面</p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}
