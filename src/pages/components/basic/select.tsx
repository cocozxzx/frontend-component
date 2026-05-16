import { useState } from 'react'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { AppSelect, type SelectOption } from '@/components/base/AppSelect'

const cities: SelectOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou' },
  { label: '成都', value: 'chengdu' },
]

const bigList: SelectOption[] = Array.from({ length: 200 }, (_, i) => ({
  label: `选项 ${i + 1}`,
  value: String(i + 1),
}))

export default function SelectPage() {
  const [city, setCity] = useState<string | number>('')

  const remoteSearch = async (kw: string): Promise<SelectOption[]> => {
    await new Promise((r) => setTimeout(r, 500))
    return cities.filter((c) => c.label.includes(kw))
  }

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Select 选择器</h1>
        <p className="mt-1 text-muted-foreground text-sm">AppSelect 支持搜索、虚拟滚动（≥100项）、远程搜索。</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">原生 shadcn Select</h2>
        <Select>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="请选择城市" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">AppSelect — 本地搜索</h2>
        <AppSelect
          options={cities}
          value={city}
          onChange={setCity}
          allowSearch
          placeholder="可搜索城市"
          className="w-52"
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">AppSelect — 虚拟滚动（200项）</h2>
        <AppSelect
          options={bigList}
          placeholder="从 200 个选项中选择"
          className="w-52"
          allowSearch
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">AppSelect — 远程搜索</h2>
        <AppSelect
          remote
          onSearch={remoteSearch}
          placeholder="输入城市名搜索"
          className="w-52"
        />
        <p className="text-xs text-muted-foreground">模拟 500ms 延迟的远程接口</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">禁用状态</h2>
        <AppSelect options={cities} disabled placeholder="禁用状态" className="w-52" />
      </section>
    </div>
  )
}
