/**
 * Blogger Export & Hosting Code Generator for Free Drama (ফ্রি ড্রামা)
 * Supports:
 * 1. Blogger XML Theme (Theme -> Edit HTML compatible with Blogger's strict b:skin and b:section parser)
 * 2. Blogger Post/Page Responsive Embed (HTML view)
 * 3. Complete Standalone Single-file HTML Web App
 */

import { Drama, MonetagConfig, PaymentSettings } from '../types/drama';

/**
 * 1. Generates 100% Blogger XML Theme compatible code.
 * Blogger requires <b:skin> and at least one <b:section> to save in "Theme -> Edit HTML".
 */
export function generateBloggerThemeXML(appUrl?: string): string {
  const targetUrl = appUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://free-drama.app');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:responsive='true' b:version='2' class='v2' expr:dir='data:blog.languageDirection' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta charset='utf-8'/>
  <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'/>
  <title><data:blog.pageTitle/></title>
  <b:include data='blog' name='all-head-content'/>

  <!-- Google Fonts: Outfit & Hind Siliguri -->
  <link href='https://fonts.googleapis.com' rel='preconnect'/>
  <link crossorigin='anonymous' href='https://fonts.gstatic.com' rel='preconnect'/>
  <link href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&amp;family=Hind+Siliguri:wght@400;600;700&amp;display=swap' rel='stylesheet'/>

  <b:skin><![CDATA[
    /* -----------------------------------------------
       Free Drama (ফ্রি ড্রামা) - Premium Blogger Theme
       ----------------------------------------------- */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      min-height: 100%;
      background-color: #08090d;
      color: #f1f5f9;
      font-family: 'Outfit', 'Hind Siliguri', -apple-system, sans-serif;
      overflow-x: hidden;
    }
    #free-drama-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      overflow: hidden;
      z-index: 99999;
      background: #08090d;
    }
    #free-drama-iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }
    .blogger-fallback-container {
      display: none;
    }
  ]]></b:skin>
</head>
<body>
  <!-- Full Screen Free Drama App Viewport -->
  <div id='free-drama-wrapper'>
    <iframe 
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' 
      allowfullscreen='true' 
      id='free-drama-iframe' 
      loading='eager' 
      src='${targetUrl}' 
      title='ফ্রি ড্রামা - Free Drama'>
    </iframe>
  </div>

  <!-- Required Blogger Theme Section to bypass XML validator -->
  <div class='blogger-fallback-container'>
    <b:section id='main' maxwidgets='1' showaddelement='no'>
      <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog'/>
    </b:section>
  </div>
</body>
</html>`;
}

/**
 * 2. Generates responsive embed HTML code for Blogger Post / Page (HTML View)
 */
export function generateBloggerIframeCode(appUrl?: string): string {
  const currentUrl = appUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `<!-- ============================================================ -->
<!-- 🔥 ফ্রি ড্রামা (Free Drama) - Blogger Responsive Embed Code 🔥 -->
<!-- Instructions: Paste this in Blogger -> Pages/Posts -> HTML View -->
<!-- ============================================================ -->
<div id="free-drama-container" style="position: relative; width: 100%; max-width: 100%; margin: 0 auto; height: 100vh; min-height: 750px; background: #08090d; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9);">
  <iframe 
    src="${currentUrl}" 
    style="width: 100%; height: 100%; border: none; display: block;" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
    allowfullscreen="true"
    loading="lazy"
    title="ফ্রি ড্রামা - Free Short Dramas">
  </iframe>
</div>

<script>
  (function() {
    // Responsive height adjuster for Blogger viewports
    function adjustDramaHeight() {
      var container = document.getElementById('free-drama-container');
      if (container) {
        if (window.innerWidth < 768) {
          container.style.height = 'calc(100vh - 40px)';
          container.style.minHeight = '650px';
        } else {
          container.style.height = '920px';
        }
      }
    }
    window.addEventListener('resize', adjustDramaHeight);
    adjustDramaHeight();
  })();
</script>
<!-- ============================================================ -->`;
}

/**
 * 3. Standalone complete single-file HTML Web App code with dramas and Monetag support
 */
export function generateStandaloneBloggerTemplateCode(
  dramas: Drama[] = [],
  monetagConfig?: MonetagConfig,
  paymentSettings?: PaymentSettings
): string {
  const monetagScript = monetagConfig?.inPagePushScript || monetagConfig?.scriptTag || monetagConfig?.bannerHtml || '';
  const directLink = monetagConfig?.directLinkUrl || '';
  const bkashNumber = paymentSettings?.bkashNumber || '017XXXXXXXX';
  const nagadNumber = paymentSettings?.nagadNumber || '018XXXXXXXX';

  const dramasJson = JSON.stringify(dramas, null, 2);

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>ফ্রি ড্রামা - Free Drama</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
  
  ${monetagScript ? `<!-- Monetag Ads -->\n${monetagScript}` : ''}

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #08090d; color: #f1f5f9; font-family: 'Outfit', 'Hind Siliguri', sans-serif; overflow-x: hidden; padding-bottom: 70px; }
    
    /* Top Header */
    .header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: rgba(8, 9, 13, 0.95); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(12px); }
    .logo { display: flex; align-items: center; gap: 8px; font-weight: 900; font-size: 20px; color: #fff; text-decoration: none; }
    .logo-badge { background: linear-gradient(135deg, #ff2a5f, #ff758c); color: #fff; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 800; }
    .vip-btn { background: linear-gradient(135deg, #eab308, #f59e0b); color: #000; font-weight: 800; font-size: 12px; padding: 6px 14px; border-radius: 999px; text-decoration: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }

    /* Hero Banner */
    .hero { position: relative; min-height: 480px; display: flex; align-items: flex-end; padding: 36px 20px; background-size: cover; background-position: center; border-radius: 0 0 24px 24px; box-shadow: inset 0 -200px 140px #08090d; }
    .hero-content { max-width: 650px; z-index: 10; }
    .hero-tags { display: flex; gap: 8px; margin-bottom: 10px; font-size: 12px; font-weight: 700; color: #f43f5e; }
    .hero-title { font-size: 34px; font-weight: 900; line-height: 1.15; margin-bottom: 10px; }
    .hero-desc { color: #cbd5e1; font-size: 13px; line-height: 1.5; margin-bottom: 18px; max-width: 500px; }
    .play-hero-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #ff2a5f, #e11d48); color: #fff; border: none; padding: 12px 28px; border-radius: 999px; font-size: 15px; font-weight: 800; cursor: pointer; transition: 0.2s; box-shadow: 0 10px 25px rgba(255, 42, 95, 0.4); }
    .play-hero-btn:hover { transform: scale(1.04); }

    /* Sections */
    .section-head { display: flex; justify-content: space-between; align-items: center; padding: 24px 20px 12px; }
    .section-title { font-size: 18px; font-weight: 800; color: #fff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px; padding: 0 20px; }
    @media (min-width: 640px) {
      .grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 18px; }
    }

    /* Cards */
    .card { background: #11131a; border-radius: 14px; overflow: hidden; position: relative; border: 1px solid rgba(255, 255, 255, 0.05); cursor: pointer; transition: 0.2s; }
    .card:hover { transform: translateY(-4px); border-color: rgba(255, 42, 95, 0.5); }
    .poster-wrap { position: relative; padding-top: 140%; background: #1a1c24; }
    .poster-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .ep-badge { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 3px 6px; border-radius: 6px; font-size: 10px; font-weight: 700; color: #fff; }
    .card-info { padding: 10px; }
    .card-title { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff; }
    .card-meta { font-size: 11px; color: #94a3b8; margin-top: 3px; display: flex; justify-content: space-between; }

    /* Player Modal */
    #playerModal { display: none; position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.95); backdrop-filter: blur(8px); flex-direction: column; }
    .modal-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; background: #10121a; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .video-box { position: relative; width: 100%; max-width: 800px; margin: 0 auto; aspect-ratio: 16/9; background: #000; }
    .video-box video, .video-box iframe { width: 100%; height: 100%; border: none; }
    .ep-list { max-width: 800px; margin: 0 auto; width: 100%; padding: 14px; overflow-y: auto; flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 8px; }
    .ep-btn { background: #181a24; border: 1px solid rgba(255,255,255,0.08); color: #fff; padding: 10px 6px; border-radius: 10px; text-align: center; font-size: 12px; font-weight: 700; cursor: pointer; position: relative; }
    .ep-btn.active { background: #ff2a5f; border-color: #ff2a5f; }
    .ep-btn .lock-tag { font-size: 9px; display: block; margin-top: 2px; }

    /* Unlock to Ad overlay */
    .ad-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; z-index: 50; }
    .unlock-btn { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 900; font-size: 14px; padding: 12px 24px; border-radius: 999px; border: none; cursor: pointer; margin-top: 14px; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3); }

    /* VIP Modal */
    #vipModal { display: none; position: fixed; inset: 0; z-index: 1100; background: rgba(0,0,0,0.9); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 16px; }
    .vip-card { background: #131520; border: 1px solid rgba(234, 179, 8, 0.4); border-radius: 20px; max-width: 420px; width: 100%; padding: 24px; text-align: center; }
  </style>
</head>
<body>

  <!-- App Header -->
  <header class="header">
    <a href="#" class="logo">
      <span class="logo-badge">ফ্রি ড্রামা</span>
      <span>Free Drama</span>
    </a>
    <button class="vip-btn" onclick="openVipModal()">👑 VIP মেম্বারশিপ</button>
  </header>

  <!-- Hero Banner -->
  <div class="hero" id="heroBanner">
    <div class="hero-content">
      <div class="hero-tags">
        <span>🔥 Trending</span>
        <span>•</span>
        <span>Hindi &amp; Bengali</span>
      </div>
      <h1 class="hero-title" id="heroTitle">ইনসান বানা ভগবান</h1>
      <p class="hero-desc" id="heroDesc">
        যে মানুষকে প্রতারণা করে সবকিছু কেড়ে নেওয়া হয়েছিল, সেই মানুষটিই এখন অমর মহাশক্তি নিয়ে ফিরে আসছে প্রতিশোধ নিতে।
      </p>
      <button class="play-hero-btn" onclick="playDrama(0)">▶ এখনই দেখুন (Watch Free)</button>
    </div>
  </div>

  <!-- Popular Dramas -->
  <div class="section-head">
    <h2 class="section-title">জনপ্রিয় শর্ট ড্রামা (Popular Dramas)</h2>
  </div>
  <div class="grid" id="dramaGrid"></div>

  <!-- Video Watch Modal -->
  <div id="playerModal">
    <div class="modal-head">
      <div style="font-weight: 800; font-size: 14px;" id="modalTitle">ড্রামা দেখা হচ্ছে</div>
      <button onclick="closePlayerModal()" style="background: none; border: none; color: #fff; font-size: 20px; cursor: pointer;">✕</button>
    </div>
    <div class="video-box" id="videoBox">
      <!-- Player will be injected here -->
    </div>
    <div class="ep-list" id="epList"></div>
  </div>

  <!-- VIP Subscription Modal -->
  <div id="vipModal">
    <div class="vip-card">
      <div style="font-size: 32px; margin-bottom: 8px;">👑</div>
      <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 6px; color: #eab308;">ভিআইপি মেম্বারশিপ সাবস্ক্রিপশন</h3>
      <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">সব ড্রামা বিজ্ঞাপন ছাড়া ফুল এইচডি কোয়ালিটিতে আনলক করুন।</p>
      
      <div style="background: #1a1c28; padding: 14px; border-radius: 12px; text-align: left; font-size: 12px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #e11d48;">বিকাশ পার্সোনাল:</span>
          <span style="font-family: monospace; font-weight: bold;">${bkashNumber}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-weight: bold; color: #ea580c;">নগদ পার্সোনাল:</span>
          <span style="font-family: monospace; font-weight: bold;">${nagadNumber}</span>
        </div>
      </div>

      <p style="font-size: 11px; color: #cbd5e1; margin-bottom: 16px;">
        বিকাশ বা নগদ-এ সেন্ড মানি করে ট্রানজেকশন আইডি অ্যাডমিনকে পাঠিয়ে VIP উপভোগ করুন।
      </p>

      <button onclick="closeVipModal()" style="background: #ff2a5f; color: #fff; border: none; padding: 10px 24px; border-radius: 10px; font-weight: bold; cursor: pointer;">
        বুঝেছি (Close)
      </button>
    </div>
  </div>

  <script>
    var DRAMAS = ${dramasJson};
    var MONETAG_DIRECT_LINK = "${directLink}";
    var currentDramaIdx = 0;
    var currentEpIdx = 0;
    var unlockedEps = {};

    function renderGrid() {
      var grid = document.getElementById('dramaGrid');
      grid.innerHTML = '';
      DRAMAS.forEach(function(drama, idx) {
        var card = document.createElement('div');
        card.className = 'card';
        card.onclick = function() { playDrama(idx); };
        card.innerHTML = 
          '<div class="poster-wrap">' +
            '<img class="poster-img" src="' + drama.poster + '" alt="' + drama.title + '">' +
            '<span class="ep-badge">' + (drama.episodes ? drama.episodes.length : 0) + ' Eps</span>' +
          '</div>' +
          '<div class="card-info">' +
            '<div class="card-title">' + (drama.titleBn || drama.title) + '</div>' +
            '<div class="card-meta">' +
              '<span>' + drama.language + '</span>' +
              '<span>👁 ' + drama.views + '</span>' +
            '</div>' +
          '</div>';
        grid.appendChild(card);
      });
    }

    function playDrama(idx) {
      currentDramaIdx = idx;
      currentEpIdx = 0;
      var drama = DRAMAS[idx];
      document.getElementById('modalTitle').innerText = (drama.titleBn || drama.title) + ' - পর্ব ' + (currentEpIdx + 1);
      document.getElementById('playerModal').style.display = 'flex';
      renderEpisodePlayer();
    }

    function renderEpisodePlayer() {
      var drama = DRAMAS[currentDramaIdx];
      var ep = drama.episodes ? drama.episodes[currentEpIdx] : null;
      var box = document.getElementById('videoBox');
      var list = document.getElementById('epList');

      if (!ep) {
        box.innerHTML = '<div style="color:#fff;padding:20px;">ভিডিও পাওয়া যায়নি</div>';
        return;
      }

      var epKey = currentDramaIdx + '_' + ep.episodeNumber;
      var isLocked = ep.isLocked && !unlockedEps[epKey];
      var accessType = ep.accessType || (ep.isLocked ? 'ad' : 'free');

      if (isLocked) {
        if (accessType === 'premium') {
          box.innerHTML = 
            '<div class="ad-overlay">' +
              '<div style="font-size: 32px;">👑</div>' +
              '<h3 style="font-size: 16px; font-weight: 900; color: #eab308; margin-top: 8px;">প্রিমিয়াম ভিআইপি পর্ব</h3>' +
              '<p style="font-size: 12px; color: #cbd5e1; margin-top: 6px;">এই পর্বটি দেখতে বিকাশ বা নগদ দিয়ে সাবস্ক্রিপশন চালু করুন।</p>' +
              '<button class="unlock-btn" onclick="openVipModal()">👑 ভিআইপি সাবস্ক্রিপশন নিন</button>' +
            '</div>';
        } else {
          box.innerHTML = 
            '<div class="ad-overlay">' +
              '<div style="font-size: 32px;">🎬</div>' +
              '<h3 style="font-size: 16px; font-weight: 900; color: #f59e0b; margin-top: 8px;">আনলক টু অ্যাড (Unlock to Ad)</h3>' +
              '<p style="font-size: 12px; color: #cbd5e1; margin-top: 6px;">বিজ্ঞাপনটি দেখলে এই পর্বটি সম্পূর্ণ ফ্রিতে চালু হবে!</p>' +
              '<button class="unlock-btn" onclick="unlockWithAd(' + currentDramaIdx + ',' + ep.episodeNumber + ')">▶ অ্যাড দেখুন ও আনলক করুন</button>' +
            '</div>';
        }
      } else {
        if (ep.videoType === 'youtube' || (ep.videoUrl && ep.videoUrl.includes('youtube'))) {
          var yId = ep.videoUrl.split('v=')[1] || ep.videoUrl.split('/').pop();
          box.innerHTML = '<iframe src="https://www.youtube.com/embed/' + yId + '?autoplay=1" allowfullscreen allow="autoplay"></iframe>';
        } else {
          box.innerHTML = '<video src="' + ep.videoUrl + '" controls autoplay playsinline style="width:100%;height:100%;object-fit:contain;"></video>';
        }
      }

      // Render episodes
      list.innerHTML = '';
      (drama.episodes || []).forEach(function(item, i) {
        var btn = document.createElement('button');
        var k = currentDramaIdx + '_' + item.episodeNumber;
        var locked = item.isLocked && !unlockedEps[k];
        btn.className = 'ep-btn ' + (i === currentEpIdx ? 'active' : '');
        var tag = locked ? (item.accessType === 'premium' ? '👑 VIP' : '🟡 Ad') : '🟢 Free';
        btn.innerHTML = 'Ep ' + item.episodeNumber + '<span class="lock-tag">' + tag + '</span>';
        btn.onclick = function() {
          currentEpIdx = i;
          renderEpisodePlayer();
        };
        list.appendChild(btn);
      });
    }

    function unlockWithAd(dramaIdx, epNum) {
      if (MONETAG_DIRECT_LINK) {
        window.open(MONETAG_DIRECT_LINK, '_blank');
      }
      var key = dramaIdx + '_' + epNum;
      unlockedEps[key] = true;
      renderEpisodePlayer();
    }

    function closePlayerModal() {
      document.getElementById('playerModal').style.display = 'none';
      document.getElementById('videoBox').innerHTML = '';
    }

    function openVipModal() {
      document.getElementById('vipModal').style.display = 'flex';
    }

    function closeVipModal() {
      document.getElementById('vipModal').style.display = 'none';
    }

    // Init
    renderGrid();
  </script>
</body>
</html>`;
}
