// 侧边栏模块类型定义
export interface SidebarItem {
  id: string
  label: string
  icon: string
  count?: number
  badge?: string
  ext?: string[]
  children?: SidebarItem[]
}

export interface SidebarModule {
  id: string
  label: string
  icon: string
  expanded: boolean
  children: SidebarItem[]
}

export interface SidebarConfig {
  version: string
  lastUpdate: string
  modules: SidebarModule[]
}

// 文件示例类型定义
export interface FileExample {
  name: string
  size: number
  type: string
  modified: string
}

export interface FileCategory {
  id: string
  label: string
  icon: string
  examples: FileExample[]
}

export interface FileExamplesConfig {
  version: string
  lastUpdate: string
  categories: FileCategory[]
}
