const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'docs');

function rel(p, depth) {
  return depth > 0 ? '../'.repeat(depth) + p : p;
}

function getField(val, lang) {
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    return val[lang] || val.zh || '';
  }
  return '';
}

async function build() {
  await fs.emptyDir(DIST);

  const layoutTemplate = await fs.readFile(path.join(SRC, 'templates', 'layout.ejs'), 'utf8');
  const charTemplate = await fs.readFile(path.join(SRC, 'templates', 'character.ejs'), 'utf8');
  const charListTemplate = await fs.readFile(path.join(SRC, 'templates', 'character-list.ejs'), 'utf8');
  const glossaryTemplate = await fs.readFile(path.join(SRC, 'templates', 'glossary.ejs'), 'utf8');
  const indexTemplate = await fs.readFile(path.join(SRC, 'templates', 'index.ejs'), 'utf8');
  const listTemplate = await fs.readFile(path.join(SRC, 'templates', 'list.ejs'), 'utf8');

  await fs.copy(path.join(SRC, 'styles', 'main.css'), path.join(DIST, 'styles.css'));
  await fs.copy(path.join(SRC, 'scripts', 'i18n.js'), path.join(DIST, 'i18n.js'));

  await fs.ensureDir(path.join(DIST, 'characters'));
  await fs.ensureDir(path.join(DIST, 'glossary'));

  const characters = [];
  const charDirs = await fs.readdir(path.join(CONTENT, 'characters'));
  for (const slug of charDirs) {
    const metaPath = path.join(CONTENT, 'characters', slug, 'meta.json');
    if (await fs.pathExists(metaPath)) {
      const meta = await fs.readJson(metaPath);
      await fs.ensureDir(path.join(DIST, 'characters', slug));
      const assetsDir = path.join(CONTENT, 'characters', slug, 'assets');
      const hasAssets = await fs.pathExists(assetsDir);
      if (hasAssets) {
        await fs.copy(assetsDir, path.join(DIST, 'characters', slug, 'assets'));
      }
      const innerContent = ejs.render(charTemplate, { meta, slug, hasAssets, r: (p) => rel(p, 2), getField });
      const html = ejs.render(layoutTemplate, { title: getField(meta.title, 'zh'), content: innerContent, r: (p) => rel(p, 2), lang: 'zh', metaRaw: JSON.stringify(meta) });
      await fs.writeFile(path.join(DIST, 'characters', slug, 'index.html'), html);
      characters.push({ slug, meta });
    }
  }

  const terms = [];
  const termDirs = await fs.readdir(path.join(CONTENT, 'glossary'));
  for (const slug of termDirs) {
    const metaPath = path.join(CONTENT, 'glossary', slug, 'meta.json');
    if (await fs.pathExists(metaPath)) {
      const meta = await fs.readJson(metaPath);
      await fs.ensureDir(path.join(DIST, 'glossary', slug));
      const innerContent = ejs.render(glossaryTemplate, { meta, slug, r: (p) => rel(p, 2), getField });
      const html = ejs.render(layoutTemplate, { title: getField(meta.title, 'zh'), content: innerContent, r: (p) => rel(p, 2), lang: 'zh', metaRaw: JSON.stringify(meta) });
      await fs.writeFile(path.join(DIST, 'glossary', slug, 'index.html'), html);
      terms.push({ slug, meta });
    }
  }

  const charListContent = ejs.render(listTemplate, {
    items: characters,
    itemType: 'char',
    pageTitle: 'characters',
    pageTitleZh: '角色',
    leadKey: 'leadText',
    leadZh: '所有已收录的角色列表',
    r: (p) => rel(p, 1),
    getField
  });
  const charListHtml = ejs.render(layoutTemplate, { title: 'Characters', content: charListContent, r: (p) => rel(p, 1), lang: 'zh' });
  await fs.writeFile(path.join(DIST, 'characters', 'index.html'), charListHtml);

  const glossaryListContent = ejs.render(listTemplate, {
    items: terms,
    itemType: 'term',
    pageTitle: 'glossary',
    pageTitleZh: '术语',
    leadKey: 'noContent',
    leadZh: '所有已收录的术语',
    r: (p) => rel(p, 1),
    getField
  });
  const glossaryListHtml = ejs.render(layoutTemplate, { title: 'Glossary', content: glossaryListContent, r: (p) => rel(p, 1), lang: 'zh' });
  await fs.writeFile(path.join(DIST, 'glossary', 'index.html'), glossaryListHtml);

  const indexContent = ejs.render(indexTemplate, { characters, terms, r: (p) => rel(p, 0), getField });
  const indexHtml = ejs.render(layoutTemplate, { title: 'MUGEN OOTQ Ranking Wiki', content: indexContent, r: (p) => rel(p, 0), lang: 'zh' });
  await fs.writeFile(path.join(DIST, 'index.html'), indexHtml);

  console.log('Build complete! Output in docs/');
}

build().catch(console.error);
