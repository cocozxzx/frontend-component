import { ProUpload } from '@/components/pro/ProUpload'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'listType', type: "'text' | 'picture-card'", default: "'picture-card'", description: '展示模式' },
  { name: 'multiple', type: 'boolean', default: 'false', description: '是否支持多文件上传' },
  { name: 'maxCount', type: 'number', description: '最大上传文件数' },
  { name: 'maxSize', type: 'number', description: '单文件最大体积（MB）' },
  { name: 'accept', type: 'string', description: '接受的文件类型（MIME）' },
  { name: 'sortable', type: 'boolean', default: 'false', description: 'picture-card 模式：是否可拖拽排序' },
  { name: 'previewable', type: 'boolean', default: 'true', description: 'picture-card 模式：是否可点击预览大图' },
  { name: 'cropable', type: 'boolean', default: 'false', description: '是否在上传前弹出裁剪弹窗' },
  { name: 'uploadFn', type: '(file: File, onProgress) => Promise<string>', description: '自定义上传函数，返回文件 URL' },
  { name: 'action', type: 'string', description: '上传接口地址（表单提交模式）' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用上传' },
  { name: 'value', type: 'UploadFile[]', description: '文件列表（受控）' },
  { name: 'onChange', type: '(files: UploadFile[]) => void', description: '文件列表变化回调' },
]

export default function ProUploadPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl">
      <PageHeader
        title="ProUpload 高级上传"
        description="在 AppUpload 基础上增加拖拽排序、Canvas 图片裁剪（4角调整）、大图预览功能。"
        tags={['Pro 组件', '数据录入']}
      />

      <DemoSection title="picture-card 可排序模式">
        <ComponentDemo
          title="上传后可拖拽调整图片顺序，适合需要排序的图片集合"
          code={`<ProUpload
  listType="picture-card"
  sortable
  previewable
  multiple
  accept="image/*"
  maxCount={8}
/>`}
        >
          <ProUpload
            listType="picture-card"
            sortable
            previewable
            multiple
            accept="image/*"
            maxCount={8}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="picture-card 不可排序模式">
        <ComponentDemo
          title="sortable=false 时禁用拖拽，仅支持预览"
          code={`<ProUpload
  listType="picture-card"
  previewable
  multiple
  accept="image/*"
/>`}
        >
          <ProUpload
            listType="picture-card"
            previewable
            multiple
            accept="image/*"
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="图片裁剪上传">
        <ComponentDemo
          title="cropable=true 时上传图片后弹出裁剪弹窗，支持 4 角拖拽调整裁剪区域"
          code={`<ProUpload
  listType="picture-card"
  cropable
  sortable
  previewable
  accept="image/*"
  maxCount={5}
/>`}
        >
          <ProUpload
            listType="picture-card"
            cropable
            sortable
            previewable
            accept="image/*"
            maxCount={5}
          />
          <p className="text-xs text-muted-foreground mt-2">
            上传图片后将弹出裁剪弹窗，拖动4个角点调整裁剪区域，确认后上传裁剪结果。
          </p>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="text 模式">
        <ComponentDemo
          title="文件列表模式，适合上传非图片文件（PDF、Excel 等）"
          code={`<ProUpload listType="text" multiple maxCount={5} />`}
        >
          <ProUpload listType="text" multiple maxCount={5} />
        </ComponentDemo>
      </DemoSection>

      <PropsTable data={PROPS} />
    </div>
  )
}
