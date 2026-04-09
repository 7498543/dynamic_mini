import { markRaw } from "vue";

// 组件黑名单，排除不需要自动引入的组件
const componentBlacklist = new Set(["BlockRender"]);

// 组件映射表
const componentMap: Record<string, any> = {};

// 组件缓存
const componentCache = new Map<string, any>();

// 自动引入组件
function autoImportComponents() {
  // 动态导入所有组件
  const components = import.meta.glob("../components/*.vue", { eager: true });

  Object.entries(components).forEach(([path, module]) => {
    // 从路径中提取组件名称
    const fileName = path.split("/").pop();
    if (!fileName) return;

    // 处理文件名，确保首字母大写
    let componentName = fileName.replace(".vue", "");
    // 首字母大写
    componentName =
      componentName.charAt(0).toUpperCase() + componentName.slice(1);

    // 跳过黑名单中的组件
    if (componentBlacklist.has(componentName)) return;

    // 获取组件对象并标记为非响应式
    const component = (module as any).default;
    if (component) {
      componentMap[componentName] = markRaw(component);
    }
  });
}

// 初始化时自动引入组件
autoImportComponents();

// 获取组件
function getComponent(name: string) {
  // 检查缓存
  if (componentCache.has(name)) {
    return componentCache.get(name);
  }

  // 检查映射表
  if (componentMap[name]) {
    componentCache.set(name, componentMap[name]);
    return componentMap[name];
  }

  return name;
}

export function useComponentMap() {
  return {
    componentMap,
    getComponent,
    componentBlacklist,
  };
}
