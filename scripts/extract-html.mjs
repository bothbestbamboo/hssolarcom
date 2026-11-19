import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const OLD_DIR = path.resolve('old-site');
const OUT_NEWS = path.resolve('src/content/news');
const OUT_PRODUCTS = path.resolve('src/content/products');
const OUT_PAGES = path.resolve('src/content/pages');

[OUT_NEWS, OUT_PRODUCTS, OUT_PAGES].forEach((d) => fs.mkdirSync(d, { recursive: true }));

const CASE_IDS = new Set([1, 2, 3, 11, 15, 18]);
const SOLUTION_IDS = new Set([4, 5]);
const KNOWLEDGE_IDS = new Set([8, 9, 13, 14]);
const HOT_PRODUCT_IDS = new Set([1, 2, 4, 5, 6]);

const TAG_MAP = {
  5: 'Monofacial',
  6: 'Bifacial',
  7: '730W',
};

// 已排除独立 .astro 页面（play-solar, faq, contact-us）与原站 404 的 pages-8/9/13/14
const SINGLE_PAGES = [
  'about-us',
  'why-we-different',
  'technical-services',
  'privacy-policy',
];

const escapeYaml = (str = '') =>
  `"${String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim()}"`;

function extractMainHtml($) {
  const selectors = [
    '.news_detail .content',
    '.pro_detail .content',
    '.article_content',
    '.detail_content',
    '.about_box',
    '.phone',
    '.n_main',
    'main',
  ];
  for (const sel of selectors) {
    const el = $(sel).first();
    if (el.length && el.text().trim().length > 20) {
      return el.html().trim();
    }
  }
  return '';
}

const files = fs.readdirSync(OLD_DIR).filter((f) => f.endsWith('.html'));

// =======================================================
// 第一步：反扫 category-*.html 和 category-tags-*.html
// 自动建立「产品 ID -> 所属分类列表 / 标签列表」映射表
// =======================================================
const productCategoriesMap = new Map(); // prodId -> Set<catId>
const productTagsMap = new Map();       // prodId -> Set<tagName>
const categoryReport = [];

for (const file of files) {
  const catMatch = file.match(/^category-(\d+)\.html$/);
  const tagMatch = file.match(/^category-tags-(\d+)\.html$/);
  if (!catMatch && !tagMatch) continue;

  const html = fs.readFileSync(path.join(OLD_DIR, file), 'utf8');
  const $ = cheerio.load(html);

  const seoTitle = $('title').text().trim();
  const catHeading = $('.mbx h2, .mbx_section .maintitle').first().text().trim() || seoTitle;

  // 去掉头尾，避免误扫公共导航里的链接
  $('header, #footer, script, style').remove();

  const foundProdIds = new Set();
  $('a[href*="product-detail-"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const m = href.match(/product-detail-(\d+)\.html/);
    if (m) foundProdIds.add(Number(m[1]));
  });

  if (catMatch) {
    const catId = Number(catMatch[1]);
    for (const pid of foundProdIds) {
      if (!productCategoriesMap.has(pid)) productCategoriesMap.set(pid, new Set());
      productCategoriesMap.get(pid).add(catId);
    }
    if (foundProdIds.size > 0 || catId === 31) {
      categoryReport.push({
        file,
        catId,
        name: catHeading,
        seoTitle,
        products: [...foundProdIds].sort((a, b) => a - b),
      });
    }
  }

  if (tagMatch) {
    const tagId = Number(tagMatch[1]);
    const tagName = TAG_MAP[tagId];
    if (tagName) {
      for (const pid of foundProdIds) {
        if (!productTagsMap.has(pid)) productTagsMap.set(pid, new Set());
        productTagsMap.get(pid).add(tagName);
      }
    }
  }
}

console.log('\n=== 旧站分类扫描报告（含产品归属与 category-31 信息） ===');
categoryReport
  .sort((a, b) => a.catId - b.catId)
  .forEach((c) => {
    console.log(
      `[category-${c.catId}] 标题: "${c.name}" | SEO: "${c.seoTitle}" | 产品ID: [${c.products.join(', ')}]`
    );
  });

// =======================================================
// 第二步：提取 news / products / 单页面 Markdown
// =======================================================
let newsCount = 0;
let prodCount = 0;
let pageCount = 0;

for (const file of files) {
  const html = fs.readFileSync(path.join(OLD_DIR, file), 'utf8');
  const $ = cheerio.load(html);

  const seoTitle = $('title').text().trim();
  if (seoTitle === '404') continue; // 自动跳过原站 404 页面

  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const h1 =
    $('h1').not('header h1').first().text().trim() ||
    $('.mbx h2, .mbx_section .maintitle').first().text().trim() ||
    seoTitle.split('-')[0].trim();

  const firstImg =
    $('.n_main img, .detail_content img, .phone img, .pro_img img, main img')
      .first()
      .attr('src') || '/Uploads/images/20241119/673c9f32ace84.jpg';

  const bodyHtml = extractMainHtml($);

  // 1. 提取 news-{id}.html
  const newsMatch = file.match(/^news-(\d+)\.html$/);
  if (newsMatch) {
    const id = Number(newsMatch[1]);
    let type = 'news';
    if (CASE_IDS.has(id)) type = 'case';
    else if (SOLUTION_IDS.has(id)) type = 'solution';
    else if (KNOWLEDGE_IDS.has(id)) type = 'knowledge';

    const dateText = $('.date, .time').first().text().trim() || '2025-01-01';
    const md = `---
id: ${id}
type: ${escapeYaml(type)}
title: ${escapeYaml(h1)}
date: ${escapeYaml(dateText)}
image: ${escapeYaml(firstImg)}
summary: ${escapeYaml(description || h1)}
seoTitle: ${escapeYaml(seoTitle)}
description: ${escapeYaml(description)}
keywords: ${escapeYaml(keywords)}
---

${bodyHtml}
`;
    fs.writeFileSync(path.join(OUT_NEWS, `news-${id}.md`), md, 'utf8');
    newsCount++;
    continue;
  }

  // 2. 提取 product-detail-{id}.html
  const prodMatch = file.match(/^product-detail-(\d+)\.html$/);
  if (prodMatch) {
    const id = Number(prodMatch[1]);
    const catIds = productCategoriesMap.has(id)
      ? [...productCategoriesMap.get(id)].sort((a, b) => a - b)
      : [1];
    const tags = productTagsMap.has(id) ? [...productTagsMap.get(id)] : [];

    // 提取产品图册里的多张图
    const gallerySet = new Set();
    $('#pro_img_gallery img, .pro_img img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) gallerySet.add(src);
    });
    const gallery = gallerySet.size > 0 ? [...gallerySet] : [firstImg];

    const md = `---
id: ${id}
title: ${escapeYaml(h1)}
categoryIds: [${catIds.join(', ')}]
tags: [${tags.map(escapeYaml).join(', ')}]
isHot: ${HOT_PRODUCT_IDS.has(id)}
image: ${escapeYaml(gallery[0])}
gallery: [${gallery.map(escapeYaml).join(', ')}]
summary: ${escapeYaml(description)}
seoTitle: ${escapeYaml(seoTitle)}
description: ${escapeYaml(description)}
keywords: ${escapeYaml(keywords)}
---

${bodyHtml}
`;
    fs.writeFileSync(path.join(OUT_PRODUCTS, `product-${id}.md`), md, 'utf8');
    prodCount++;
    continue;
  }

  // 3. 提取剩余独立单页面
  const slug = file.replace(/\.html$/, '');
  if (SINGLE_PAGES.includes(slug)) {
    const md = `---
title: ${escapeYaml(h1)}
seoTitle: ${escapeYaml(seoTitle)}
description: ${escapeYaml(description)}
keywords: ${escapeYaml(keywords)}
---

${bodyHtml}
`;
    fs.writeFileSync(path.join(OUT_PAGES, `${slug}.md`), md, 'utf8');
    pageCount++;
  }
}

console.log(
  `\n提取完成！共生成：新闻/案例 ${newsCount} 篇，产品 ${prodCount} 个，单页 ${pageCount} 个。`
);