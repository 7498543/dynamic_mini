import { getDB } from "./index";
import {
  componentSchema,
  pageSchema,
  sysUserSchema,
  robots as robotsSchema,
  articleCategorySchema,
  articleTagSchema,
  articleSchema,
  commoditySchema,
  commoditySkuSchema,
  permissionSchema,
  roleSchema,
  imageLibraryTags,
} from "./schema";
import { hashPassword } from "../crypto";

const pages = [
  {
    name: "首页",
    description: "网站首页",
    slug: "/",
    layout: "default",
    status: "published",
    content: [
      {
        id: 1,
        component: "Text",
        componentProps: {
          class: "text-2xl font-bold",
        },
        componentSlots: "My Website",
      },
      {
        id: 2,
        component: "Text",
        componentProps: {
          class: "text-3xl font-bold",
        },
        componentSlots: "Welcome to My Website",
      },
      {
        id: 3,
        component: "View",
        componentProps: {
          class: "flex flex-col",
        },
        componentSlots: [
          {
            id: 4,
            component: "Text",
            componentProps: {},
            componentSlots: "to Login",
          },
        ],
      },
    ],
    seo: {
      title: "首页 - My Website",
      description: "Welcome to my low-code website",
      alias: "",
    },
    i18n: {},
    meta: {},
    publishedAt: null,
    sort: 0,
  },
  {
    name: "404 Not Found",
    description: "页面未找到",
    slug: "/404",
    layout: "default",
    status: "published",
    content: [
      {
        id: 1,
        component: "Text",
        componentProps: {
          class: "text-2xl font-bold",
        },
        componentSlots: "404 Not Found",
      },
      {
        id: 2,
        component: "Text",
        componentProps: {
          class: "text-gray-600",
        },
        componentSlots: "The page you are looking for does not exist.",
      },
    ],
    seo: {
      title: "404 Not Found",
      description: "Page not found",
      alias: "",
    },
    i18n: {},
    meta: {},
    publishedAt: null,
    sort: 1,
  },
  {
    name: "关于我们",
    description: "关于我们页面",
    slug: "/about",
    layout: "default",
    status: "published",
    content: [
      {
        id: 1,
        component: "Text",
        componentProps: {
          class: "text-3xl font-bold mb-4",
        },
        componentSlots: "关于我们",
      },
      {
        id: 2,
        component: "View",
        componentProps: {
          class: "prose max-w-none",
        },
        componentSlots: [
          {
            id: 3,
            component: "Text",
            componentProps: {
              class: "text-gray-700",
            },
            componentSlots:
              "我们是一个专注于提供高质量产品和服务的团队。我们的使命是通过创新和技术进步，为客户创造更大的价值。",
          },
          {
            id: 4,
            component: "Text",
            componentProps: {
              class: "text-gray-700 mt-4",
            },
            componentSlots:
              "成立于 2024 年，我们已经服务了数百个客户，赢得了广泛的认可和好评。",
          },
        ],
      },
    ],
    seo: {
      title: "关于我们 - My Website",
      description: "了解我们的团队和使命",
      alias: "",
    },
    i18n: {},
    meta: {},
    publishedAt: null,
    sort: 2,
  },
  {
    name: "联系我们",
    description: "联系我们页面",
    slug: "/contact",
    layout: "default",
    status: "published",
    content: [
      {
        id: 1,
        component: "Text",
        componentProps: {
          class: "text-3xl font-bold mb-4",
        },
        componentSlots: "联系我们",
      },
      {
        id: 2,
        component: "View",
        componentProps: {
          class: "space-y-4",
        },
        componentSlots: [
          {
            id: 3,
            component: "Text",
            componentProps: {
              class: "text-gray-700",
            },
            componentSlots: "📧 邮箱：contact@example.com",
          },
          {
            id: 4,
            component: "Text",
            componentProps: {
              class: "text-gray-700",
            },
            componentSlots: "📱 电话：+86 123 4567 8900",
          },
          {
            id: 5,
            component: "Text",
            componentProps: {
              class: "text-gray-700",
            },
            componentSlots: "📍 地址：北京市朝阳区某某街道 123 号",
          },
        ],
      },
    ],
    seo: {
      title: "联系我们 - My Website",
      description: "与我们取得联系",
      alias: "",
    },
    i18n: {},
    meta: {},
    publishedAt: null,
    sort: 3,
  },
  {
    name: "产品列表",
    description: "产品展示页面",
    slug: "/products",
    layout: "default",
    status: "published",
    content: [
      {
        id: 1,
        component: "Text",
        componentProps: {
          class: "text-3xl font-bold mb-6",
        },
        componentSlots: "我们的产品",
      },
      {
        id: 2,
        component: "Grid",
        componentProps: {
          class: "grid grid-cols-1 md:grid-cols-3 gap-6",
        },
        componentSlots: [],
      },
    ],
    seo: {
      title: "产品列表 - My Website",
      description: "浏览我们的产品和服务",
      alias: "",
    },
    i18n: {},
    meta: {},
    publishedAt: null,
    sort: 4,
  },
  {
    name: "新闻动态",
    description: "新闻和文章列表",
    slug: "/news",
    layout: "default",
    status: "published",
    content: [
      {
        id: 1,
        component: "Text",
        componentProps: {
          class: "text-3xl font-bold mb-6",
        },
        componentSlots: "新闻动态",
      },
      {
        id: 2,
        component: "List",
        componentProps: {
          class: "space-y-4",
        },
        componentSlots: [],
      },
    ],
    seo: {
      title: "新闻动态 - My Website",
      description: "最新的新闻和文章",
      alias: "",
    },
    i18n: {},
    meta: {},
    publishedAt: null,
    sort: 5,
  },
];

const components = [
  {
    component: "Text",
    displayName: "文本",
    description: "文本组件",
    enabled: true,
    sort: 1,
  },
  {
    component: "Image",
    displayName: "图片",
    description: "图片组件",
    enabled: true,
    sort: 2,
  },
  {
    component: "View",
    displayName: "容器",
    description: "容器组件",
    enabled: true,
    sort: 3,
  },
  {
    component: "Link",
    displayName: "链接",
    description: "链接组件",
    enabled: true,
    sort: 4,
  },
  {
    component: "Button",
    displayName: "按钮",
    description: "按钮组件",
    enabled: true,
    sort: 5,
  },
  {
    component: "Card",
    displayName: "卡片",
    description: "卡片容器组件",
    enabled: true,
    sort: 6,
  },
  {
    component: "Grid",
    displayName: "网格",
    description: "网格布局组件",
    enabled: true,
    sort: 7,
  },
  {
    component: "List",
    displayName: "列表",
    description: "列表组件",
    enabled: true,
    sort: 8,
  },
  {
    component: "Video",
    displayName: "视频",
    description: "视频播放器组件",
    enabled: true,
    sort: 9,
  },
  {
    component: "Audio",
    displayName: "音频",
    description: "音频播放器组件",
    enabled: true,
    sort: 10,
  },
];

const sysUser = [
  {
    nickname: "系统用户",
    username: "system",
    password: hashPassword("123456"),
    email: null,
    enabled: true,
  },
  {
    nickname: "普通用户",
    username: "user",
    password: hashPassword("123456"),
    email: null,
    enabled: true,
  },
  {
    nickname: "管理员",
    username: "admin",
    password: hashPassword("admin123"),
    email: "admin@example.com",
    enabled: true,
  },
  {
    nickname: "编辑员",
    username: "editor",
    password: hashPassword("editor123"),
    email: "editor@example.com",
    enabled: true,
  },
];

const sysPermissions = [
  {
    name: "系统管理",
    key: "system",
    enabled: true,
  },
  {
    name: "用户管理",
    key: "user",
    enabled: true,
  },
  {
    name: "内容管理",
    key: "content",
    enabled: true,
  },
  {
    name: "文章管理",
    key: "article",
    enabled: true,
  },
  {
    name: "商品管理",
    key: "commodity",
    enabled: true,
  },
  {
    name: "页面管理",
    key: "page",
    enabled: true,
  },
  {
    name: "组件管理",
    key: "component",
    enabled: true,
  },
  {
    name: "资产管理",
    key: "asset",
    enabled: true,
  },
];

const sysRoles = [
  {
    name: "超级管理员",
    enabled: true,
  },
  {
    name: "管理员",
    enabled: true,
  },
  {
    name: "编辑员",
    enabled: true,
  },
  {
    name: "普通用户",
    enabled: true,
  },
];

const articleCategories = [
  {
    name: "技术文章",
    slug: "tech",
    description: "技术相关的文章",
    enabled: true,
    sort: 0,
  },
  {
    name: "产品更新",
    slug: "product-updates",
    description: "产品更新和发布公告",
    enabled: true,
    sort: 1,
  },
  {
    name: "公司新闻",
    slug: "company-news",
    description: "公司内部新闻和动态",
    enabled: true,
    sort: 2,
  },
  {
    name: "使用教程",
    slug: "tutorials",
    description: "产品使用教程和指南",
    enabled: true,
    sort: 3,
  },
];

const articleTags = [
  {
    name: "JavaScript",
    slug: "javascript",
    description: "JavaScript 相关",
    enabled: true,
    sort: 0,
  },
  {
    name: "TypeScript",
    slug: "typescript",
    description: "TypeScript 相关",
    enabled: true,
    sort: 1,
  },
  {
    name: "Vue",
    slug: "vue",
    description: "Vue.js 框架",
    enabled: true,
    sort: 2,
  },
  {
    name: "React",
    slug: "react",
    description: "React 框架",
    enabled: true,
    sort: 3,
  },
  {
    name: "Node.js",
    slug: "nodejs",
    description: "Node.js 后端开发",
    enabled: true,
    sort: 4,
  },
  {
    name: "数据库",
    slug: "database",
    description: "数据库相关",
    enabled: true,
    sort: 5,
  },
  {
    name: "教程",
    slug: "tutorial",
    description: "教程类文章",
    enabled: true,
    sort: 6,
  },
  {
    name: "公告",
    slug: "announcement",
    description: "官方公告",
    enabled: true,
    sort: 7,
  },
];

const articles = [
  {
    title: "欢迎来到我们的网站",
    slug: "welcome-to-our-website",
    summary: "这是我们网站的第一篇文章，介绍我们的愿景和目标。",
    coverImage: "",
    author: "系统用户",
    authorId: 1,
    categoryId: 1,
    content: `
# 欢迎来到我们的网站

我们很高兴地宣布我们的网站正式上线了！

## 我们的使命

我们的使命是通过创新和技术进步，为客户创造更大的价值。

## 我们的服务

- 高质量的產品
- 专业的技术支持
- 优质的客户服务

感谢您对我们的关注和支持！
    `.trim(),
    visitCount: 0,
    commentCount: 0,
    publishedAt: new Date(),
    enabled: true,
  },
  {
    title: "如何使用我们的平台",
    slug: "how-to-use-our-platform",
    summary: "一份详细的使用指南，帮助您快速上手。",
    coverImage: "",
    author: "编辑员",
    authorId: 4,
    categoryId: 4,
    content: `
# 如何使用我们的平台

## 第一步：注册账号

访问我们的注册页面，填写基本信息完成注册。

## 第二步：完善资料

登录后，完善您的个人资料信息。

## 第三步：开始使用

浏览我们的产品和服务，选择您需要的功能。

如有任何问题，请随时联系我们的客服团队。
    `.trim(),
    visitCount: 0,
    commentCount: 0,
    publishedAt: new Date(),
    enabled: true,
  },
  {
    title: "产品更新公告 v1.0",
    slug: "product-update-v1-0",
    summary: "我们发布了第一个正式版本，包含多项新功能和改进。",
    coverImage: "",
    author: "管理员",
    authorId: 3,
    categoryId: 2,
    content: `
# 产品更新公告 v1.0

我们很高兴地发布第一个正式版本！

## 新功能

- 新增了用户管理功能
- 优化了页面编辑器
- 添加了更多组件

## 改进

- 提升了系统性能
- 优化了用户体验
- 修复了已知问题

感谢您的支持！
    `.trim(),
    visitCount: 0,
    commentCount: 0,
    publishedAt: new Date(),
    enabled: true,
  },
];

const commodities = [
  {
    name: "基础版订阅",
    slug: "basic-subscription",
    description: "适合个人用户的基础版本",
    coverImage: "",
    enabled: true,
    sort: 0,
  },
];

const commoditySkus = [
  {
    commodityId: 1,
    name: "测试",
    code: "BASIC-MONTHLY",
    attributes: {
      period: "monthly",
      users: 1,
      storage: "10GB",
    },
    price: 9900, // 99 元
    originalPrice: 12900,
    stock: 9999,
    enabled: true,
  },
];

const imageTags = [
  {
    imageId: null,
    tag: "logo",
    usedCount: 0,
    pageViewCount: 0,
    clickCount: 0,
    enabled: true,
  },
  {
    imageId: null,
    tag: "banner",
    usedCount: 0,
    pageViewCount: 0,
    clickCount: 0,
    enabled: true,
  },
  {
    imageId: null,
    tag: "product",
    usedCount: 0,
    pageViewCount: 0,
    clickCount: 0,
    enabled: true,
  },
  {
    imageId: null,
    tag: "article",
    usedCount: 0,
    pageViewCount: 0,
    clickCount: 0,
    enabled: true,
  },
];

const robots = [
  {
    name: "默认数据",
    content: "",
    enabled: true,
  },
  {
    name: "测试数据",
    content: "# 测试",
    enabled: true,
  },
];

export async function initializeData() {
  try {
    const db = getDB();

    // 插入组件数据
    await db.insert(componentSchema).ignore().values(components);

    // 插入页面数据
    await db.insert(pageSchema).ignore().values(pages);

    // 插入机器人数据
    await db.insert(robotsSchema).ignore().values(robots);

    // 插入系统用户数据
    await db.insert(sysUserSchema).ignore().values(sysUser);

    // 插入权限数据
    await db.insert(permissionSchema).ignore().values(sysPermissions);

    // 插入角色数据
    await db.insert(roleSchema).ignore().values(sysRoles);

    // 插入文章分类数据
    await db.insert(articleCategorySchema).ignore().values(articleCategories);

    // 插入文章标签数据
    await db.insert(articleTagSchema).ignore().values(articleTags);

    // 插入文章数据
    await db.insert(articleSchema).ignore().values(articles);

    // 插入商品数据
    await db.insert(commoditySchema).ignore().values(commodities);

    // 插入商品 SKU 数据
    await db.insert(commoditySkuSchema).ignore().values(commoditySkus);

    // 插入图片标签数据
    await db.insert(imageLibraryTags).ignore().values(imageTags);
  } catch (error) {
    console.error("Error initializing data:", error);
    throw error;
  }
}
