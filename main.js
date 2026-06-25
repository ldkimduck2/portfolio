/* ══════════════════════════════════════
   main.js - 김기덕 Level Designer Portfolio
   ══════════════════════════════════════ */

// ── 리사이즈 애니메이션 방지 ──
let resizeTimer;
window.addEventListener('resize', () => {
  document.body.classList.add('resize-animation-stopper');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove('resize-animation-stopper');
  }, 400);
});

// ── 스크롤시 NAV 스타일 변경 ──
const mainNav = document.getElementById('main-nav');
document.querySelectorAll('.page').forEach(page => {
  page.addEventListener('scroll', function () {
    if (this.scrollTop > 20) { mainNav.classList.add('scrolled'); }
    else { mainNav.classList.remove('scrolled'); }
  });
});

// ── 읽기 진행도 바 ──
function updateReadingProgress(el) {
  const scrollTop = el.scrollTop;
  const scrollHeight = el.scrollHeight - el.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  document.getElementById('reading-progress').style.width = progress + '%';
}

// ── 유틸 함수 ──
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const renderTags = tags => (tags || []).map(t =>
  t.startsWith('!') ? `<span class="tag hi">${esc(t.slice(1))}</span>` : `<span class="tag">${esc(t)}</span>`
).join('');

// ── 히어로 타이틀 ──
let styledHeadline = DATA.landing.headline
  .replace('서사', '<span style="color: var(--accent); font-weight: 900;">서사</span>')
  .replace('감정', '<span style="color: var(--accent); font-weight: 900;">감정</span>');
document.getElementById('hero-title').innerHTML = styledHeadline;
document.getElementById('hero-desc').textContent = DATA.landing.desc;

// ── 히어로 슬라이더 ──
const sliderContainer = document.getElementById('hero-slider');
const heroImages = DATA.landing.heroImages;
if (heroImages && heroImages.length > 0) {
  sliderContainer.innerHTML = heroImages.map((url, i) =>
    `<div class="hero-slide ${i === 0 ? 'show' : ''}" style="background-image: url('${url}')"></div>`
  ).join('');
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;
  if (slides.length > 1) {
    setInterval(() => {
      slides.forEach(s => s.classList.remove('prev'));
      slides[currentSlide].classList.remove('show');
      slides[currentSlide].classList.add('prev');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('show');
    }, 5000);
  }
}

// ── 카드 비디오 탭 전환 ──
window.switchCardVideo = function (btn, index, youtubeId) {
  const container = btn.parentElement;
  container.querySelectorAll('.c-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const videoWrap = document.getElementById(`card-video-${index}`);
  videoWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?mute=1" loading="lazy" allowfullscreen></iframe>`;
};

// ── 포트폴리오 렌더 (리스트 창 비율 원상 복구 및 서브 퀘스트 시인성 강화) ──
document.getElementById('portfolio-list').innerHTML = DATA.portfolio.map((p, index) => {
  let videoHtml = '';
  if (p.youtubeMain && p.youtubeSub) {
    videoHtml = `
      <div class="card-video-container">
        <div class="video-wrap" id="card-video-${index}">
          <iframe src="https://www.youtube.com/embed/${p.youtubeMain}?mute=1" loading="lazy" allowfullscreen></iframe>
        </div>
        <!-- 🔥 1줄 가로 배치로 비율을 유지하면서, 서브 퀘스트 탭에 붉은 알림 효과(Pulse) 추가 🔥 -->
        <div class="card-video-tabs" style="display: flex; gap: 8px; margin-top: 16px;">
          <button class="c-tab active" style="flex: 1; padding: 12px 0; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="switchCardVideo(this, ${index}, '${p.youtubeMain}')">
            <span style="font-size: 16px;">🎬</span> Main Quest
          </button>
          <button class="c-tab" style="flex: 1; padding: 12px 0; display: flex; align-items: center; justify-content: center; gap: 6px; position: relative; border-color: rgba(224,48,48,0.4);" onclick="switchCardVideo(this, ${index}, '${p.youtubeSub}')">
            <span style="font-size: 16px;">🔍</span> Sub Quest
            <span style="position: absolute; top: -3px; right: -3px; width: 12px; height: 12px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); animation: pulseDot 2s infinite;"></span>
          </button>
        </div>
      </div>`;
  } else if (p.youtubeMain || p.youtubeId) {
    const vid = p.youtubeMain || p.youtubeId;
    videoHtml = `<div class="card-video-container"><div class="video-wrap"><iframe src="https://www.youtube.com/embed/${vid}?mute=1" loading="lazy" allowfullscreen></iframe></div></div>`;
  } else {
    videoHtml = `<div class="card-video-container"><div class="video-wrap"></div></div>`;
  }
  const dateHtml = p.date ? `<div style="font-size:15px; color:var(--accent); font-weight:800; margin-bottom:16px;">🗓️ ${esc(p.date)}</div>` : '';
  return `
    <div class="portfolio-item modern-card">
      ${videoHtml}
      <div class="port-info">
        <div class="tags">${renderTags(p.tags)}</div>
        ${dateHtml}
        <h3 class="port-title">${esc(p.title)}</h3>
        <p class="port-desc">${esc(p.desc)}</p>
        <button class="btn-detail" onclick="openModal('portfolio', ${index})">상세 기획 보기 ↗</button>
      </div>
    </div>`;
}).join('');

// ── 스터디 렌더 ──
document.getElementById('study-list').innerHTML = DATA.studies.map((s, index) => {
  const thumbHtml = s.coverImage
    ? `<img src="${esc(s.coverImage)}" loading="lazy">`
    : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--fg-muted); font-size:14px;">No Image</div>`;
  return `
    <div class="study-card modern-card hover-effect" onclick="openModal('study', ${index})">
      <div class="study-thumb-wrap">${thumbHtml}</div>
      <div class="study-info">
        <div class="card-meta">
          <span class="card-cat">${esc(s.cat)}</span>
          <span class="card-date">${esc(s.date || '')}</span>
        </div>
        <h3 class="card-title">${esc(s.title)}</h3>
        <p class="card-desc">${esc(s.desc)}</p>
      </div>
    </div>`;
}).join('');

// ── 게임 카드 HTML 생성 ──
function createGameItemHTML(g) {
  const imgContent = g.image ? `<img src="${esc(g.image)}" loading="lazy">` : '';
  const displayPlaytime = g.playtimeText ? esc(g.playtimeText) : `${g.playtime}시간`;
  const displayYear = g.releaseDate ? `<span class="stat-badge">📅 ${esc(g.releaseDate)}</span>` : '';
  let statusIcon = "🎯", statusClass = "";
  if (g.status.includes("완료")) { statusIcon = "✅"; statusClass = "done"; }
  else if (g.status.includes("진행")) { statusIcon = "🔥"; statusClass = "hi"; }
  return `
    <div class="game-item modern-card hover-effect">
      <div class="game-image-wrap">${imgContent}</div>
      <div>
        <h3 class="game-title">${esc(g.title)}</h3>
        <div class="game-studio">${esc(g.developer)} <span class="sep">/</span> ${esc(g.genre)}</div>
        <div class="game-stats">
          <span class="stat-badge ${statusClass}">${statusIcon} ${esc(g.status)}</span>
          ${displayYear}
          <span class="stat-badge">⏱ ${displayPlaytime}</span>
        </div>
        <div class="tags" style="margin-top: 16px;">${renderTags(g.tags)}</div>
      </div>
    </div>`;
}

// ── 게임 필터 & 정렬 ──
let currentSortMode = 'latest';
let currentFilterTag = '';

function renderGames(actionType, value) {
  if (actionType === 'sort') {
    currentSortMode = value;
  } else if (actionType === 'tag') {
    currentFilterTag = (currentFilterTag === value) ? '' : value;
  }

  const buttons = document.querySelectorAll('#game-filter-wrap .filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  const sortBtn = Array.from(buttons).find(btn =>
    btn.getAttribute('onclick').includes(`'sort', '${currentSortMode}'`)
  );
  if (sortBtn) sortBtn.classList.add('active');

  if (currentFilterTag) {
    const tagBtn = Array.from(buttons).find(btn =>
      btn.getAttribute('onclick').includes(`'tag', '${currentFilterTag}'`)
    );
    if (tagBtn) tagBtn.classList.add('active');
  }

  const container = document.getElementById('game-list');
  let games = [...DATA.games];

  if (currentFilterTag) {
    games = games.filter(g =>
      (g.genre && g.genre.toUpperCase().includes(currentFilterTag.toUpperCase())) ||
      (g.tags && g.tags.some(t => t.toUpperCase().includes(currentFilterTag.toUpperCase())))
    );
  }

  let html = '';
  if (currentSortMode === 'latest') {
    games.sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""));
    html = games.map(g => createGameItemHTML(g)).join('');
  } else if (currentSortMode === 'playtime') {
    games.sort((a, b) => b.playtime - a.playtime);
    html = games.map(g => createGameItemHTML(g)).join('');
  } else if (currentSortMode === 'genre' || currentSortMode === 'developer') {
    const groups = {};
    games.forEach(g => {
      const key = g[currentSortMode] || '기타';
      if (!groups[key]) groups[key] = [];
      groups[key].push(g);
    });
    Object.keys(groups).sort().forEach(groupName => {
      html += `<div class="game-group-title">${esc(groupName)}</div>`;
      groups[groupName].sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""));
      html += groups[groupName].map(g => createGameItemHTML(g)).join('');
    });
  }

  container.innerHTML = html;
}

renderGames('sort', 'latest');

// ── About Me 렌더 ──
const leadHtml = esc(DATA.about.lead)
  .replace('서사', '<mark>서사</mark>')
  .replace('감정', '<mark>감정</mark>');

document.getElementById('about-lead').innerHTML = leadHtml;
document.getElementById('about-body').textContent = DATA.about.body;

// 1. 이력(Experience) 렌더링
let expHtml = `<div class="exp-table-wrap">
  <div class="exp-t-header">
    <div>개발 기간</div>
    <div>담당 업무</div>
    <div>프로젝트 이름 / 게임 장르 / 팀 단위</div>
  </div>`;
  
expHtml += DATA.about.experience.map(e => {
  let periodStr = esc(e.period).replace('진행 중', '<span style="color:var(--accent); font-weight:800;">진행 중</span>');
  
  return `
  <div class="exp-t-row">
    <div class="exp-t-period">${periodStr}</div>
    <div class="exp-t-role">${esc(e.role)}</div>
    <div class="exp-t-desc">
      <strong>${esc(e.company)}</strong> 
      <span class="exp-t-sep">/</span> 
      ${esc(e.desc)}
    </div>
  </div>`;
}).join('');

expHtml += `</div>`;
document.getElementById('about-exp').innerHTML = expHtml;

// 2. 스킬(Skill) 별점 렌더링
if (DATA.about.skills) {
  document.getElementById('about-skills').innerHTML = DATA.about.skills.map(s => {
    let stars = '';
    for(let i=1; i<=5; i++) {
      stars += `<span style="color: ${i <= s.level ? 'var(--accent)' : 'rgba(255,255,255,0.15)'}; font-size: 20px; margin-left: 3px;">★</span>`;
    }
    return `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid var(--border);">
      <span style="font-weight: 800; font-size: 15px; color: #fff; display: flex; align-items: center; gap: 12px;">
        <img src="${s.img}" alt="${esc(s.name)}" style="width: 24px; height: 24px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        ${esc(s.name)}
      </span>
      <div>${stars}</div>
    </div>`;
  }).join('');
}

// ── Contact 렌더 ──
window.copyText = function (text, el) {
  navigator.clipboard.writeText(text).then(() => {
    const originalHtml = el.innerHTML;
    el.innerHTML = `<span style="color: var(--accent);">✔️</span> <span style="color: var(--accent);">복사완료!</span>`;
    setTimeout(() => { el.innerHTML = originalHtml; }, 2000);
  });
};

document.getElementById('contact-links').innerHTML =
  `<a href="javascript:void(0);" onclick="copyText('${esc(DATA.site.email)}', this)"><span>✉</span> ${esc(DATA.site.email)}</a>` +
  DATA.site.links.map(l => {
    
    const iconContent = l.iconImg 
      ? `<img src="${l.iconImg}" alt="icon" style="width: 20px; height: 20px; object-fit: contain;">` 
      : `<span>${l.icon}</span>`;

    if (l.label.includes("Discord")) {
      const discordId = l.label.includes(':') ? l.label.split(':')[1].trim() : l.label;
      return `<a href="javascript:void(0);" onclick="copyText('${esc(discordId)}', this)">${iconContent} ${esc(l.label)}</a>`;
    }
    
    return `<a href="${esc(l.href)}" target="_blank">${iconContent} ${esc(l.label)}</a>`;
  }).join('');

// ══════════════════════════════════════
// 모달 로직
// ══════════════════════════════════════
let modalSliders = {};
let tocObserver = null;
let revealObserver = null;

function startAutoPlay(key) {
  stopAutoPlay(key);
  const triggerAnimation = () => {
    const bar = document.getElementById(`progress-${key}`);
    if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = 'progressFill 4s linear forwards'; }
  };
  triggerAnimation();
  modalSliders[key].intervalId = setInterval(() => { moveSlide(key, 1, false); triggerAnimation(); }, 4000);
}

function stopAutoPlay(key) {
  if (modalSliders[key] && modalSliders[key].intervalId) {
    clearInterval(modalSliders[key].intervalId);
    modalSliders[key].intervalId = null;
  }
  const bar = document.getElementById(`progress-${key}`);
  if (bar) { bar.style.animation = 'none'; }
}

function updateSlider(key, idx) {
  const slider = modalSliders[key];
  if (!slider) return;
  slider.currentIndex = idx;
  const track = document.getElementById(`track-${key}`);
  if (track) { track.style.transform = `translateX(-${idx * 100}%)`; }
  const container = document.getElementById(`thumbs-${key}`);
  if (!container) return;
  const thumbs = container.querySelectorAll('.s-thumb');
  if (thumbs.length === 0) return;
  if (slider.thumbContinuousIndex >= slider.images.length * 3) {
    slider.thumbContinuousIndex = slider.images.length + (slider.thumbContinuousIndex % slider.images.length);
  } else if (slider.thumbContinuousIndex < 0) {
    slider.thumbContinuousIndex = slider.images.length + ((slider.thumbContinuousIndex % slider.images.length + slider.images.length) % slider.images.length);
  }
  thumbs.forEach(t => t.classList.remove('active'));
  const activeThumb = thumbs[slider.thumbContinuousIndex];
  if (activeThumb) {
    activeThumb.classList.add('active');
    const containerRect = container.getBoundingClientRect();
    const thumbRect = activeThumb.getBoundingClientRect();
    const scrollOffset = (thumbRect.left + thumbRect.width / 2) - (containerRect.left + containerRect.width / 2);
    container.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    clearTimeout(slider.resetTimeout);
    slider.resetTimeout = setTimeout(() => {
      let didJump = false;
      if (slider.thumbContinuousIndex >= slider.images.length * 2) {
        slider.thumbContinuousIndex -= slider.images.length; didJump = true;
      } else if (slider.thumbContinuousIndex < slider.images.length) {
        slider.thumbContinuousIndex += slider.images.length; didJump = true;
      }
      if (didJump) {
        thumbs.forEach(t => t.classList.remove('active'));
        const newThumb = thumbs[slider.thumbContinuousIndex];
        if (newThumb) {
          newThumb.classList.add('active');
          const currentContainerRect = container.getBoundingClientRect();
          const newThumbRect = newThumb.getBoundingClientRect();
          const instantOffset = (newThumbRect.left + newThumbRect.width / 2) - (currentContainerRect.left + currentContainerRect.width / 2);
          container.scrollBy({ left: instantOffset, behavior: 'auto' });
        }
      }
    }, 400);
  }
}

function setSlide(key, clickedRealIdx, isManual = false) {
  const slider = modalSliders[key];
  if (!slider) return;
  slider.thumbContinuousIndex = slider.images.length + clickedRealIdx;
  updateSlider(key, clickedRealIdx);
  if (isManual) startAutoPlay(key);
}

function moveSlide(key, dir, isManual = false) {
  const slider = modalSliders[key];
  if (!slider) return;
  if (typeof slider.thumbContinuousIndex === 'undefined') {
    slider.thumbContinuousIndex = slider.images.length + slider.currentIndex;
  }
  let newIdx = (slider.currentIndex + dir + slider.images.length) % slider.images.length;
  slider.thumbContinuousIndex += dir;
  updateSlider(key, newIdx);
  if (isManual) startAutoPlay(key);
}

function buildSliderHtml(key, title, images) {
  let html = `<div class="slider-col">`;
  if (title) html += `<div class="slider-header">${title}</div>`;
  html += `<div class="slider-wrapper" onmouseenter="stopAutoPlay('${key}')" onmouseleave="startAutoPlay('${key}')"><div class="slider-track" id="track-${key}">`;
  images.forEach(src => { html += `<div class="slide-item"><img src="${src}"></div>`; });
  html += `</div>`;
  if (images.length > 1) {
    html += `<button class="s-arrow prev" onclick="moveSlide('${key}', -1, true)">❮</button><button class="s-arrow next" onclick="moveSlide('${key}', 1, true)">❯</button><div class="slider-progress"><div class="slider-progress-bar" id="progress-${key}"></div></div>`;
  }
  html += `</div>`;
  if (images.length > 1) {
    html += `<div class="slider-thumbnails" id="thumbs-${key}">`;
    const loopedImages = [...images, ...images, ...images];
    loopedImages.forEach((src, i) => {
      const realIndex = i % images.length;
      html += `<img src="${src}" class="s-thumb thumb-${key}" onclick="setSlide('${key}', ${realIndex}, true)">`;
    });
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

// ── 모달 열기 ──
function openModal(type, index) {
  const data = type === 'portfolio' ? DATA.portfolio[index] : DATA.studies[index];
  const modalBody = document.getElementById('modal-body');
  document.getElementById('modal-top-title').textContent = type === 'portfolio' ? 'PROJECT DETAILS' : 'STUDY DETAILS';
  document.getElementById('reading-progress').style.width = '0%';

  if (modalSliders) { Object.keys(modalSliders).forEach(key => stopAutoPlay(key)); }
  modalSliders = {};

  let html = `<div class="study-reading-layout">`;
  html += `
    <aside class="study-quest-tracker" id="modal-toc-sidebar">
      <div class="tracker-box">
        <div class="tracker-header">PROJECT OBJECTIVE</div>
        <ul id="toc-list" class="tracker-list"></ul>
      </div>
    </aside>`;
  html += `<article class="study-markdown-content" id="modal-article-content">`;

  if (type === 'portfolio') {
    const dateHtmlModal = data.date ? `<div style="font-size:16px; color:var(--accent); font-weight:800; margin-bottom:16px;">🗓️ ${esc(data.date)}</div>` : '';
    html += `
    <div class="portfolio-section-wrap" id="sect-top">
      <div class="m-article-header">
        <div class="tags" style="margin-bottom: 24px;">${renderTags(data.tags)}</div>
        ${dateHtmlModal}
        <h1 class="m-article-title">${esc(data.title)}</h1>
        <p class="m-article-desc">${esc(data.desc)}</p>
      </div>
    </div>`;

    if (data.youtubeMain || data.youtubeSub || data.youtubeId) {
      html += `<div class="portfolio-section-wrap" id="sect-video"><div class="m-section-title" style="margin-top: 0;">Play Video</div>`;
      if (data.youtubeMain && data.youtubeSub) {
        // 🔥 모달에서는 메인 퀘스트 / 서브 퀘스트 영상을 강제로 상하 배치 (직관성 확보) 🔥
        html += `
        <div style="display:flex; flex-direction:column; gap:60px;">
          <div>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
              <span style="font-size:32px; line-height: 1;">🎬</span>
              <h3 style="font-size:26px; font-weight:900; color:#fff; margin:0; letter-spacing:-0.02em;">Main Quest <span style="font-size:15px; color:var(--accent); font-weight:800; margin-left:12px; background:rgba(224,48,48,0.15); padding:6px 16px; border-radius:20px; vertical-align: middle;">메인 스토리라인</span></h3>
            </div>
            <div class="m-pdf-wrap delay-iframe" id="delayed-yt-main" data-src="https://www.youtube.com/embed/${data.youtubeMain}" style="margin-bottom:0; box-shadow: 0 10px 30px rgba(0,0,0,0.4);"></div>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
              <span style="font-size:32px; line-height: 1;">🔍</span>
              <h3 style="font-size:26px; font-weight:900; color:#fff; margin:0; letter-spacing:-0.02em;">Sub Quest <span style="font-size:15px; color:#8b5cf6; font-weight:800; margin-left:12px; background:rgba(139,92,246,0.15); padding:6px 16px; border-radius:20px; vertical-align: middle;">숨겨진 서사</span></h3>
            </div>
            <div class="m-pdf-wrap delay-iframe" id="delayed-yt-sub" data-src="https://www.youtube.com/embed/${data.youtubeSub}" style="margin-bottom:0; box-shadow: 0 10px 30px rgba(0,0,0,0.4);"></div>
          </div>
        </div>`;
      } else {
        const initialVideoId = data.youtubeMain || data.youtubeId;
        html += `<div class="m-pdf-wrap delay-iframe" id="delayed-yt" data-src="https://www.youtube.com/embed/${initialVideoId}"></div>`;
      }
      html += `</div>`;
    }

    if (data.meta) {
      html += `
      <div class="portfolio-section-wrap" id="sect-insight">
        <div class="m-section-title">Project Insight</div>
        <div class="detail-bento">
          <div class="d-bento-card d-span-4" style="justify-content: center;">
            <div style="margin-bottom: 40px;"><span class="d-meta-label">장르</span><span class="d-meta-value">${esc(data.meta.genre)}</span></div>
            <div><span class="d-meta-label">맵 사이즈</span><span class="d-meta-value">${esc(data.meta.size)}</span></div>
          </div>
          <div class="d-bento-card d-span-8" style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%); justify-content: center;">
            <span class="d-meta-label">스토리라인</span><span class="d-meta-story">"${esc(data.meta.story)}"</span>
          </div>
          <div class="d-bento-card d-span-4 intent-card"><div class="intent-bg-num">01</div><div class="intent-content"><h4 class="intent-title">${esc(data.meta.intent1.title)}</h4><p class="intent-desc">${esc(data.meta.intent1.desc)}</p></div></div>
          <div class="d-bento-card d-span-4 intent-card"><div class="intent-bg-num">02</div><div class="intent-content"><h4 class="intent-title">${esc(data.meta.intent2.title)}</h4><p class="intent-desc">${esc(data.meta.intent2.desc)}</p></div></div>
          <div class="d-bento-card d-span-4 intent-card"><div class="intent-bg-num">03</div><div class="intent-content"><h4 class="intent-title">${esc(data.meta.intent3.title)}</h4><p class="intent-desc">${esc(data.meta.intent3.desc)}</p></div></div>
        </div>
      </div>`;
    }

    if (data.pdfUrl) {
      let viewerUrl = data.pdfUrl;
      if (viewerUrl.includes('drive.google.com')) viewerUrl = viewerUrl.replace('/view', '/preview').split('?')[0];
      html += `
      <div class="portfolio-section-wrap" id="sect-doc">
        <div class="m-section-title" style="margin-top: 0;">Full Document</div>
        <div class="m-pdf-wrap delay-iframe" id="delayed-pdf" data-src="${viewerUrl}"></div>
      </div>`;
    }

    if (data.mapUrl) {
      html += `
      <div class="portfolio-section-wrap" id="sect-map">
        <div class="m-section-title" style="margin-top: 0;">Interactive Map View</div>
        <div class="m-pdf-wrap delay-iframe" id="delayed-map" data-src="${data.mapUrl}"></div>
      </div>`;
    }

    if ((data.overviewImages && data.overviewImages.length > 0) || (data.processImages && data.processImages.length > 0)) {
      html += `
      <div class="portfolio-section-wrap" id="sect-gallery">
        <div class="m-section-title" style="margin-top: 0;">GALLERY</div>
        <div class="dual-slider-wrap">`;
      if (data.overviewImages && data.overviewImages.length > 0) {
        modalSliders['overview'] = { images: data.overviewImages, currentIndex: 0, intervalId: null };
        html += buildSliderHtml('overview', 'Overview', data.overviewImages);
      }
      if (data.processImages && data.processImages.length > 0) {
        modalSliders['process'] = { images: data.processImages, currentIndex: 0, intervalId: null };
        html += buildSliderHtml('process', '제작 과정', data.processImages);
      }
      html += `</div></div>`;
    }

  } else {
    html += `
    <div id="sect-top" style="scroll-margin-top: 40px;">
      <div class="study-hero-section">
        ${data.coverImage ? `<div class="study-hero-bg"><img src="${esc(data.coverImage)}"></div>` : ''}
        <span class="study-hero-cat">${esc(data.cat)}</span>
        <h1 class="study-hero-title">${esc(data.title)}</h1>
        <p class="study-hero-desc">${esc(data.desc)}</p>
        <div class="study-hero-date">Published on ${esc(data.date || '')}</div>
      </div>
    </div>
    ${data.youtubeId ? `<div class="study-yt-full delay-iframe" id="delayed-yt" data-src="https://www.youtube.com/embed/${data.youtubeId}"></div>` : ''}
    ${data.content ? marked.parse(data.content) : '<p>아직 작성된 내용이 없습니다.</p>'}`;
  }

  html += `</article></div>`;
  modalBody.innerHTML = html;
  document.getElementById('modal-overlay').style.display = 'block';
  document.getElementById('detail-modal').classList.add('active');

  setTimeout(() => {
    ['yt', 'yt-main', 'yt-sub', 'pdf', 'map'].forEach(id => {
      const el = document.getElementById(`delayed-${id}`);
      if (el) { el.innerHTML = `<iframe src="${el.dataset.src}" allowfullscreen></iframe>`; }
    });

    Object.keys(modalSliders).forEach(key => {
      updateSlider(key, 0);
      if (modalSliders[key].images.length > 1) { startAutoPlay(key); }
    });

    const contentBox = document.getElementById('modal-article-content');
    const tocList = document.getElementById('toc-list');
    let tocHtml = '';

    if (type === 'portfolio') {
      const sections = [
        { id: 'sect-video', label: 'Play Video', exists: !!(data.youtubeMain || data.youtubeId) },
        { id: 'sect-insight', label: 'Project Insight', exists: !!data.meta },
        { id: 'sect-doc', label: 'Documentation', exists: !!data.pdfUrl },
        { id: 'sect-map', label: 'Map View', exists: !!data.mapUrl },
        { id: 'sect-gallery', label: 'Gallery', exists: !!(data.overviewImages || data.processImages) }
      ];
      sections.forEach(s => {
        if (s.exists !== false) {
          tocHtml += `<li class="tracker-item"><a class="tracker-link" onclick="document.getElementById('${s.id}').scrollIntoView({behavior:'smooth', block:'start'})">${s.label}</a></li>`;
        }
      });
    } else {
      const headings = contentBox.querySelectorAll('h3');
      tocHtml += `<li class="tracker-item"><a class="tracker-link" onclick="document.getElementById('sect-top').scrollIntoView({behavior:'smooth', block:'start'})">Intro</a></li>`;
      headings.forEach((h, i) => {
        const targetId = 'heading-' + i;
        h.id = targetId;
        tocHtml += `<li class="tracker-item"><a class="tracker-link" onclick="document.getElementById('${targetId}').scrollIntoView({behavior:'smooth', block:'start'})">${h.innerText}</a></li>`;
      });
    }
    tocList.innerHTML = tocHtml;

    if (tocObserver) tocObserver.disconnect();
    tocObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.tracker-item').forEach(item => item.classList.remove('active'));
          const activeLink = document.querySelector(`.tracker-link[onclick*="${entry.target.id}"]`);
          if (activeLink) activeLink.parentElement.classList.add('active');
        }
      });
    }, { root: document.getElementById('modal-body'), rootMargin: '-10% 0px -60% 0px' });

    contentBox.querySelectorAll('.portfolio-section-wrap, [id^="sect-top"], h3').forEach(el => tocObserver.observe(el));

    const revealElements = contentBox.querySelectorAll('h3, p, img, .m-section-title, .detail-bento, .m-pdf-wrap, .dual-slider-wrap');
    revealElements.forEach(el => el.classList.add('reveal-item'));
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } });
    }, { root: document.getElementById('modal-body'), threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
  }, 500);
}

// ── 모달 닫기 ──
function closeModal() {
  Object.keys(modalSliders).forEach(key => stopAutoPlay(key));
  if (tocObserver) tocObserver.disconnect();
  if (revealObserver) revealObserver.disconnect();
  document.getElementById('detail-modal').classList.remove('active');
  setTimeout(() => {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('modal-body').innerHTML = '';
  }, 400);
}

// ── 햄버거 메뉴 ──
document.getElementById('hamburgerBtn').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
});

// ── 페이지 전환 ──
function switchPage(pageId, pushState = true) {
  if (window.innerWidth <= 768) {
    document.getElementById('hamburgerBtn').classList.remove('open');
    document.getElementById('navLinks').classList.remove('open');
  }
  document.querySelectorAll('.page-link').forEach(link => link.classList.remove('active'));
  const homeLogo = document.getElementById('nav-logo-home');
  if (homeLogo) homeLogo.classList.remove('active');
  if (pageId === 'home') { if (homeLogo) homeLogo.classList.add('active'); }
  else {
    const activeLink = document.querySelector(`.page-link[data-target="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
  }
  document.querySelectorAll('.page').forEach(page => { page.classList.remove('active'); page.scrollTop = 0; });
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) targetPage.classList.add('active');
  if (pushState) { history.pushState({ page: pageId }, '', '#' + pageId); }
}

// ── 브라우저 뒤로가기 ──
window.addEventListener('popstate', (e) => {
  closeModal();
  if (e.state && e.state.page) { switchPage(e.state.page, false); }
  else {
    let hash = window.location.hash.replace('#', '');
    if (['home', 'portfolio', 'study', 'games', 'about'].includes(hash)) { switchPage(hash, false); }
    else { switchPage('home', false); }
  }
});

// ── 초기 페이지 로드 ──
window.addEventListener('DOMContentLoaded', () => {
  let hash = window.location.hash.replace('#', '');
  let initialPage = ['home', 'portfolio', 'study', 'games', 'about'].includes(hash) ? hash : 'home';
  switchPage(initialPage, false);
  history.replaceState({ page: initialPage }, '', '#' + initialPage);
});