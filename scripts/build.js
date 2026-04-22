const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'docs');

async function build() {
  await fs.emptyDir(DIST);

  const layoutTemplate = await fs.readFile(path.join(SRC, 'templates', 'layout.ejs'), 'utf8');
  const charTemplate = await fs.readFile(path.join(SRC, 'templates', 'character.ejs'), 'utf8');
  const glossaryTemplate = await fs.readFile(path.join(SRC, 'templates', 'glossary.ejs'), 'utf8');
  const indexTemplate = await fs.readFile(path.join(SRC, 'templates', 'index.ejs'), 'utf8');

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
      if (await fs.pathExists(assetsDir)) {
        await fs.copy(assetsDir, path.join(DIST, 'characters', slug, 'assets'));
      }
      const innerContent = ejs.render(charTemplate, { meta, slug });
      const html = ejs.render(layoutTemplate, { title: meta.title, content: innerContent, lang: 'zh' });
      await fs.writeFile(path.join(DIST, 'characters', slug, 'index.html'), html);
      characters.push({ slug, ...meta });
    }
  }

  const terms = [];
  const termDirs = await fs.readdir(path.join(CONTENT, 'glossary'));
  for (const slug of termDirs) {
    const metaPath = path.join(CONTENT, 'glossary', slug, 'meta.json');
    if (await fs.pathExists(metaPath)) {
      const meta = await fs.readJson(metaPath);
      await fs.ensureDir(path.join(DIST, 'glossary', slug));
      const innerContent = ejs.render(glossaryTemplate, { meta, slug });
      const html = ejs.render(layoutTemplate, { title: meta.title, content: innerContent, lang: 'zh' });
      await fs.writeFile(path.join(DIST, 'glossary', slug, 'index.html'), html);
      terms.push({ slug, ...meta });
    }
  }

  const indexContent = ejs.render(indexTemplate, { characters, terms });
  const indexHtml = ejs.render(layoutTemplate, { title: 'MUGEN OOTQ Ranking Wiki', content: indexContent, lang: 'zh' });
  await fs.writeFile(path.join(DIST, 'index.html'), indexHtml);

  console.log('Build complete! Output in docs/');
}

build().catch(console.error);
