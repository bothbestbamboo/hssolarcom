import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const OLD_DIR = path.resolve('old-site');
const PUBLIC_DIR = path.resolve('public');
const OUT_NEWS = path.resolve('src/content/news');

const CASE_IDS = new Set([1, 2, 3, 11, 15, 18]);
const SOLUTION_IDS = new Set([4, 5]);
const KNOWLEDGE_IDS = new Set([8, 9, 13, 14]);

// 首页已知的封面图兜底（涵盖解决方案、知识库及 11 月 9 日最新文章）
const KNOWN_IMAGES = {
  4: '/Uploads/images/20241115/6736be956cfad.png',
  5: '/Uploads/images/20241125/6744731f67c5d.jpg',
  8: '/Uploads/images/20241116/67386ab8880da.jpg',
  9: '/Uploads/images/20241116/67386b51b8d3e.jpg',
  13: '/Uploads/images/20241123/67417df4c6112.jpg',
  14: '/Uploads/images/20241125/67446bdacd824.jpg',
};

const DEFAULT_NEWS_IMG = '/Public/theme/default/image/news.jpg';

const escapeYaml = (str = '') =>
  `"${String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim()}"`;

function normalizePath(p = '') {
  let s = String(p).trim();
  if (!s || /^https?:\/\//i.test(s) || s.startsWith('data:')) return s;
  s = s.replace(/^(\.\.\/|\.\/)+/, '');
  s = s.replace(/^\/+/, '/');
  if (s.startsWith('Uploads/') || s.startsWith('Public/')) {
    s = '/' + s;
  }
  return s;
}

function extractDateStr(text = '') {
  const m = String(text).match(/\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}:\d{2})?/);
  return m ? m[0] : '';
}

// =======================================================
// 第一步：修复全项目 src/ 下的 //Uploads/ 和 //Public/ 双斜杠
// =======================================================
function walkFiles(dir, exts, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, exts, list);
    else if (exts.some((ext) => entry.name.endsWith(ext))) list.push(full);
  }
  return list;
}

let fixedSlashCount = 0;
for (const filePath of walkFiles(path.resolve('src'), ['.md', '.astro', '.ts'])) {
  const orig = fs.readFileSync(filePath, 'utf8');
  const next = orig
    .replace(/\/{2,}(Uploads|Public)\//g, '/$1/')
    .replace(/(["'])(Uploads|Public)\//g, '$1/$2/');
  if (next !== orig) {
    fs.writeFileSync(filePath, next, 'utf8');
    fixedSlashCount++;
  }
}
console.log(`已自动修复双斜杠/相对路径文件数: ${fixedSlashCount}`);

// =======================================================
// 第二步：汇总 news-data.json、project.html、index.html 的封面图与日期
// =======================================================
const metaMap = new Map(); // id -> { date, image, summary }

function mergeMeta(id, patch) {
  const cur = metaMap.get(id) || {};
  metaMap.set(id, {
    date: cur.date || patch.date || '',
    image: cur.image || patch.image || '',
    summary: cur.summary || patch.summary || '',
  });
}

// 1) 读取 project.html（精确获取 6 个案例的封面图、日期和摘要）
const projectHtmlPath = path.join(OLD_DIR, 'project.html');
if (fs.existsSync(projectHtmlPath)) {
  const $p = cheerio.load(fs.readFileSync(projectHtmlPath, 'utf8'));
  $p('.news ul li').each((_, li) => {
    const href = $p(li).find('a[href*="news-"]').first().attr('href') || '';
    const m = href.match(/news-(\d+)\.html/);
    if (!m) return;
    const id = Number(m[1]);
    CASE_IDS.add(id);
    mergeMeta(id, {
      date: extractDateStr($p(li).find('.day').text()),
      image: normalizePath($p(li).find('img').first().attr('src') || ''),
      summary: $p(li).find('.text p').first().text().trim(),
    });
  });
}

// 2) 读取 news-data.json（优先找 old-site/news-data.json，其次找根目录）
const jsonCandidates = [
  path.join(OLD_DIR, 'news-data.json'),
  path.resolve('news-data.json'),
];
for (const jp of jsonCandidates) {
  if (fs.existsSync(jp)) {
    try {
      const arr = JSON.parse(fs.readFileSync(jp, 'utf8'));
      for (const item of arr) {
        const id = Number(item.id);
        if (!id) continue;
        mergeMeta(id, {
          date: extractDateStr(item.date),
          image: item.image ? normalizePath(item.image) : '',
          summary: item.summary || '',
        });
      }
      console.log(`已加载元数据: ${jp} (${arr.length} 条)`);
      break;
    } catch (e) {
      console.warn(`解析 ${jp} 失败:`, e.message);
    }
  }
}

// 3) 读取 old-site/index.html（补充首页案例/方案/知识/新闻封面图）
const indexHtmlPath = path.join(OLD_DIR, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  const $i = cheerio.load(fs.readFileSync(indexHtmlPath, 'utf8'));
  $i('.case_content .moudle, .solution_content li, .news_content .moudle').each((_, el) => {
    const href = $i(el).find('a[href*="news-"]').first().attr('href') || '';
    const m = href.match(/news-(\d+)\.html/);
    if (!m) return;
    const id = Number(m[1]);
    mergeMeta(id, {
      date: extractDateStr($i(el).find('.date').text()),
      image: normalizePath($i(el).find('img').first().attr('src') || ''),
      summary: $i(el).find('.text').first().text().trim(),
    });
  });
}

// =======================================================
// 第三步：重新精准提取所有 old-site/news-*.html
// =======================================================
const newsFiles = fs
  .readdirSync(OLD_DIR)
  .filter((f) => /^news-(\d+)\.html$/.test(f));

let updatedNews = 0;

for (const file of newsFiles) {
  const id = Number(file.match(/^news-(\d+)\.html$/)[1]);
  const html = fs.readFileSync(path.join(OLD_DIR, file), 'utf8');
  const $ = cheerio.load(html);

  const seoTitle = $('title').text().trim();
  if (seoTitle === '404') continue;

  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const title =
    $('.blog_main h1').first().text().trim() ||
    $('h1').not('header h1').first().text().trim() ||
    seoTitle.split('-')[0].trim();

  // 关键修复：从 .blog-info 提取真实发布时间
  const detailDate = extractDateStr($('.blog-info, .day, .date, .time').first().text());
  const meta = metaMap.get(id) || {};
  const finalDate = detailDate || meta.date || '2025-01-01';

  // 只抓纯净正文 .blog_p，并规范化内部图片和链接路径
  const bodyEl = $('.blog_p').first().length
    ? $('.blog_p').first()
    : $('.detail_content, .article_content, .phone').first();

  let bodyFirstImg = '';
  if (bodyEl.length) {
    bodyEl.find('img').each((_, img) => {
      const src = normalizePath($(img).attr('src') || '');
      if (src) {
        $(img).attr('src', src);
        if (!bodyFirstImg) bodyFirstImg = src;
      }
    });
  }
  const bodyHtml = bodyEl.length ? bodyEl.html().trim() : '';

  const finalImage =
    normalizePath(meta.image) ||
    KNOWN_IMAGES[id] ||
    bodyFirstImg ||
    DEFAULT_NEWS_IMG;

  let type = 'news';
  if (CASE_IDS.has(id)) type = 'case';
  else if (SOLUTION_IDS.has(id)) type = 'solution';
  else if (KNOWLEDGE_IDS.has(id)) type = 'knowledge';

  const summary = meta.summary || description || title;

  const md = `---
id: ${id}
type: ${escapeYaml(type)}
title: ${escapeYaml(title)}
date: ${escapeYaml(finalDate)}
image: ${escapeYaml(finalImage)}
summary: ${escapeYaml(summary)}
seoTitle: ${escapeYaml(seoTitle)}
description: ${escapeYaml(description)}
keywords: ${escapeYaml(keywords)}
---

${bodyHtml}
`;

  fs.writeFileSync(path.join(OUT_NEWS, `news-${id}.md`), md, 'utf8');
  updatedNews++;
}

console.log(`已重新生成新闻/案例/方案/知识文章: ${updatedNews} 篇`);

// =======================================================
// 第四步：全面巡检 public/ 目录，排查真实缺失的图片文件
// =======================================================
console.log('\n=== 图片资产体检报告 ===');
const hasPublicUploads = fs.existsSync(path.join(PUBLIC_DIR, 'Uploads'));
const hasPublicStatic = fs.existsSync(path.join(PUBLIC_DIR, 'Public'));
console.log(`public/Uploads 目录存在: ${hasPublicUploads ? '✅ 是' : '❌ 否（请把原站 Uploads 文件夹复制到 public/ 下！）'}`);
console.log(`public/Public  目录存在: ${hasPublicStatic ? '✅ 是' : '❌ 否（请把原站 Public 文件夹复制到 public/ 下！）'}`);

const missingImages = new Set();
for (const mdPath of walkFiles(path.resolve('src/content'), ['.md'])) {
  const txt = fs.readFileSync(mdPath, 'utf8');
  const matches = txt.matchAll(/\/(Uploads|Public)\/[^"'\s)]+/g);
  for (const m of matches) {
    const rel = m[0];
    const diskPath = path.join(PUBLIC_DIR, rel.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      missingImages.add(rel);
    }
  }
}

if (missingImages.size === 0) {
  console.log('✅ 所有内容引用的本地图片均在 public/ 中真实存在！');
} else {
  console.log(`⚠️ 发现 ${missingImages.size} 张缺失图片（前 15 张）：`);
  [...missingImages].slice(0, 15).forEach((p) => console.log('  - ' + p));
}