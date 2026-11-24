export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  keywords?: string;
}

export interface Category extends SubCategory {
  children: SubCategory[];
}

export interface HomeBanner {
  img: string;
  alt: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
}

export const SITE = {
  name: 'Homesun: China Solar Panels Supplier',
  defaultDescription:
    'Homesun manufactures solar panels, modules, inverters and offers full solar solutions, factory based in China with worldwide shipping.',
  defaultKeywords: 'solar panels, china, supplier',
  phone: '+86 13905633017',
  email: 'info@hssolar.com',
  address: 'Industrial Zone, Ningguo, Xuancheng, China',
  wechatQr: '/Uploads/images/20241116/673877212cc64.jpg',
  logoLight: '/Uploads/images/logoen-dark.png',
  logoDark: '/Uploads/images/logoen.png',
  copyright: 'Copyright © 2026 Homesun Solar Technology Co., Ltd. All Rights Reserved.',
  web3formsKey: '007ddd91-be4f-4381-b504-f9464f95e06d',
};

export const POPULAR_TAGS = [
  { id: 5, name: 'Monofacial' },
  { id: 6, name: 'Bifacial' },
  { id: 7, name: '730W' },
];

// 后期更换无文字高清 Banner 图（建议 1920x720 或 1920x800），只需在此修改 img 和文案
export const HOME_BANNERS: HomeBanner[] = [
  {
    img: '/Uploads/images/20241119/673c9f32ace84.jpg',
    alt: 'Homesun High-Efficiency Solar Panels Manufacturer',
    badge: 'VERTICALLY INTEGRATED PV MANUFACTURER',
    title: 'High-Efficiency Solar Modules',
    highlight: 'Built for Global Scale',
    subtitle:
      'Automated production lines delivering N-Type TOPCon, HJT, and PERC modules up to 750Wp with TÜV and Intertek certification.',
    primaryText: 'Explore Solar Modules',
    primaryLink: '/category-1.html',
    secondaryText: 'Get a Factory Quote',
    secondaryLink: '/contact-us.html',
  },
  {
    img: '/Uploads/images/20241119/673c9f55de2e1.jpg',
    alt: 'Homesun Complete Solar Energy Storage Solution',
    badge: 'ONE-STOP ENERGY STORAGE',
    title: 'Smart Inverters &',
    highlight: 'Battery Storage Systems',
    subtitle:
      'Turnkey residential, commercial, and containerized BESS solutions engineered for reliable on-grid, hybrid, and off-grid power.',
    primaryText: 'Explore BESS Storage',
    primaryLink: '/category-4.html',
    secondaryText: 'Request System Design',
    secondaryLink: '/contact-us.html',
  },
  {
    img: '/Uploads/images/20241127/67466cc896043.jpg',
    alt: 'Homesun Global Commercial & Utility PV Projects',
    badge: '110+ COUNTRIES SERVED',
    title: 'Proven Commercial &',
    highlight: 'Utility Solar Projects',
    subtitle:
      'Trusted by over 2,000 global partners for end-to-end solar supply, technical engineering support, and worldwide logistics.',
    primaryText: 'View Case Studies',
    primaryLink: '/project.html',
    secondaryText: 'Contact Engineering',
    secondaryLink: '/contact-us.html',
  },
];

export const PRODUCT_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Solar Module',
    description:
      'Homesun offers a wide variety of products related to solar including panels, modules, inverters, storage systems, and accessories. Solar modules include N-Type, P-Type and HJT.',
    keywords: 'solar module',
    children: [
      { id: 2, name: 'N-Type PV Module' },
      { id: 8, name: 'P-Type PV Module' },
      { id: 9, name: 'Shingled PV Module' },
      { id: 10, name: 'Off Grid Solar Panel' },
      { id: 11, name: 'HJT PV Module' },
    ],
  },
  {
    id: 3,
    name: 'Inverter',
    children: [
      { id: 12, name: 'Grid Tie Inverter' },
      { id: 13, name: 'Hybrid Inverter' },
      { id: 14, name: 'Off Grid Inverter' },
    ],
  },
  {
    id: 4,
    name: 'Battery Storage',
    children: [
      { id: 15, name: 'Residential BESS' },
      { id: 16, name: 'Commercial BESS' },
      { id: 17, name: 'Container BESS' },
      { id: 18, name: 'Lead Acid Battery' },
    ],
  },
  {
    id: 5,
    name: 'Solar Solution',
    children: [
      { id: 19, name: 'On Grid System' },
      { id: 20, name: 'Hybrid System' },
      { id: 21, name: 'Off Grid System' },
    ],
  },
  {
    id: 6,
    name: 'Mounting System',
    children: [
      { id: 22, name: 'Roof' },
      { id: 23, name: 'Ground' },
    ],
  },
  {
    id: 7,
    name: 'Accessories',
    children: [
      { id: 24, name: 'PV Connector' },
      { id: 25, name: 'PV Cable' },
      { id: 26, name: 'DC Protection Device' },
      { id: 27, name: 'Solar Pump' },
      { id: 28, name: 'MPPT Controller' },
      { id: 29, name: 'Optimizer' },
      { id: 30, name: 'Solar Street Light' },
    ],
  },
];

// 额外独立分类（原清单中存在 category-31.html，可按需修改名称）
export const EXTRA_CATEGORIES: SubCategory[] = [
  { id: 31, name: 'Other Solar Products' },
];

// 扁平化获取所有分类（含一级、二级和额外分类）
export function getAllCategories() {
  const flat: Array<{
    id: number;
    name: string;
    description: string;
    keywords: string;
    childIds: number[];
  }> = [];

  for (const parent of PRODUCT_CATEGORIES) {
    flat.push({
      id: parent.id,
      name: parent.name,
      description: parent.description || `${parent.name} - ${SITE.defaultDescription}`,
      keywords: parent.keywords || parent.name,
      childIds: [parent.id, ...parent.children.map((c) => c.id)],
    });
    for (const child of parent.children) {
      flat.push({
        id: child.id,
        name: child.name,
        description: child.description || `${child.name} - ${SITE.defaultDescription}`,
        keywords: child.keywords || child.name,
        childIds: [child.id],
      });
    }
  }

  for (const extra of EXTRA_CATEGORIES) {
    flat.push({
      id: extra.id,
      name: extra.name,
      description: extra.description || `${extra.name} - ${SITE.defaultDescription}`,
      keywords: extra.keywords || extra.name,
      childIds: [extra.id],
    });
  }

  return flat;
}