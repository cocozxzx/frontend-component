import { AppUpload } from '@/components/base'
import { ProUpload } from '@/components/pro/ProUpload'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'listType', type: "'text' | 'picture' | 'picture-card'", default: "'text'", description: '文件列表展示模式' },
  { name: 'multiple', type: 'boolean', default: 'false', description: '是否支持多选' },
  { name: 'maxCount', type: 'number', description: '最大上传文件数' },
  { name: 'maxSize', type: 'number', description: '单文件最大体积（MB）' },
  { name: 'accept', type: 'string', description: '接受的文件类型（MIME）' },
  { name: 'drag', type: 'boolean', default: 'false', description: '是否启用拖拽上传区域' },
  { name: 'action', type: 'string', description: '上传地址（表单提交模式）' },
  { name: 'uploadFn', type: '(file: File, onProgress: ...) => Promise<string>', description: '自定义上传函数，返回文件 URL' },
  { name: 'beforeUpload', type: '(file: File) => boolean | Promise<boolean>', description: '上传前校验钩子' },
  { name: 'onRemove', type: '(file: UploadFile) => boolean | Promise<boolean>', description: '删除文件前的钩子' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用上传' },
]

const PRO_PROPS: PropItem[] = [
  { name: 'listType', type: "'text' | 'picture-card'", default: "'picture-card'", description: '展示模式' },
  { name: 'sortable', type: 'boolean', default: 'false', description: 'picture-card 模式下是否可拖拽排序' },
  { name: 'previewable', type: 'boolean', default: 'true', description: '是否可点击预览大图' },
  { name: 'cropable', type: 'boolean', default: 'false', description: '上传前是否弹出裁剪弹窗' },
]

export default function UploadPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="Upload 文件上传"
        description="支持 text / picture / picture-card 三种模式，以及拖拽上传、多文件、ProUpload（可排序+裁剪）。"
        tags={['业务组件', '数据录入']}
      />

      <DemoSection title="text 模式">
        <ComponentDemo
          title="默认文本列表模式"
          code={`<AppUpload listType="text" multiple />`}
        >
          <AppUpload listType="text" multiple />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="picture 模式">
        <ComponentDemo
          title="列表项显示缩略图"
          code={`<AppUpload listType="picture" multiple accept="image/*" />`}
        >
          <AppUpload listType="picture" multiple accept="image/*" />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="picture-card 模式">
        <ComponentDemo
          title="网格卡片展示，点击查看大图"
          code={`<AppUpload listType="picture-card" multiple accept="image/*" maxCount={8} />`}
        >
          <AppUpload listType="picture-card" multiple accept="image/*" maxCount={8} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="拖拽上传">
        <ComponentDemo
          title="drag=true 显示拖拽区域，可点击或拖拽文件"
          code={`<AppUpload drag multiple maxSize={10} />`}
        >
          <AppUpload drag multiple maxSize={10} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="多文件限制">
        <ComponentDemo
          title="maxCount=5 超过数量时提示用户"
          code={`<AppUpload multiple maxCount={5} />`}
        >
          <AppUpload multiple maxCount={5} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="ProUpload（可拖拽排序 + 预览）">
        <ComponentDemo
          title="picture-card 模式下支持拖拽重新排序，点击预览大图"
          code={`<ProUpload listType="picture-card" sortable previewable multiple accept="image/*" />`}
        >
          <ProUpload listType="picture-card" sortable previewable multiple accept="image/*" />
        </ComponentDemo>
      </DemoSection>

      <PropsTable title="AppUpload Props" data={PROPS} />
      <PropsTable title="ProUpload 额外 Props" data={PRO_PROPS} />
    </div>
  )
}
