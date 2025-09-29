// /src/store/theme.ts
type Theme = 'light' | 'dark' | 'system';

const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';

let mq: MediaQueryList | null = null;
let mqHandler: ((e: MediaQueryListEvent) => void) | null = null;

export const theme = {
  current: (() => {
    if (!isClient) return 'system';
    try {
      const stored = localStorage.getItem('theme');
      // If there's a stored preference, use it
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
      // If no stored preference, default to 'light' instead of 'system'
      return 'light';
    } catch {
      return 'light'; // Default to light instead of system
    }
  })() as Theme,

  set(newTheme: Theme) {
    this.current = newTheme;
    if (isClient) {
      try {
        localStorage.setItem('theme', newTheme);
      } catch {}
    }
    this.applyTheme();

    if (isClient) {
      document.dispatchEvent(new CustomEvent('theme:change', { detail: { theme: newTheme } }));
    }
  },

  applyTheme() {
    if (!isClient) return;

    // Clear existing system preference listener
    if (mq && mqHandler) {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', mqHandler);
      } else if (typeof (mq as any).removeListener === 'function') {
        (mq as any).removeListener(mqHandler);
      }
      mq = null;
      mqHandler = null;
    }

    // Apply theme based on user preference first
    if (this.current === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (this.current === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (this.current === 'system') {
      // Only follow system preference if explicitly set to 'system'
      mq = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = () => {
        if (mq && mq.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      apply();
      mqHandler = () => { if (this.current === 'system') apply(); };
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', mqHandler);
      } else if (typeof (mq as any).addListener === 'function') {
        (mq as any).addListener(mqHandler);
      }
    }
  }
};