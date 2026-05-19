import { useState } from 'react'
import { RotateCw, Download } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageContainer } from '@/components/layout/PageContainer'
import { StatCard } from '@/components/charts/StatCard'
import { LineChart } from '@/components/charts/LineChart'
import { PieChart } from '@/components/charts/PieChart'
import { AppTable } from '@/components/base/AppTable'
import { Timeline, TimelineItem } from '@/components/display/Timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TREND_DATA = {
  users: [3200, 4100, 3800, 5200, 4800, 6100, 5900, 7200, 6800, 8100, 9200, 12846],
  orders: [820, 950, 1100, 980, 1240, 1380, 1520, 1680, 1900, 2200, 2800, 3210],
  revenue: [68000, 72000, 95000, 88000, 112000, 98000, 135000, 142000, 168000, 195000, 238000, 248560],
  online: [94.2, 95.1, 96.0, 94.8, 96.5, 97.1, 96.3, 97.8, 96.9, 97.2, 96.5, 96.8],
}

const VISIT_DATA = [
  { day: '05-13', visits: 4200, registers: 320 },
  { day: '05-14', visits: 5800, registers: 410 },
  { day: '05-15', visits: 5200, registers: 380 },
  { day: '05-16', visits: 6100, registers: 520 },
  { day: '05-17', visits: 7300, registers: 490 },
  { day: '05-18', visits: 6800, registers: 440 },
  { day: '05-19', visits: 8200, registers: 610 },
]

const SOURCE_DATA = [
  { name: '直接访问', value: 335 },
  { name: '搜索引擎', value: 510 },
  { name: '社交媒体', value: 234 },
  { name: '其他', value: 135 },
]

const statusClass: Record<string, string> = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  destructive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

interface Order {
  id: string
  customer: string
  amount: string
  status: 'success' | 'warning' | 'destructive'
  statusText: string
  time: string
}

const ORDER_DATA: Order[] = [
  { id: 'ORD-2024-001', customer: '张三', amount: '¥ 1,280.00', status: 'success', statusText: '已完成', time: '2026-05-19 09:12' },
  { id: 'ORD-2024-002', customer: '李四', amount: '¥ 560.00', status: 'warning', statusText: '待发货', time: '2026-05-19 10:35' },
  { id: 'ORD-2024-003', customer: '王五', amount: '¥ 3,450.00', status: 'success', statusText: '已完成', time: '2026-05-19 11:08' },
  { id: 'ORD-2024-004', customer: '赵六', amount: '¥ 890.00', status: 'destructive', statusText: '已退款', time: '2026-05-19 12:22' },
  { id: 'ORD-2024-005', customer: '孙七', amount: '¥ 2,100.00', status: 'warning', statusText: '待付款', time: '2026-05-19 13:45' },
]

const ORDER_COLUMNS: ColumnDef<Order, unknown>[] = [
  { accessorKey: 'id', header: '订单号' },
  { accessorKey: 'customer', header: '客户' },
  { accessorKey: 'amount', header: '金额' },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass[row.original.status]}`}>
        {row.original.statusText}
      </span>
    ),
  },
  { accessorKey: 'time', header: '时间' },
]

const TIMELINE_ITEMS = [
  { time: '13:45', desc: '新订单 ORD-2024-005 待付款', color: 'warning' as const },
  { time: '12:22', desc: '订单 ORD-2024-004 申请退款', color: 'error' as const },
  { time: '11:08', desc: '设备 Device-007 上线', color: 'success' as const },
  { time: '10:35', desc: '新用户「李四」完成注册', color: 'primary' as const },
  { time: '09:58', desc: '系统完成每日数据备份', color: 'success' as const },
  { time: '09:12', desc: '订单 ORD-2024-001 已完成', color: 'success' as const },
  { time: '08:30', desc: '管理员「admin」登录系统', color: 'primary' as const },
  { time: '08:00', desc: '系统启动例行健康检查', color: 'primary' as const },
]

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const extra = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={refreshing}
      >
        <RotateCw className={refreshing ? 'animate-spin mr-1.5' : 'mr-1.5'} size={14} />
        刷新数据
      </Button>
      <Button variant="outline" size="sm">
        <Download className="mr-1.5" size={14} />
        导出报表
      </Button>
    </>
  )

  return (
    <PageContainer title="控制台" extra={extra} padding={false}>
      <div className="flex flex-col gap-4">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="总用户数"
            value={12846}
            trend="up"
            trendValue="↑ 12.5%"
            trendDesc="较上月"
            miniChart={{ type: 'line', data: TREND_DATA.users }}
          />
          <StatCard
            title="本月订单"
            value={3210}
            trend="up"
            trendValue="↑ 8.3%"
            trendDesc="较上月"
            miniChart={{ type: 'bar', data: TREND_DATA.orders }}
          />
          <StatCard
            title="营业额"
            value={248560}
            prefix="¥"
            trend="down"
            trendValue="↓ 2.1%"
            trendDesc="较上月"
            miniChart={{ type: 'line', data: TREND_DATA.revenue }}
          />
          <StatCard
            title="设备在线率"
            value="96.8%"
            trend="up"
            trendValue="↑ 0.5%"
            trendDesc="较上月"
            miniChart={{ type: 'line', data: TREND_DATA.online }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">近7天访问趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={VISIT_DATA}
                xField="day"
                yField={['visits', 'registers']}
                seriesNames={['访问量', '注册量']}
                smooth
                area
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">流量来源</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={SOURCE_DATA}
                donut
                height={300}
              />
            </CardContent>
          </Card>
        </div>

        {/* Table + Timeline Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">最新订单</CardTitle>
                <a className="text-sm text-primary hover:underline cursor-pointer">查看全部</a>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <AppTable
                columns={ORDER_COLUMNS}
                data={ORDER_DATA}
                size="sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">系统动态</CardTitle>
                <a className="text-sm text-primary hover:underline cursor-pointer">更多</a>
              </div>
            </CardHeader>
            <CardContent>
              <Timeline mode="alternate">
                {TIMELINE_ITEMS.map((item, i) => (
                  <TimelineItem key={i} label={item.time} color={item.color}>
                    {item.desc}
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
