export function ThemeScript() {
  const script = `
(() => {
  try {
    const key = 'wayboxd-theme';
    const stored = localStorage.getItem(key);
    const preference = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
    const root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.classList.toggle('light', resolved === 'light');
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  } catch (_) {}
})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
