import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'src', type: 'string', description: '(AvatarImage) 图片地址' },
  { name: 'alt', type: 'string', description: '(AvatarImage) 图片描述' },
  { name: 'className', type: 'string', description: '控制尺寸，如 w-8 h-8' },
]

const AVATARS = [
  { src: 'https://i.pravatar.cc/150?img=1', name: '张三', role: '管理员' },
  { src: 'https://i.pravatar.cc/150?img=2', name: '李四', role: '编辑' },
  { src: 'https://i.pravatar.cc/150?img=3', name: '王五', role: '访客' },
]

export default function AvatarPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="Avatar 头像"
        description="用户头像展示组件。支持图片加载失败时的文字 Fallback，可通过 className 控制尺寸。"
        tags={['shadcn/ui', 'Radix UI', '基础组件']}
      />

      <DemoSection title="图片头像">
        <ComponentDemo title="图片头像 + Fallback 文字" code={`<Avatar>
  <AvatarImage src="https://..." alt="用户名" />
  <AvatarFallback>ZS</AvatarFallback>
</Avatar>`}>
          <div className="flex items-center gap-4">
            {AVATARS.map(({ src, name, role }) => (
              <div key={name} className="flex flex-col items-center gap-1.5">
                <Avatar>
                  <AvatarImage src={src} alt={name} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <p className="text-xs font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1.5">
              <Avatar>
                <AvatarImage src="broken-url" alt="失败" />
                <AvatarFallback>失</AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium">图片失败</p>
              <p className="text-xs text-muted-foreground">Fallback</p>
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="尺寸">
        <ComponentDemo title="通过 className 控制大小" code={`<Avatar className="w-6 h-6"><AvatarFallback>S</AvatarFallback></Avatar>
<Avatar><AvatarFallback>M</AvatarFallback></Avatar>
<Avatar className="w-12 h-12"><AvatarFallback>L</AvatarFallback></Avatar>
<Avatar className="w-16 h-16"><AvatarFallback>XL</AvatarFallback></Avatar>`}>
          <div className="flex items-end gap-4">
            {[
              { cls: 'w-6 h-6 text-xs', label: 'XS 24' },
              { cls: 'w-8 h-8 text-xs', label: 'SM 32' },
              { cls: '', label: 'MD 40' },
              { cls: 'w-12 h-12', label: 'LG 48' },
              { cls: 'w-16 h-16 text-lg', label: 'XL 64' },
            ].map(({ cls, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <Avatar className={cls}>
                  <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="头像组（堆叠）">
        <ComponentDemo title="负 margin 实现堆叠效果" code={`<div className="flex">
  {users.map((u, i) => (
    <Avatar key={i} className="-ml-2 first:ml-0 border-2 border-background">
      <AvatarImage src={u.src} />
      <AvatarFallback>{u.name[0]}</AvatarFallback>
    </Avatar>
  ))}
  <div className="flex items-center -ml-2 w-10 h-10 rounded-full border-2 border-background bg-muted text-xs font-medium justify-center">
    +5
  </div>
</div>`}>
          <div className="flex items-center">
            {AVATARS.map(({ src, name }, i) => (
              <Avatar key={i} className="-ml-2 first:ml-0 border-2 border-background w-10 h-10">
                <AvatarImage src={src} alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
            ))}
            <div className="flex items-center justify-center -ml-2 w-10 h-10 rounded-full border-2 border-background bg-muted text-xs font-semibold">
              +5
            </div>
          </div>
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
