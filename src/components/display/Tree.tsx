import { useState, useMemo, useRef, useCallback, type ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  DndContext, useDraggable, useDroppable,
  DragOverlay, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { ChevronRight, Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TreeNodeData {
  key: string | number
  title: ReactNode | string
  icon?: ReactNode
  disabled?: boolean
  checkable?: boolean
  isLeaf?: boolean
  children?: TreeNodeData[]
  [key: string]: unknown
}

export interface DropInfo {
  dragNode: TreeNodeData
  targetNode: TreeNodeData
  dropPosition: 'before' | 'inside' | 'after'
}

interface FlatNode {
  node: TreeNodeData
  depth: number
  parentKey?: string | number
}

export interface TreeProps {
  data: TreeNodeData[]
  defaultExpandedKeys?: (string | number)[]
  expandedKeys?: (string | number)[]
  onExpand?: (keys: (string | number)[], info: { node: TreeNodeData; expanded: boolean }) => void
  defaultSelectedKeys?: (string | number)[]
  selectedKeys?: (string | number)[]
  onSelect?: (keys: (string | number)[], info: { node: TreeNodeData; selected: boolean }) => void
  checkable?: boolean
  defaultCheckedKeys?: (string | number)[]
  checkedKeys?: (string | number)[]
  onCheck?: (keys: (string | number)[], info: { node: TreeNodeData; checked: boolean; halfCheckedKeys: (string | number)[] }) => void
  checkStrictly?: boolean
  draggable?: boolean
  onDrop?: (info: DropInfo) => void
  loadData?: (node: TreeNodeData) => Promise<TreeNodeData[]>
  showLine?: boolean
  showIcon?: boolean
  filterTreeNode?: (node: TreeNodeData) => boolean
  height?: number
  indent?: number
  className?: string
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function flattenTree(
  nodes: TreeNodeData[],
  expandedSet: Set<string | number>,
  depth = 0,
  parentKey?: string | number,
): FlatNode[] {
  return nodes.flatMap((node) => {
    const flat: FlatNode = { node, depth, parentKey }
    const isExpanded = expandedSet.has(node.key)
    if (isExpanded && node.children?.length) {
      return [flat, ...flattenTree(node.children, expandedSet, depth + 1, node.key)]
    }
    return [flat]
  })
}

function findNode(nodes: TreeNodeData[], key: string | number): TreeNodeData | null {
  for (const node of nodes) {
    if (node.key === key) return node
    if (node.children) {
      const found = findNode(node.children, key)
      if (found) return found
    }
  }
  return null
}

function getAllDescendantKeys(node: TreeNodeData): (string | number)[] {
  const keys: (string | number)[] = []
  function walk(n: TreeNodeData) {
    if (n.children) n.children.forEach((c) => { keys.push(c.key); walk(c) })
  }
  walk(node)
  return keys
}

function getLeafKeys(node: TreeNodeData): (string | number)[] {
  if (!node.children?.length) return [node.key]
  return node.children.flatMap(getLeafKeys)
}

function computeChecked(
  data: TreeNodeData[],
  checkedSet: Set<string | number>,
): { checked: Set<string | number>; half: Set<string | number> } {
  const checked = new Set<string | number>()
  const half = new Set<string | number>()

  function walk(node: TreeNodeData): 'checked' | 'half' | 'unchecked' {
    if (!node.children?.length) {
      if (checkedSet.has(node.key)) { checked.add(node.key); return 'checked' }
      return 'unchecked'
    }
    const childStates = node.children.map(walk)
    const allChecked = childStates.every((s) => s === 'checked')
    const someChecked = childStates.some((s) => s !== 'unchecked')
    if (allChecked) { checked.add(node.key); return 'checked' }
    if (someChecked) { half.add(node.key); return 'half' }
    return 'unchecked'
  }
  data.forEach(walk)
  return { checked, half }
}

function getVisibleKeys(
  nodes: TreeNodeData[],
  filterFn: (n: TreeNodeData) => boolean,
): Set<string | number> {
  const visible = new Set<string | number>()
  function walk(node: TreeNodeData): boolean {
    const match = filterFn(node)
    let childMatch = false
    if (node.children) {
      for (const c of node.children) if (walk(c)) childMatch = true
    }
    if (match || childMatch) { visible.add(node.key); return true }
    return false
  }
  nodes.forEach(walk)
  return visible
}

function highlightTitle(title: unknown, query: string): ReactNode {
  if (typeof title !== 'string' || !query) return title as ReactNode
  const idx = title.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return title
  return (
    <>
      {title.slice(0, idx)}
      <mark className="rounded-sm bg-warning/40 text-foreground">{title.slice(idx, idx + query.length)}</mark>
      {title.slice(idx + query.length)}
    </>
  )
}

// ─── Node Renderer ─────────────────────────────────────────────────────────

interface NodeRendererProps {
  flatNode: FlatNode
  expandedSet: Set<string | number>
  selectedSet: Set<string | number>
  checkedSet: Set<string | number>
  halfSet: Set<string | number>
  loadingSet: Set<string | number>
  checkable: boolean
  checkStrictly: boolean
  draggable: boolean
  showLine: boolean
  showIcon: boolean
  indent: number
  filterFn?: (n: TreeNodeData) => boolean
  filterQuery: string
  visibleSet?: Set<string | number>
  onToggleExpand: (node: TreeNodeData) => void
  onSelect: (node: TreeNodeData) => void
  onCheck: (node: TreeNodeData) => void
}

function NodeRenderer({
  flatNode, expandedSet, selectedSet, checkedSet, halfSet, loadingSet,
  checkable, checkStrictly, draggable, showLine, showIcon, indent,
  filterQuery, visibleSet,
  onToggleExpand, onSelect, onCheck,
}: NodeRendererProps) {
  const { node, depth } = flatNode
  const isExpanded = expandedSet.has(node.key)
  const isSelected = selectedSet.has(node.key)
  const isChecked = checkedSet.has(node.key)
  const isHalf = halfSet.has(node.key)
  const isLoading = loadingSet.has(node.key)
  const hasChildren = !!node.children?.length
  const isLeaf = node.isLeaf ?? (!hasChildren && !isLoading)

  const draggableHook = useDraggable({ id: node.key, disabled: !draggable || !!node.disabled })
  const { setNodeRef: dropBeforeRef, isOver: overBefore } = useDroppable({ id: `before-${node.key}`, disabled: !draggable })
  const { setNodeRef: dropInsideRef, isOver: overInside } = useDroppable({ id: `inside-${node.key}`, disabled: !draggable })
  const { setNodeRef: dropAfterRef, isOver: overAfter } = useDroppable({ id: `after-${node.key}`, disabled: !draggable })

  if (visibleSet && !visibleSet.has(node.key)) return null

  return (
    <div
      ref={draggableHook.setNodeRef}
      {...draggableHook.listeners}
      {...draggableHook.attributes}
      className={cn('select-none', draggableHook.isDragging && 'opacity-40')}
    >
      {/* Before drop zone */}
      {draggable && (
        <div ref={dropBeforeRef} className={cn('h-1 rounded-full transition-colors', overBefore && 'bg-primary')} />
      )}

      {/* Main node row (inside drop zone) */}
      <div
        ref={draggable ? dropInsideRef : undefined}
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors',
          isSelected && 'bg-primary/10 text-primary',
          !isSelected && !node.disabled && 'hover:bg-muted',
          node.disabled && 'cursor-not-allowed opacity-50',
          overInside && draggable && 'ring-2 ring-primary',
          showLine && depth > 0 && 'border-l border-border',
        )}
        style={{ paddingLeft: depth * indent + 8 }}
        onClick={() => !node.disabled && onSelect(node)}
      >
        {/* Expand arrow */}
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center"
          onClick={(e) => { e.stopPropagation(); !isLeaf && !node.disabled && onToggleExpand(node) }}
        >
          {isLoading ? (
            <Loader2 size={12} className="animate-spin text-primary" />
          ) : !isLeaf ? (
            <ChevronRight
              size={14}
              className={cn('text-muted-foreground transition-transform duration-200', isExpanded && 'rotate-90')}
            />
          ) : null}
        </span>

        {/* Checkbox */}
        {checkable && (node.checkable !== false) && (
          <Checkbox
            checked={isHalf ? 'indeterminate' : isChecked}
            disabled={!!node.disabled}
            onCheckedChange={() => onCheck(node)}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Icon */}
        {showIcon && node.icon && <span className="text-muted-foreground">{node.icon}</span>}

        {/* Title */}
        <span className={cn('flex-1 truncate', isSelected && 'font-medium')}>
          {filterQuery ? highlightTitle(node.title, filterQuery) : node.title}
        </span>
      </div>

      {/* After drop zone */}
      {draggable && (
        <div ref={dropAfterRef} className={cn('h-1 rounded-full transition-colors', overAfter && 'bg-primary')} />
      )}
    </div>
  )
}

// ─── Tree (main) ──────────────────────────────────────────────────────────────

const NODE_HEIGHT = 36

export function Tree({
  data,
  defaultExpandedKeys = [],
  expandedKeys: controlledExpandedKeys,
  onExpand,
  defaultSelectedKeys = [],
  selectedKeys: controlledSelectedKeys,
  onSelect,
  checkable = false,
  defaultCheckedKeys = [],
  checkedKeys: controlledCheckedKeys,
  onCheck,
  checkStrictly = false,
  draggable = false,
  onDrop,
  loadData,
  showLine = false,
  showIcon = false,
  filterTreeNode,
  height,
  indent = 24,
  className,
}: TreeProps) {
  const [internalExpanded, setInternalExpanded] = useState<(string | number)[]>(defaultExpandedKeys)
  const [internalSelected, setInternalSelected] = useState<(string | number)[]>(defaultSelectedKeys)
  const [internalChecked, setInternalChecked] = useState<(string | number)[]>(defaultCheckedKeys)
  const [loadingKeys, setLoadingKeys] = useState<Set<string | number>>(new Set())
  const [activeDragKey, setActiveDragKey] = useState<string | number | null>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const expandedKeys = controlledExpandedKeys ?? internalExpanded
  const selectedKeys = controlledSelectedKeys ?? internalSelected
  const checkedKeys = controlledCheckedKeys ?? internalChecked

  const expandedSet = useMemo(() => new Set(expandedKeys), [expandedKeys])
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys])

  const { checked: computedChecked, half: halfSet } = useMemo(() => {
    if (checkStrictly) {
      return { checked: new Set(checkedKeys), half: new Set<string | number>() }
    }
    return computeChecked(data, new Set(checkedKeys))
  }, [data, checkedKeys, checkStrictly])

  const flatNodes = useMemo(() => flattenTree(data, expandedSet), [data, expandedSet])

  const visibleSet = useMemo(() => {
    if (!filterTreeNode) return undefined
    return getVisibleKeys(data, filterTreeNode)
  }, [data, filterTreeNode])

  const filterQuery = useMemo(() => {
    if (!filterTreeNode) return ''
    // Extract query string from filter function name or return empty
    return ''
  }, [filterTreeNode])

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleToggleExpand = useCallback(async (node: TreeNodeData) => {
    const isExpanded = expandedSet.has(node.key)
    let newKeys: (string | number)[]

    if (isExpanded) {
      newKeys = expandedKeys.filter((k) => k !== node.key)
    } else {
      newKeys = [...expandedKeys, node.key]
      // Async load children if needed
      if (loadData && !node.children?.length && !node.isLeaf) {
        setLoadingKeys((prev) => new Set(prev).add(node.key))
        try {
          await loadData(node)
        } finally {
          setLoadingKeys((prev) => { const s = new Set(prev); s.delete(node.key); return s })
        }
      }
    }

    if (!controlledExpandedKeys) setInternalExpanded(newKeys)
    onExpand?.(newKeys, { node, expanded: !isExpanded })
  }, [expandedKeys, expandedSet, controlledExpandedKeys, loadData, onExpand])

  const handleSelect = useCallback((node: TreeNodeData) => {
    const isSelected = selectedSet.has(node.key)
    const newKeys = isSelected
      ? selectedKeys.filter((k) => k !== node.key)
      : [...selectedKeys, node.key]
    if (!controlledSelectedKeys) setInternalSelected(newKeys)
    onSelect?.(newKeys, { node, selected: !isSelected })
  }, [selectedKeys, selectedSet, controlledSelectedKeys, onSelect])

  const handleCheck = useCallback((node: TreeNodeData) => {
    let newChecked: (string | number)[]
    if (checkStrictly) {
      const isChecked = new Set(checkedKeys).has(node.key)
      newChecked = isChecked ? checkedKeys.filter((k) => k !== node.key) : [...checkedKeys, node.key]
    } else {
      const currentSet = new Set(checkedKeys)
      const descendants = getAllDescendantKeys(node)
      const nodeIsChecked = computedChecked.has(node.key)
      if (nodeIsChecked) {
        // Uncheck node + descendants, recompute parents
        const toRemove = new Set([node.key, ...descendants])
        newChecked = [...currentSet].filter((k) => !toRemove.has(k))
      } else {
        // Check node + all descendants
        const leaves = getLeafKeys(node)
        newChecked = [...new Set([...currentSet, node.key, ...leaves])]
      }
    }
    const { checked: newComputedChecked, half: newHalf } = checkStrictly
      ? { checked: new Set(newChecked), half: new Set<string | number>() }
      : computeChecked(data, new Set(newChecked))

    const leafChecked = [...newComputedChecked].filter((k) => {
      const n = findNode(data, k)
      return !n?.children?.length
    })

    if (!controlledCheckedKeys) setInternalChecked(leafChecked)
    onCheck?.(leafChecked, { node, checked: !computedChecked.has(node.key), halfCheckedKeys: [...newHalf] })
  }, [checkedKeys, computedChecked, checkStrictly, data, controlledCheckedKeys, onCheck])

  // ─── Drag ──────────────────────────────────────────────────────────────────

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragStart = useCallback(({ active }: { active: { id: string | number } }) => {
    setActiveDragKey(active.id)
  }, [])

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveDragKey(null)
    if (!over || !onDrop) return
    const dragKey = active.id as string | number
    const overId = String(over.id)

    let position: 'before' | 'inside' | 'after'
    let targetKeyStr: string

    if (overId.startsWith('before-')) { position = 'before'; targetKeyStr = overId.slice(7) }
    else if (overId.startsWith('inside-')) { position = 'inside'; targetKeyStr = overId.slice(7) }
    else if (overId.startsWith('after-')) { position = 'after'; targetKeyStr = overId.slice(6) }
    else return

    const dragNode = findNode(data, dragKey)
    const targetNode = findNode(data, targetKeyStr) ?? findNode(data, Number(targetKeyStr))
    if (!dragNode || !targetNode || dragKey === targetNode?.key) return

    onDrop({ dragNode, targetNode, dropPosition: position })
  }, [data, onDrop])

  // ─── Render ────────────────────────────────────────────────────────────────

  const activeDragNode = activeDragKey ? findNode(data, activeDragKey) : null

  const renderNode = (flatNode: FlatNode) => (
    <NodeRenderer
      key={flatNode.node.key}
      flatNode={flatNode}
      expandedSet={expandedSet}
      selectedSet={selectedSet}
      checkedSet={computedChecked}
      halfSet={halfSet}
      loadingSet={loadingKeys}
      checkable={checkable}
      checkStrictly={checkStrictly}
      draggable={draggable}
      showLine={showLine}
      showIcon={showIcon}
      indent={indent}
      filterQuery={filterQuery}
      visibleSet={visibleSet}
      onToggleExpand={handleToggleExpand}
      onSelect={handleSelect}
      onCheck={handleCheck}
    />
  )

  const visibleFlat = visibleSet
    ? flatNodes.filter((fn) => visibleSet.has(fn.node.key))
    : flatNodes

  // Virtual scroll mode
  if (height) {
    return (
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div
          ref={parentRef}
          className={cn('overflow-auto', className)}
          style={{ height }}
        >
          <VirtualTreeContent
            flatNodes={visibleFlat}
            parentRef={parentRef}
            nodeHeight={NODE_HEIGHT}
            renderNode={renderNode}
          />
        </div>
        {draggable && activeDragNode && (
          <DragOverlay>
            <div className="rounded-md bg-card px-3 py-1.5 text-sm shadow-lg ring-1 ring-border">
              {activeDragNode.title as ReactNode}
            </div>
          </DragOverlay>
        )}
      </DndContext>
    )
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={cn('space-y-0.5', className)}>
        {visibleFlat.map(renderNode)}
      </div>
      {draggable && activeDragNode && (
        <DragOverlay>
          <div className="rounded-md bg-card px-3 py-1.5 text-sm shadow-lg ring-1 ring-border">
            {activeDragNode.title as ReactNode}
          </div>
        </DragOverlay>
      )}
    </DndContext>
  )
}

// ─── Virtual inner content ────────────────────────────────────────────────────

function VirtualTreeContent({
  flatNodes,
  parentRef,
  nodeHeight,
  renderNode,
}: {
  flatNodes: FlatNode[]
  parentRef: React.RefObject<HTMLDivElement | null>
  nodeHeight: number
  renderNode: (fn: FlatNode) => ReactNode
}) {
  const virtualizer = useVirtualizer({
    count: flatNodes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => nodeHeight,
    overscan: 10,
  })

  return (
    <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
      {virtualizer.getVirtualItems().map((vItem) => (
        <div
          key={flatNodes[vItem.index].node.key}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${vItem.start}px)`,
            height: nodeHeight,
          }}
        >
          {renderNode(flatNodes[vItem.index])}
        </div>
      ))}
    </div>
  )
}
