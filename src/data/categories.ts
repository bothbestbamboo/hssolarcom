export interface CategoryItem {
  id: number;
  name: string;
  parentId?: number;
  hidden?: boolean;
  seoTitle?: string;
  description?: string;
  bannerImg?: string;
}

export const CATEGORIES: CategoryItem[] = [
  // ================= 一级分类 =================
  {
    id: 1,
    name: 'Solar Module',
    seoTitle: 'Solar Module - Homesun Solar',
    description:
      'High-efficiency N-Type TOPCon, HJT, PERC, Shingled and Off-Grid solar PV modules directly from Homesun China factory.',
  },
  {
    id: 3,
    name: 'Inverter',
    seoTitle: 'Solar Inverter - Homesun Solar',
    description:
      'Grid-tie, hybrid, and off-grid solar inverters engineered for residential, commercial, and utility PV systems.',
  },
  {
    id: 4,
    name: 'Battery Storage',
    seoTitle: 'Battery Storage (BESS) - Homesun Solar',
    description:
      'Residential, commercial, container lithium BESS and deep-cycle lead acid batteries for reliable energy storage.',
  },
  {
    id: 5,
    name: 'Solar Solution',
    seoTitle: 'Complete Solar Power Solutions - Homesun Solar',
    description:
      'Turnkey on-grid, hybrid, and off-grid solar power systems tailored for global residential and industrial projects.',
  },
  {
    id: 6,
    name: 'Mounting System',
    seoTitle: 'Solar Mounting System - Homesun Solar',
    description:
      'Durable aluminum and galvanized steel roof and ground solar mounting structures.',
  },
  {
    id: 7,
    name: 'Accessories',
    seoTitle: 'Solar System Accessories - Homesun Solar',
    description:
      'PV connectors, solar cables, DC protection devices, solar pumps, MPPT controllers, optimizers, and solar street lights.',
  },

  // ================= 二级分类：Solar Module (parentId: 1) =================
  { id: 2, name: 'N-Type PV Module', parentId: 1 },
  { id: 8, name: 'P-Type PV Module', parentId: 1 },
  { id: 9, name: 'Shingled PV Module', parentId: 1 },
  { id: 10, name: 'Off Grid Solar Panel', parentId: 1 },
  { id: 11, name: 'HJT PV Module', parentId: 1 },

  // ================= 二级分类：Inverter (parentId: 3) =================
  { id: 12, name: 'Grid Tie Inverter', parentId: 3 },
  { id: 13, name: 'Hybrid Inverter', parentId: 3 },
  { id: 14, name: 'Off Grid Inverter', parentId: 3 },

  // ================= 二级分类：Battery Storage (parentId: 4) =================
  { id: 15, name: 'Residential BESS', parentId: 4 },
  { id: 16, name: 'Commercial BESS', parentId: 4 },
  { id: 17, name: 'Container BESS', parentId: 4 },
  { id: 18, name: 'Lead Acid Battery', parentId: 4 },

  // ================= 二级分类：Solar Solution (parentId: 5) =================
  { id: 19, name: 'On Grid System', parentId: 5 },
  { id: 20, name: 'Hybrid System', parentId: 5 },
  { id: 21, name: 'Off Grid System', parentId: 5 },

  // ================= 二级分类：Mounting System (parentId: 6) =================
  { id: 22, name: 'Roof', parentId: 6 },
  { id: 23, name: 'Ground', parentId: 6 },

  // ================= 二级分类：Accessories (parentId: 7) =================
  { id: 24, name: 'PV Connector', parentId: 7 },
  { id: 25, name: 'PV Cable', parentId: 7 },
  { id: 26, name: 'DC Protection Device', parentId: 7 },
  { id: 27, name: 'Solar Pump', parentId: 7 },
  { id: 28, name: 'MPPT Controller', parentId: 7 },
  { id: 29, name: 'Optimizer', parentId: 7 },
  { id: 30, name: 'Solar Street Light', parentId: 7 },

  // ================= 原站 category-31.html 为全部产品页（侧边栏隐藏，保留URL不404） =================
  {
    id: 31,
    name: 'All Products',
    hidden: true,
    seoTitle: 'All Products - Homesun Solar',
    description:
      'Explore all Homesun Solar PV modules, inverters, battery storage systems, and solar accessories.',
  },
];

// 可供 Header / Footer / Sidebar 复用的快捷辅助函数（自动过滤 hidden 项）
export const getTopCategories = () =>
  CATEGORIES.filter((c) => !c.parentId && !c.hidden);
export const getSubCategories = (parentId: number) =>
  CATEGORIES.filter((c) => c.parentId === parentId && !c.hidden);