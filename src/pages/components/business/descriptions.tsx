import { Descriptions, DescriptionsItem } from '@/components/display'
import { PageHeader, DemoSection, ComponentDemo, PropsTable } from '@/components/preview'
import type { PropItem } from '@/components/preview'

const PROPS: PropItem[] = [
  { name: 'title', type: 'ReactNode', description: '描述列表标题' },
  { name: 'column', type: 'number | ResponsiveConfig', default: '3', description: '列数，可传响应式对象' },
  { name: 'bordered', type: 'boolean', default: 'false', description: '是否显示边框样式' },
  { name: 'layout', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '布局方向' },
  { name: 'size', type: "'default' | 'small'", default: "'default'", description: '尺寸' },
  { name: 'colon', type: 'boolean', default: 'true', description: '是否在标签后显示冒号' },
  { name: 'labelStyle', type: 'CSSProperties', description: '标签列自定义样式' },
  { name: 'contentStyle', type: 'CSSProperties', description: '内容列自定义样式' },
  { name: 'className', type: 'string', description: '容器样式类' },
]

const ITEM_PROPS: PropItem[] = [
  { name: 'label', type: 'ReactNode', required: true, description: '标签文字' },
  { name: 'span', type: 'number', default: '1', description: '该项跨越的列数' },
  { name: 'labelStyle', type: 'CSSProperties', description: '覆盖项级别的标签样式' },
  { name: 'contentStyle', type: 'CSSProperties', description: '覆盖项级别的内容样式' },
]

export default function DescriptionsPage() {
  return (
    <div className="preview-page">
      <PageHeader
        title="Descriptions 描述列表"
        description="常用于详情页信息展示，支持 bordered 边框、垂直布局、响应式列数、跨列。"
        tags={['业务组件', '数据展示']}
      />

      <DemoSection title="基础描述列表（3列）">
        <ComponentDemo
          title="默认水平布局，标签在左，内容在右"
          code={`<Descriptions title="用户信息" column={3}>
  <DescriptionsItem label="姓名">张三</DescriptionsItem>
  <DescriptionsItem label="手机号">138****0000</DescriptionsItem>
  <DescriptionsItem label="角色">管理员</DescriptionsItem>
</Descriptions>`}
        >
          <Descriptions title="用户信息" column={3}>
            <DescriptionsItem label="姓名">张三</DescriptionsItem>
            <DescriptionsItem label="手机号">138****0000</DescriptionsItem>
            <DescriptionsItem label="角色">管理员</DescriptionsItem>
            <DescriptionsItem label="邮箱">zhangsan@example.com</DescriptionsItem>
            <DescriptionsItem label="部门">技术研发部</DescriptionsItem>
            <DescriptionsItem label="状态"><span className="text-green-600 font-medium">正常</span></DescriptionsItem>
            <DescriptionsItem label="创建时间">2024-01-15 10:30:00</DescriptionsItem>
            <DescriptionsItem label="最后登录">2026-05-17 09:20:00</DescriptionsItem>
            <DescriptionsItem label="IP 地址">192.168.1.1</DescriptionsItem>
          </Descriptions>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="bordered 样式">
        <ComponentDemo
          title="bordered=true 时显示表格边框样式"
          code={`<Descriptions title="订单详情" column={2} bordered>
  <DescriptionsItem label="订单号">ORD-20240115-001</DescriptionsItem>
  <DescriptionsItem label="状态">已完成</DescriptionsItem>
</Descriptions>`}
        >
          <Descriptions title="订单详情" column={2} bordered>
            <DescriptionsItem label="订单号">ORD-20240115-001</DescriptionsItem>
            <DescriptionsItem label="状态"><span className="text-green-600">已完成</span></DescriptionsItem>
            <DescriptionsItem label="商品名称">企业管理软件年度授权</DescriptionsItem>
            <DescriptionsItem label="数量">1</DescriptionsItem>
            <DescriptionsItem label="单价">¥ 9,800.00</DescriptionsItem>
            <DescriptionsItem label="总金额"><span className="font-bold text-primary">¥ 9,800.00</span></DescriptionsItem>
            <DescriptionsItem label="支付方式">微信支付</DescriptionsItem>
            <DescriptionsItem label="下单时间">2024-01-15 10:30:00</DescriptionsItem>
          </Descriptions>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="垂直布局">
        <ComponentDemo
          title="layout='vertical' 时标签在上、内容在下"
          code={`<Descriptions layout="vertical" column={4}>
  <DescriptionsItem label="状态">运行中</DescriptionsItem>
  <DescriptionsItem label="版本">v2.3.1</DescriptionsItem>
</Descriptions>`}
        >
          <Descriptions layout="vertical" column={4}>
            <DescriptionsItem label="设备名称">传感器-A001</DescriptionsItem>
            <DescriptionsItem label="状态"><span className="text-green-600">在线</span></DescriptionsItem>
            <DescriptionsItem label="固件版本">v2.3.1</DescriptionsItem>
            <DescriptionsItem label="信号强度">-65 dBm</DescriptionsItem>
            <DescriptionsItem label="部署位置">3号厂房西北角</DescriptionsItem>
            <DescriptionsItem label="负责人">李工</DescriptionsItem>
            <DescriptionsItem label="上线时间">2024-06-01</DescriptionsItem>
            <DescriptionsItem label="最后上报">2分钟前</DescriptionsItem>
          </Descriptions>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="混合 span（跨多列）">
        <ComponentDemo
          title="DescriptionsItem span={2} 时该项占据两列宽度"
          code={`<Descriptions column={3}>
  <DescriptionsItem label="标题">短内容</DescriptionsItem>
  <DescriptionsItem label="详细备注" span={2}>
    这是一段很长的备注内容，通过 span=2 占用两列宽度展示...
  </DescriptionsItem>
</Descriptions>`}
        >
          <Descriptions title="工单详情" column={3} bordered>
            <DescriptionsItem label="工单编号">WO-2024-0312</DescriptionsItem>
            <DescriptionsItem label="优先级"><span className="text-red-500">紧急</span></DescriptionsItem>
            <DescriptionsItem label="指派人">王工程师</DescriptionsItem>
            <DescriptionsItem label="创建时间">2024-03-12 08:00</DescriptionsItem>
            <DescriptionsItem label="预计完成">2024-03-12 18:00</DescriptionsItem>
            <DescriptionsItem label="实际完成">2024-03-12 16:30</DescriptionsItem>
            <DescriptionsItem label="问题描述" span={3}>
              3号厂房传感器网络中断，导致生产线数据无法上报，需紧急排查网关设备并恢复通信链路，确保生产数据完整性。
            </DescriptionsItem>
            <DescriptionsItem label="解决方案" span={3}>
              检查发现网关设备电源模块故障，更换备用电源模块后恢复正常，同时在监控平台新增设备离线告警规则。
            </DescriptionsItem>
          </Descriptions>
        </ComponentDemo>
      </DemoSection>

      <PropsTable title="Descriptions Props" data={PROPS} />
      <PropsTable title="DescriptionsItem Props" data={ITEM_PROPS} />
    </div>
  )
}
