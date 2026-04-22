const translations = {
  zh: {
    home: "首页",
    characters: "角色",
    glossary: "术语",
    search: "搜索...",
    relatedLinks: "相关链接",
    noContent: "暂无内容",
    tags: "标签"
  },
  en: {
    home: "Home",
    characters: "Characters",
    glossary: "Glossary",
    search: "Search...",
    relatedLinks: "Related Links",
    noContent: "No content yet",
    tags: "Tags"
  },
  ja: {
    home: "ホーム",
    characters: "キャラクター",
    glossary: "用語",
    search: "検索...",
    relatedLinks: "関連リンク",
    noContent: "コンテンツなし",
    tags: "タグ"
  }
};

const langNames = { zh: "中文", en: "English", ja: "日本語" };

function getStoredTheme() {
  return localStorage.getItem("theme") || "light";
}

function getStoredLang() {
  return localStorage.getItem("lang") || "zh";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeBtn(theme);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

function applyLang(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  const t = translations[lang] || translations.zh;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key]) el.placeholder = t[key];
  });
  updateLangSelect(lang);
}

function updateLangSelect(lang) {
  const select = document.getElementById("langSelect");
  if (select) select.value = lang;
}

function toggleTheme() {
  const current = getStoredTheme();
  applyTheme(current === "dark" ? "light" : "dark");
}

function init() {
  applyTheme(getStoredTheme());
  applyLang(getStoredLang());

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.addEventListener("change", e => applyLang(e.target.value));
  }
}

document.addEventListener("DOMContentLoaded", init);
