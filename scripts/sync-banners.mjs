import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const OLD_DIR = path.resolve('old-site');
const PUBLIC_DIR = path.resolve('public');

function normalizeImg(src = '') {
  let s = String(src).trim();
  if (!s || /^https?:\/\//i.test(s) || s.startsWith('data:')) return '';
  s = s.replace(/^(\.\.\/|\.\/)+/, '');
  s = '/' + s.replace(/^\/+/, '');
  return s;
}

function readOldBanner(htmlFile) {
  const full = path.join(OLD_DIR, htmlFile);
  if (!fs.existsSync(full)) return '';
  const $ = cheerio.load(fs.readFileSync(full, 'utf8'));
  const img = $('.inner_banner img').first();
  if (!img.length) return '';
  return normalizeImg(img.attr('src') || img.attr('data-src') || '');
}

const usedBanners = new Set();

// =======================================================
// 1. 更新 src/data/categories.ts（匹配 category-1 ~ category-31 原版 Banner）
// =======================================================
const categoriesPath = path.resolve('src/data/categories.ts');
if (fs.existsSync(categoriesPath)) {
  let catCode = fs.readFileSync(categoriesPath, 'utf8');
  const fallbackCatBanner = readOldBanner('category.html') || readOldBanner('category-1.html');
  let catUpdated = 0;

  for (let id = 1; id <= 31; id++) {
    const banner = readOldBanner(`category-${id}.html`) || fallbackCatBanner;
    if (!banner) continue;
    usedBanners.add(banner);

    const objRegex = new RegExp(`\\{[^{}]*\\bid:\\s*${id}\\b[^{}]*\\}`, 's');
    const match = catCode.match(objRegex);
    if (!match) continue;

    let block = match[0];
    if (/bannerImg\s*:/.test(block)) {
      block = block.replace(/bannerImg\s*:\s*['"][^'"]*['"]/, `bannerImg: '${banner}'`);
    } else {
      const trimmedEnd = block.replace(/\s*\}$/, '');
      const needsComma = !trimmedEnd.trimEnd().endsWith(',');
      const isMultiline = block.includes('\n');
      if (isMultiline) {
        block = `${trimmedEnd}${needsComma ? ',' : ''}\n    bannerImg: '${banner}',\n  }`;
      } else {
        block = `${trimmedEnd}${needsComma ? ',' : ''} bannerImg: '${banner}' }`;
      }
    }

    if (block !== match[0]) {
      catCode = catCode.replace(match[0], block);
      catUpdated++;
    }
  }

  fs.writeFileSync(categoriesPath, catCode, 'utf8');
  console.log(`✅ categories.ts 已匹配更新 ${catUpdated} 个产品分类的专属 Banner`);
}

// =======================================================
// 2. 更新 src/content/pages/*.md 单页的 bannerImg
// =======================================================
const pagesDir = path.resolve('src/content/pages');
if (fs.existsSync(pagesDir)) {
  for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const banner = readOldBanner(`${slug}.html`);
    if (!banner) continue;
    usedBanners.add(banner);

    const mdPath = path.join(pagesDir, file);
    let md = fs.readFileSync(mdPath, 'utf8');
    if (/^bannerImg:/m.test(md)) {
      md = md.replace(/^bannerImg:\s*".*"$/m, `bannerImg: "${banner}"`);
    } else {
      md = md.replace(/^(title:\s*".*")$/m, `$1\nbannerImg: "${banner}"`);
    }
    fs.writeFileSync(mdPath, md, 'utf8');
    console.log(`✅ 单页 ${file} -> ${banner}`);
  }
}

// =======================================================
// 3. 更新各独立 .astro 页面模板的 bannerImg
// =======================================================
const astroTargets = [
  { astro: 'src/pages/category.astro', html: 'category.html' },
  { astro: 'src/pages/category-tags-[id].astro', html: 'category-tags-5.html', fallback: 'category.html' },
  { astro: 'src/pages/contact-us.astro', html: 'contact-us.html' },
  { astro: 'src/pages/faq.astro', html: 'faq.html' },
  { astro: 'src/pages/news.astro', html: 'news.html' },
  { astro: 'src/pages/news-list-3.astro', html: 'news-list-3.html', fallback: 'news.html' },
  { astro: 'src/pages/project.astro', html: 'project.html' },
  { astro: 'src/pages/play-solar.astro', html: 'play-solar.html' },
];

for (const item of astroTargets) {
  const astroPath = path.resolve(item.astro);
  if (!fs.existsSync(astroPath)) continue;

  const banner = readOldBanner(item.html) || (item.fallback ? readOldBanner(item.fallback) : '');
  if (!banner) {
    console.log(`⚠️ 未在 old-site/${item.html} 中找到 .inner_banner 图片`);
    continue;
  }
  usedBanners.add(banner);

  let code = fs.readFileSync(astroPath, 'utf8');
  // 匹配 <InnerBanner ... bannerImg="..." /> 或 play-solar.astro 里的 <img src="..." />
  if (/bannerImg="[^"]*"/.test(code)) {
    code = code.replace(/bannerImg="[^"]*"/, `bannerImg="${banner}"`);
  } else if (item.astro.endsWith('play-solar.astro')) {
    code = code.replace(
      /(<div class="inner_banner">[\s\S]*?<img\s+src=")[^"]*(")/,
      `$1${banner}$2`
    );
  }
  fs.writeFileSync(astroPath, code, 'utf8');
  console.log(`✅ 页面 ${item.astro} -> ${banner}`);
}

// =======================================================
// 4. 让 product-detail-[id].astro 自动继承所属分类的专属 Banner
// =======================================================
const prodDetailPath = path.resolve('src/pages/product-detail-[id].astro');
if (fs.existsSync(prodDetailPath)) {
  const prodBanner = readOldBanner('product-detail-1.html') || readOldBanner('category-1.html');
  if (prodBanner) {
    usedBanners.add(prodBanner);
    let code = fs.readFileSync(prodDetailPath, 'utf8');
    code = code.replace(
      /bannerImg="[^"]*"/,
      `bannerImg={primaryCat?.bannerImg || '${prodBanner}'}`
    );
    fs.writeFileSync(prodDetailPath, code, 'utf8');
    console.log(`✅ 产品详情页 product-detail-[id].astro -> 优先继承分类 Banner（兜底：${prodBanner}）`);
  }
}

// =======================================================
// 5. 校验所有匹配到的 Banner 图片是否在 public/ 中真实存在
// =======================================================
console.log('\n=== Banner 文件存在性校验 ===');
let missing = 0;
for (const b of usedBanners) {
  const disk = path.join(PUBLIC_DIR, b.replace(/^\//, ''));
  if (!fs.existsSync(disk)) {
    console.log(`❌ 缺失文件：public${b}`);
    missing++;
  }
}
if (missing === 0) {
  console.log(`✅ 全部 ${usedBanners.size} 张栏目 Banner 图片均在 public/ 中真实存在！`);
}