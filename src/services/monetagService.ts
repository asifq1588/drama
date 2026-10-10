import { MonetagConfig } from '../types/drama';

const MONETAG_STORAGE_KEY = 'free_drama_monetag_config';

export const DEFAULT_MONETAG_CONFIG: MonetagConfig = {
  enabled: true,
  scriptTag: `<script src="https://alwingulla.com/88/tag.min.js" data-zone="123456" async data-cfasync="false"></script>`,
  directLinkUrl: 'https://monetag.com/?ref_id=free_drama_direct',
  inPagePushScript: `<!-- Monetag In-Page Push Banner Zone -->`,
  showAdOnEpisodeChange: true,
  adCountdownSeconds: 5,
  bannerHtml: `<div style="text-align:center; padding:10px; background:#1e1b4b; border-radius:8px; color:#fff; font-size:12px; font-weight:bold;">🔥 Monetag Sponsored Ad: Click to Win Rewards & Watch in 4K HD!</div>`,
  openDirectLinkInNewTab: true
};

export function getStoredMonetagConfig(): MonetagConfig {
  try {
    const raw = localStorage.getItem(MONETAG_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored Monetag config', e);
  }
  return DEFAULT_MONETAG_CONFIG;
}

export function saveStoredMonetagConfig(config: MonetagConfig): void {
  localStorage.setItem(MONETAG_STORAGE_KEY, JSON.stringify(config));
  // Apply script tag to DOM if provided
  applyMonetagScriptToDOM(config);
}

export function applyMonetagScriptToDOM(config: MonetagConfig): void {
  if (!config.enabled || !config.scriptTag) return;

  try {
    // Remove previous monetag injected scripts if any
    const existing = document.getElementById('monetag-injected-script');
    if (existing) {
      existing.remove();
    }

    // Extract src from script tag if user pasted <script src="..."></script>
    const srcMatch = config.scriptTag.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      const script = document.createElement('script');
      script.id = 'monetag-injected-script';
      script.src = srcMatch[1];
      script.async = true;

      // Extract data attributes if present
      const zoneMatch = config.scriptTag.match(/data-zone=["']([^"']+)["']/);
      if (zoneMatch && zoneMatch[1]) {
        script.setAttribute('data-zone', zoneMatch[1]);
      }

      document.head.appendChild(script);
    }
  } catch (e) {
    console.warn('Failed to inject Monetag script:', e);
  }
}

export function triggerMonetagDirectLink(config: MonetagConfig): void {
  if (!config.enabled || !config.directLinkUrl) return;

  try {
    if (config.openDirectLinkInNewTab) {
      window.open(config.directLinkUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = config.directLinkUrl;
    }
  } catch (e) {
    console.error('Failed to trigger Monetag Direct Link:', e);
  }
}
