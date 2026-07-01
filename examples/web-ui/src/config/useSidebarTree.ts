import { ref, onMounted, type Ref } from 'vue'
import type { SidebarConfig, FileExamplesConfig, SidebarModule, FileCategory } from './types'

export function useSidebarTree() {
  const sidebarConfig: Ref<SidebarConfig | null> = ref(null)
  const fileExamplesConfig: Ref<FileExamplesConfig | null> = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 加载侧边栏配置
  const loadSidebarConfig = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/src/config/sidebarTree.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      sidebarConfig.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load sidebar config'
      console.error('Failed to load sidebar config:', err)
    } finally {
      loading.value = false
    }
  }

  // 加载文件示例配置
  const loadFileExamples = async () => {
    try {
      const response = await fetch('/src/config/fileExamples.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      fileExamplesConfig.value = await response.json()
    } catch (err) {
      console.error('Failed to load file examples:', err)
    }
  }

  // 切换模块展开状态
  const toggleModule = (moduleId: string) => {
    if (!sidebarConfig.value) return
    const module = sidebarConfig.value.modules.find(m => m.id === moduleId)
    if (module) {
      module.expanded = !module.expanded
    }
  }

  // 获取模块 by ID
  const getModuleById = (moduleId: string): SidebarModule | undefined => {
    return sidebarConfig.value?.modules.find(m => m.id === moduleId)
  }

  // 获取分类 by ID
  const getCategoryById = (categoryId: string): FileCategory | undefined => {
    return fileExamplesConfig.value?.categories.find(c => c.id === categoryId)
  }

  // 搜索功能
  const searchModules = (query: string) => {
    if (!sidebarConfig.value || !query) return sidebarConfig.value.modules

    const lowerQuery = query.toLowerCase()
    return sidebarConfig.value.modules
      .map(module => ({
        ...module,
        children: module.children?.filter(child =>
          child.label.toLowerCase().includes(lowerQuery) ||
          child.id.toLowerCase().includes(lowerQuery)
        )
      }))
      .filter(module => module.children && module.children.length > 0)
  }

  // 初始化加载
  onMounted(async () => {
    await Promise.all([loadSidebarConfig(), loadFileExamples()])
  })

  return {
    sidebarConfig,
    fileExamplesConfig,
    loading,
    error,
    toggleModule,
    getModuleById,
    getCategoryById,
    searchModules,
    loadSidebarConfig,
    loadFileExamples
  }
}
