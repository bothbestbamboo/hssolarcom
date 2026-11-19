import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.hssolar.com';
const NEWS_DIR = path.resolve('src/content/news');
const CONTENT_DIR = path.resolve('src/content');
const PUBLIC_DIR = path.resolve('public');
const UPLOADS_IMAGES_DIR = path.join(PUBLIC_DIR, 'Uploads', 'images');

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const coverMap = new Map(); // id -> /Uploads/...
const visitedUrls = new Set();

function normalizeImg(img = '') {
  const s = img.trim();
  if (!s || s.includes('news.jpg') || s.includes('logo') || s.startsWith('data:')) return '';
  if (/^https?:\/\//i.test(s)) {
    try {
      return new URL(s).pathname;
    } catch {
      return '';
    }
  }
  return '/' + s.replace(/^\/+/, '');
}

function toAbsUrl(href) {
  try {
    const u = new URL(href, BASE_URL);
    if (u.origin !== new URL(BASE_URL).origin) return '';
    return u.href;
  } catch {
    return '';
  }
}

async function crawlListPage(url) {
  if (!url || visitedUrls.has(url)) return [];
  visitedUrls.add(url);

  try {
    const res = await fetch(url, { headers: HEADERS, redirect: 'follow' });
    if (!res.ok) {
      console.log(`  [跳过 ${res.status}] ${url}`);
      return [];
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    let found = 0;

    $('.news ul li, .news_list li, .blog_list li').each((_, li) => {
      const href = $(li).find('a[href*="news-"]').first().attr('href') || '';
      const m = href.match(/news-(\d+)\.html/);
      const imgEl = $(li).find('img').first();
      const rawImg = imgEl.attr('data-src') || imgEl.attr('src') || '';
      const img = normalizeImg(rawImg);

      if (m && img) {
        const id = Number(m[1]);
        if (!coverMap.has(id)) {
          coverMap.set(id, img);
          found++;
        }
      }
    });

    // 提取真实分页链接（兼容 ThinkPHP 各种伪静态分页格式）
    const nextPages = [];
    $('.page_p a, .pagination a, .pages a').each((_, a) => {
      const h = $(a).attr('href') || '';
      if (!h || h.startsWith('javascript') || h === '#') return;
      const abs = toAbsUrl(h);
      if (abs && !visitedUrls.has(abs)) nextPages.push(abs);
    });

    console.log(`  [扫描完成] ${url} -> 新增封面 ${found} 张`);
    return nextPages;
  } catch (err) {
    console.log(`  [请求失败] ${url}: ${err.message}`);
    return [];
  }
}

// =======================================================
// 策略 1：抓取原站新闻列表与真实分页
// =======================================================
console.log('=== 第一步：尝试从原站抓取真实分页封面图 ===');
const queue = [
  `${BASE_URL}/news.html`,
  `${BASE_URL}/news-list-3.html`,
  // 兼容常见 ThinkPHP 伪静态分页格式
  ...[2, 3, 4, 5, 6, 7, 8].flatMap((p) => [
    `${BASE_URL}/news-list-3-p-${p}.html`,
    `${BASE_URL}/news-p-${p}.html`,
    `${BASE_URL}/news/p/${p}.html`,
  ]),
];

let scannedCount = 0;
while (queue.length > 0 && scannedCount < 40) {
  const nextUrl = queue.shift();
  if (visitedUrls.has(nextUrl)) continue;
  scannedCount++;
  const discovered = await crawlListPage(nextUrl);
  for (const u of discovered) {
    if (!visitedUrls.has(u)) queue.unshift(u);
  }
}

// =======================================================
// 策略 2：收集全站已占用的图片，对仍无封面的文章按 YYYYMMDD 文件夹本地匹配
// =======================================================
console.log('\n=== 第二步：扫描本地 public/Uploads/images/ 日期目录 ===');

const usedImages = new Set([
  '/Uploads/images/20241119/673c39df93256.png',
  '/Uploads/images/20241119/673c39d87f714.png',
  '/Uploads/images/20241119/673c9f32ace84.jpg',
  '/Uploads/images/20241119/673c9f55de2e1.jpg',
  '/Uploads/images/20241127/67466cc896043.jpg',
  '/Uploads/images/20241116/673877212cc64.jpg',
]);

function collectUsed(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectUsed(full);
    else if (entry.name.endsWith('.md')) {
      const txt = fs.readFileSync(full, 'utf8');
      for (const m of txt.matchAll(/\/Uploads\/[^"'\s)]+/g)) {
        usedImages.add(m[0]);
      }
    }
  }
}
collectUsed(CONTENT_DIR);
for (const img of coverMap.values()) usedImages.add(img);

let updatedFromWeb = 0;
let updatedFromLocalDate = 0;
let downloaded = 0;
const stillDefault = [];

const mdFiles = fs
  .readdirSync(NEWS_DIR)
  .filter((f) => /^news-(\d+)\.md$/.test(f))
  .sort((a, b) => Number(b.match(/\d+/)[0]) - Number(a.match(/\d+/)[0]));

for (const file of mdFiles) {
  const id = Number(file.match(/^news-(\d+)\.md$/)[1]);
  const mdPath = path.join(NEWS_DIR, file);
  const content = fs.readFileSync(mdPath, 'utf8');

  const typeMatch = content.match(/^type:\s*"([^"]+)"/m);
  if (typeMatch && typeMatch[1] !== 'news') continue;

  const imgMatch = content.match(/^image:\s*"([^"]*)"/m);
  const currentImg = imgMatch ? imgMatch[1] : '';
  const isDefaultImg = !currentImg || currentImg.includes('news.jpg');

  let targetImg = '';
  let source = '';

  if (coverMap.has(id)) {
    targetImg = coverMap.get(id);
    source = 'web';
  } else if (isDefaultImg) {
    // 尝试按发布日期 YYYYMMDD 匹配本地未占用图片
    const dateMatch = content.match(/^date:\s*"(\d{4})-(\d{2})-(\d{2})/m);
    if (dateMatch) {
      const ymd = `${dateMatch[1]}${dateMatch[2]}${dateMatch[3]}`;
      const dayDir = path.join(UPLOADS_IMAGES_DIR, ymd);
      if (fs.existsSync(dayDir)) {
        const candidates = fs
          .readdirSync(dayDir)
          .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
          .map((f) => `/Uploads/images/${ymd}/${f}`)
          .filter((p) => !usedImages.has(p));

        if (candidates.length > 0) {
          targetImg = candidates[0];
          usedImages.add(targetImg);
          source = 'local-date';
        }
      }
    }
  }

  if (targetImg && targetImg !== currentImg) {
    // 若来自线上且本地不存在，自动补下载
    const diskPath = path.join(PUBLIC_DIR, targetImg.replace(/^\//, ''));
    if (!fs.existsSync(diskPath) && source === 'web') {
      try {
        const imgRes = await fetch(`${BASE_URL}${targetImg}`, { headers: HEADERS });
        if (imgRes.ok) {
          fs.mkdirSync(path.dirname(diskPath), { recursive: true });
          fs.writeFileSync(diskPath, Buffer.from(await imgRes.arrayBuffer()));
          downloaded++;
        }
      } catch {}
    }

    const next = content.replace(/^image:\s*".*"$/m, `image: "${targetImg}"`);
    fs.writeFileSync(mdPath, next, 'utf8');
    if (source === 'web') updatedFromWeb++;
    if (source === 'local-date') updatedFromLocalDate++;
  } else if (isDefaultImg) {
    const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
    stillDefault.push(`news-${id}.md (${titleMatch ? titleMatch[1].slice(0, 40) : ''})`);
  }
}

console.log('\n=== 封面图同步汇总 ===');
console.log(`- 原站分页抓回并更新：${updatedFromWeb} 篇（补下载图片 ${downloaded} 张）`);
console.log(`- 本地日期目录自动匹配：${updatedFromLocalDate} 篇`);
console.log(`- 仍使用默认封面的纯文新闻：${stillDefault.length} 篇`);
if (stillDefault.length > 0) {
  console.log('  （这些文章在原站及本地目录均未找到独立封面，后续可按需手动替换 image 字段）');
}