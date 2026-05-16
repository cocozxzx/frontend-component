import { ServerCrash } from 'lucide-react'
import { Link } from 'react-router'

export default function Error500Page() {
  return (
    <div className="flex-center min-h-screen bg-[hsl(var(--page-bg))]">
      <div className="w-full max-w-md rounded-2xl bg-card p-12 text-center shadow-lg border border-border">
        <div className="flex-center mb-6">
          <span className="rounded-full bg-destructive/10 p-5">
            <ServerCrash className="h-12 w-12 text-destructive" strokeWidth={1.5} />
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">500</h1>
        <p className="mt-2 text-lg font-medium text-foreground">服务器错误</p>
        <p className="mt-3 text-sm text-muted-foreground">服务器发生错误，请稍后重试</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            刷新页面
          </button>
          <Link
            to="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
