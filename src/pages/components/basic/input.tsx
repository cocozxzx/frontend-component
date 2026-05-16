import { useState } from 'react'
import { Search, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AppInput } from '@/components/base/AppInput'

export default function InputPage() {
  const [show, setShow] = useState(false)
  const [val, setVal] = useState('')

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Input 输入框</h1>
        <p className="mt-1 text-muted-foreground text-sm">文本输入控件，AppInput 增加了前后缀、字数限制等能力。</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">基础输入框</h2>
        <div className="space-y-3">
          <Input placeholder="请输入内容" />
          <Input placeholder="禁用状态" disabled />
          <Input placeholder="只读状态" readOnly value="固定内容" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">带图标 / 前后缀</h2>
        <div className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="搜索..." />
          </div>
          <div className="relative">
            <Input type={show ? 'text' : 'password'} className="pr-9" placeholder="密码" />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">AppInput — 字数限制</h2>
        <div className="space-y-3">
          <AppInput
            placeholder="最多输入 20 个字符"
            maxLength={20}
            showCount
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
          <AppInput placeholder="清除按钮" allowClear />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Textarea 多行文本</h2>
        <Textarea placeholder="多行文本输入..." rows={4} />
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Input OTP</h2>
        <div className="space-y-1">
          <Label>验证码输入（使用 shadcn InputOTP）</Label>
          <Input placeholder="请在真实使用中替换为 InputOTP 组件" maxLength={6} className="max-w-[200px] tracking-[0.5em] text-center font-mono" />
        </div>
      </section>
    </div>
  )
}
