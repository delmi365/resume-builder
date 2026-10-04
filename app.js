/* 简历工坊 —— 纯前端本地简历编辑器 */
(function () {
  'use strict';

  var STORE_KEY = 'resume-workshop:v1';
  var SWATCHES = ['#2563eb', '#0f766e', '#b91c1c', '#7c3aed', '#c2410c', '#334155', '#0891b2'];

  /* ---------- 各板块字段定义 ---------- */
  var TYPES = {
    work: {
      label: '工作经历', itemLabel: '经历',
      fields: [
        { k: 'title', label: '公司名称' },
        { k: 'subtitle', label: '职位' },
        { k: 'start', label: '开始时间', half: true },
        { k: 'end', label: '结束时间', half: true },
        { k: 'desc', label: '工作内容 / 成果', type: 'textarea', ph: '每行一条；以 - 开头会渲染为项目符号' }
      ]
    },
    education: {
      label: '教育经历', itemLabel: '学校',
      fields: [
        { k: 'title', label: '学校名称' },
        { k: 'subtitle', label: '专业 · 学位' },
        { k: 'start', label: '开始时间', half: true },
        { k: 'end', label: '结束时间', half: true },
        { k: 'desc', label: '补充说明', type: 'textarea', ph: 'GPA、主修课程、奖学金等' }
      ]
    },
    project: {
      label: '项目经历', itemLabel: '项目',
      fields: [
        { k: 'title', label: '项目名称' },
        { k: 'subtitle', label: '角色 / 技术栈' },
        { k: 'start', label: '开始时间', half: true },
        { k: 'end', label: '结束时间', half: true },
        { k: 'link', label: '链接（可选）' },
        { k: 'desc', label: '项目描述', type: 'textarea' }
      ]
    },
    skill: {
      label: '专业技能', itemLabel: '技能',
      fields: [
        { k: 'title', label: '技能名称' },
        { k: 'subtitle', label: '掌握程度 / 说明' },
        { k: 'desc', label: '详细描述', type: 'textarea' }
      ]
    },
    custom: {
      label: '自定义板块', itemLabel: '条目',
      fields: [
        { k: 'title', label: '标题' },
        { k: 'subtitle', label: '副标题' },
        { k: 'start', label: '开始时间', half: true },
        { k: 'end', label: '结束时间', half: true },
        { k: 'link', label: '链接（可选）' },
        { k: 'desc', label: '描述', type: 'textarea' }
      ]
    }
  };

  var PROFILE_FIELDS = [
    { k: 'name', label: '姓名', half: true },
    { k: 'title', label: '求职意向 / 头衔', half: true },
    { k: 'email', label: '邮箱', half: true },
    { k: 'phone', label: '电话', half: true },
    { k: 'city', label: '所在城市', half: true },
    { k: 'link', label: '主页 / 作品集', half: true },
    { k: 'extra', label: '其他（微信 / GitHub 等）', half: true },
    { k: 'summary', label: '个人简介', type: 'textarea', wide: true }
  ];

  /* ---------- 示例数据 ---------- */
  function sampleData() {
    return {
      meta: { template: 'classic', accent: '#2563eb', fs: 14, gap: 10, font: 'sans', zoom: 100 },
      profile: {
        name: '张明远', title: '高级前端工程师 · 5 年经验',
        email: 'zhangmingyuan@example.com', phone: '138-0000-0000',
        city: '上海 · 浦东新区', link: 'github.com/zhangmingyuan', extra: '微信 zmy_dev',
        summary: '5 年前端开发经验，主导过多个千万级 DAU 产品的前端架构设计。擅长 React / TypeScript 技术栈与前端性能优化，累计将核心页面首屏加载时间降低 60%。习惯用数据驱动决策，带过 6 人前端小组。',
        avatar: ''
      },
      sections: [
        {
          id: uid(), type: 'work', title: '工作经历', zone: 'main', visible: true,
          items: [
            {
              title: '某某科技有限公司', subtitle: '高级前端工程师', start: '2021.06', end: '至今', link: '',
              desc: '负责企业级数据平台前端架构，月活用户 300 万+\n- 主导从 Webpack 迁移至 Vite，构建耗时从 96s 降至 12s\n- 设计组件库并推动 12 个业务线接入，需求交付周期缩短 35%\n- 建立前端性能监控体系，线上白屏率下降 82%'
            },
            {
              title: '某某互联网集团', subtitle: '前端工程师', start: '2019.07', end: '2021.05', link: '',
              desc: '- 参与 C 端营销活动搭建平台，支撑全年 200+ 活动页零故障上线\n- 实现可视化拖拽搭建方案，运营配置效率提升 3 倍\n- 负责 SSR 改造，SEO 自然流量提升 45%'
            }
          ]
        },
        {
          id: uid(), type: 'project', title: '项目经历', zone: 'main', visible: true,
          items: [
            {
              title: '企业级数据可视化平台', subtitle: '前端负责人 · React / ECharts / WebSocket', start: '2022.03', end: '2023.08', link: '',
              desc: '- 设计支持 10 万级数据点实时渲染的图表引擎，帧率稳定在 55fps 以上\n- 沉淀 40+ 通用图表组件，被集团内 8 个团队复用\n- 项目获公司年度技术创新奖'
            },
            {
              title: '开源脚手架 Vite-Plus', subtitle: '作者 · TypeScript', start: '2021.11', end: '至今', link: 'github.com/zhangmingyuan/vite-plus',
              desc: '- GitHub 累计 2.3k star，周下载量 1.2 万\n- 内置 15 套企业级模板与最佳实践配置'
            }
          ]
        },
        {
          id: uid(), type: 'education', title: '教育经历', zone: 'side', visible: true,
          items: [
            { title: '上海交通大学', subtitle: '计算机科学与技术 · 硕士', start: '2016.09', end: '2019.06', link: '', desc: 'GPA 3.7/4.0 · 一等奖学金 · ACM 校赛银奖' },
            { title: '武汉大学', subtitle: '软件工程 · 学士', start: '2012.09', end: '2016.06', link: '', desc: '专业前 10%' }
          ]
        },
        {
          id: uid(), type: 'skill', title: '专业技能', zone: 'side', visible: true,
          items: [
            { title: 'JavaScript / TypeScript', subtitle: '精通', link: '', desc: '' },
            { title: 'React / Vue / Next.js', subtitle: '熟练', link: '', desc: '' },
            { title: 'Node.js / NestJS', subtitle: '熟悉', link: '', desc: '' },
            { title: '工程化（Vite / Webpack / CI）', subtitle: '熟练', link: '', desc: '' },
            { title: '英语', subtitle: 'CET-6 · 可作为工作语言', link: '', desc: '' }
          ]
        }
      ]
    };
  }

  function emptyData() {
    return {
      meta: { template: 'classic', accent: '#2563eb', fs: 14, gap: 10, font: 'sans', zoom: 100 },
      profile: { name: '你的名字', title: '求职意向', email: '', phone: '', city: '', link: '', extra: '', summary: '', avatar: '' },
      sections: [
        { id: uid(), type: 'work', title: '工作经历', zone: 'main', visible: true, items: [newItem()] },
        { id: uid(), type: 'education', title: '教育经历', zone: 'main', visible: true, items: [newItem()] }
      ]
    };
  }

  /* ---------- 工具 ---------- */
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function $(s) { return document.querySelector(s); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function newItem() { return { title: '', subtitle: '', start: '', end: '', link: '', desc: '' }; }
  function secIndex(id) { for (var i = 0; i < state.sections.length; i++) { if (state.sections[i].id === id) return i; } return -1; }

  /* ---------- 状态 ---------- */
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && d.profile && d.sections) { d.meta = Object.assign(sampleData().meta, d.meta || {}); return d; }
      }
    } catch (e) { /* ignore */ }
    return sampleData();
  }
  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { }
    }, 300);
  }

  /* ================= 渲染：简历预览 ================= */
  var ICONS = {
    email: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M6 3h3l2 5-2.5 1.6a12.5 12.5 0 0 0 5.4 5.4L15.6 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2 2 2 0 0 1 6 3z"/></svg>',
    city: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',
    link: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18"/></svg>',
    extra: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>'
  };

  function contactHTML(icon, text) {
    if (!text) return '';
    return '<span class="rs-contact">' + (ICONS[icon] || '') + '<span>' + esc(text) + '</span></span>';
  }
  function dateRange(it) {
    var a = it.start, b = it.end;
    if (!a && !b) return '';
    if (a && b) return a + ' — ' + b;
    return a || b;
  }
  function descHTML(t) {
    if (!t) return '';
    var lines = String(t).split('\n');
    var out = '', open = false;
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i].trim();
      if (!l) continue;
      var isBullet = /^[-•·*]\s*/.test(l);
      var txt = esc(l.replace(/^[-•·*]\s*/, ''));
      if (isBullet) { if (!open) { out += '<ul>'; open = true; } out += '<li>' + txt + '</li>'; }
      else { if (open) { out += '</ul>'; open = false; } out += '<p>' + txt + '</p>'; }
    }
    if (open) out += '</ul>';
    return out;
  }

  function itemHTML(it) {
    var d = dateRange(it);
    var h = '<div class="rs-item">';
    h += '<div class="rs-item-hd"><div class="rs-item-title">' + esc(it.title || '未命名') + '</div>' +
      (d ? '<div class="rs-item-date">' + esc(d) + '</div>' : '') + '</div>';
    if (it.subtitle) h += '<div class="rs-item-sub">' + esc(it.subtitle) + '</div>';
    if (it.link) h += '<div class="rs-item-link">' + esc(it.link) + '</div>';
    if (it.desc) h += '<div class="rs-item-desc">' + descHTML(it.desc) + '</div>';
    h += '</div>';
    return h;
  }

  function sectionHTML(sec) {
    var h = '<section class="rs-section"><h2 class="rs-sec-title">' + esc(sec.title) + '</h2>';
    var items = sec.items && sec.items.length ? sec.items : [];
    if (!items.length) h += '<div class="rs-empty">（待填写）</div>';
    for (var i = 0; i < items.length; i++) h += itemHTML(items[i]);
    h += '</section>';
    return h;
  }

  function headHTML() {
    var p = state.profile;
    var h = '<header class="rs-head">';
    var inner = '<div class="rs-head-txt">' +
      '<h1 class="rs-name">' + esc(p.name || '你的名字') + '</h1>' +
      (p.title ? '<div class="rs-title">' + esc(p.title) + '</div>' : '') +
      '<div class="rs-contacts">' +
      contactHTML('email', p.email) + contactHTML('phone', p.phone) +
      contactHTML('city', p.city) + contactHTML('link', p.link) + contactHTML('extra', p.extra) +
      '</div></div>';
    if (p.avatar) h += '<img class="rs-avatar" src="' + p.avatar + '" alt="">';
    h += inner;
    h += '</header>';
    if (p.summary) h += '<div class="rs-summary">' + esc(p.summary) + '</div>';
    return h;
  }

  function renderResume() {
    var m = state.meta;
    var font = m.font === 'serif' ? '"Songti SC","SimSun",Georgia,serif' : '"Microsoft YaHei","PingFang SC",Arial,sans-serif';
    var html = '<div class="resume tpl-' + m.template + '" style="--accent:' + m.accent +
      ';--fs:' + m.fs + 'px;--gap:' + m.gap + 'px;--rs-font:' + font + '">';
    html += headHTML();
    var secs = state.sections.filter(function (s) { return s.visible !== false; });
    if (m.template === 'modern') {
      var side = secs.filter(function (s) { return s.zone === 'side'; });
      var main = secs.filter(function (s) { return s.zone !== 'side'; });
      html += '<div class="rs-body">' +
        '<div class="rs-col rs-col-side">' + side.map(sectionHTML).join('') + '</div>' +
        '<div class="rs-col rs-col-main">' + main.map(sectionHTML).join('') + '</div></div>';
    } else {
      html += '<div class="rs-body">' + secs.map(sectionHTML).join('') + '</div>';
    }
    html += '</div>';
    $('#page').innerHTML = html;
    $('#preview-scale').style.transform = 'scale(' + (m.zoom / 100) + ')';
  }

  /* ================= 渲染：编辑器 ================= */
  function fieldHTML(f, val) {
    var v = esc(val == null ? '' : val);
    var cls = 'field' + (f.half ? '' : (f.type === 'textarea' ? ' wide' : ' wide'));
    if (f.half) cls = 'field';
    var h = '<div class="' + cls + '"><label>' + esc(f.label) + '</label>';
    if (f.type === 'textarea') h += '<textarea data-fk="' + f.k + '" rows="3" placeholder="' + esc(f.ph || '') + '">' + v + '</textarea>';
    else h += '<input data-fk="' + f.k + '" value="' + v + '" placeholder="' + esc(f.ph || '') + '">';
    return h + '</div>';
  }

  function renderEditor() {
    var root = $('#editor');
    var html = '';

    /* 基本信息 */
    html += '<div class="card"><div class="card-hd"><span class="sec-title" style="flex:none;font-weight:700">基本信息</span></div><div class="card-bd">';
    html += '<div class="avatar-row"><div class="avatar-box" id="avatar-box">' +
      (state.profile.avatar ? '<img src="' + state.profile.avatar + '" alt="">' : '无照片') + '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
      '<button class="btn tiny" data-act="avatar-upload">上传照片</button>' +
      (state.profile.avatar ? '<button class="btn tiny danger" data-act="avatar-clear">移除</button>' : '') +
      '<span style="align-self:center;color:#9aa2ad;font-size:11.5px">建议 1:1 正方形，≤2MB</span></div></div>';
    html += '<div class="grid2">';
    PROFILE_FIELDS.forEach(function (f) {
      html += fieldHTML(f, state.profile[f.k]);
    });
    html += '</div></div></div>';

    /* 各板块 */
    state.sections.forEach(function (sec, i) {
      var typeOpts = Object.keys(TYPES).map(function (k) {
        return '<option value="' + k + '"' + (sec.type === k ? ' selected' : '') + '>' + TYPES[k].label + '</option>';
      }).join('');
      html += '<div class="card' + (sec.visible === false ? ' off' : '') + '" data-sec="' + sec.id + '">';
      html += '<div class="card-hd">' +
        '<input class="sec-title" data-sec-title value="' + esc(sec.title) + '">' +
        '<select class="mini" data-sec-type style="font-size:12px;border:1px solid var(--line);border-radius:6px;padding:3px 4px">' + typeOpts + '</select>' +
        '<label class="switch"><input type="checkbox" data-sec-visible' + (sec.visible === false ? '' : ' checked') + '>显示</label>' +
        '<button class="icon-btn" data-act="sec-up" title="上移">↑</button>' +
        '<button class="icon-btn" data-act="sec-down" title="下移">↓</button>' +
        '<button class="icon-btn" data-act="sec-del" title="删除板块">✕</button>' +
        '</div>';
      html += '<div class="card-bd">';
      (sec.items || []).forEach(function (it, j) {
        html += '<div class="item" data-item="' + j + '">' +
          '<div class="item-hd"><span class="tag">' + TYPES[sec.type].itemLabel + ' ' + (j + 1) + '</span><span class="sp"></span>' +
          '<button class="icon-btn" data-act="item-up">↑</button>' +
          '<button class="icon-btn" data-act="item-down">↓</button>' +
          '<button class="icon-btn" data-act="item-copy">⧉</button>' +
          '<button class="icon-btn" data-act="item-del">✕</button></div>' +
          '<div class="grid2">';
        TYPES[sec.type].fields.forEach(function (f) { html += fieldHTML(f, it[f.k]); });
        html += '</div></div>';
      });
      html += '<button class="btn tiny sub-add" data-act="item-add">+ 添加' + TYPES[sec.type].itemLabel + '</button>';
      html += '</div></div>';
    });

    /* 添加板块 */
    var addOpts = Object.keys(TYPES).map(function (k) { return '<option value="' + k + '">' + TYPES[k].label + '</option>'; }).join('');
    html += '<div style="display:flex;gap:8px;align-items:center;padding:4px 2px 20px">' +
      '<select id="new-sec-type" style="border:1px solid var(--line);border-radius:7px;padding:6px 8px">' + addOpts + '</select>' +
      '<button class="btn" data-act="sec-add">+ 添加板块</button></div>';

    root.innerHTML = html;
  }

  function renderAll() { renderEditor(); renderResume(); }

  /* ================= 事件 ================= */
  document.addEventListener('input', function (e) {
    var t = e.target;
    var card = t.closest ? t.closest('.card[data-sec]') : null;
    if (t.dataset && t.dataset.fk) {
      var val = t.value;
      if (!card) { state.profile[t.dataset.fk] = val; }
      else {
        var si = secIndex(card.dataset.sec);
        var itemEl = t.closest('.item[data-item]');
        if (itemEl && si > -1) state.sections[si].items[+itemEl.dataset.item][t.dataset.fk] = val;
      }
      renderResume(); save(); return;
    }
    if (t.dataset && t.dataset.secTitle !== undefined) {
      var s2 = secIndex(t.closest('.card[data-sec]').dataset.sec);
      if (s2 > -1) { state.sections[s2].title = t.value; renderResume(); save(); }
    }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.secType !== undefined) {
      var s = secIndex(t.closest('.card[data-sec]').dataset.sec);
      if (s > -1) { state.sections[s].type = t.value; renderAll(); save(); }
    }
    if (t.dataset && t.dataset.secVisible !== undefined) {
      var s3 = secIndex(t.closest('.card[data-sec]').dataset.sec);
      if (s3 > -1) { state.sections[s3].visible = t.checked; renderAll(); save(); }
    }
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!btn) return;
    var act = btn.dataset.act;
    var card = btn.closest('.card[data-sec]');
    var si = card ? secIndex(card.dataset.sec) : -1;
    var itemEl = btn.closest('.item[data-item]');
    var ji = itemEl ? +itemEl.dataset.item : -1;

    if (act === 'sec-add') {
      var type = $('#new-sec-type').value;
      state.sections.push({ id: uid(), type: type, title: TYPES[type].label, zone: 'main', visible: true, items: [newItem()] });
      renderAll(); save();
    } else if (act === 'sec-del') {
      if (si > -1 && confirm('确定删除板块「' + state.sections[si].title + '」？')) { state.sections.splice(si, 1); renderAll(); save(); }
    } else if (act === 'sec-up' && si > 0) { swap(si, si - 1); }
    else if (act === 'sec-down' && si > -1 && si < state.sections.length - 1) { swap(si, si + 1); }
    else if (act === 'item-add' && si > -1) { state.sections[si].items.push(newItem()); renderAll(); save(); }
    else if (act === 'item-del' && si > -1) { state.sections[si].items.splice(ji, 1); renderAll(); save(); }
    else if (act === 'item-copy' && si > -1) {
      var cp = JSON.parse(JSON.stringify(state.sections[si].items[ji]));
      state.sections[si].items.splice(ji + 1, 0, cp); renderAll(); save();
    } else if (act === 'item-up' && ji > 0) { swapItem(si, ji, ji - 1); }
    else if (act === 'item-down' && si > -1 && ji < state.sections[si].items.length - 1) { swapItem(si, ji, ji + 1); }
    else if (act === 'avatar-upload') { $('#file-avatar').click(); }
    else if (act === 'avatar-clear') { state.profile.avatar = ''; renderAll(); save(); }
  });

  function swap(a, b) { var t = state.sections[a]; state.sections[a] = state.sections[b]; state.sections[b] = t; renderAll(); save(); }
  function swapItem(s, a, b) { var arr = state.sections[s].items, t = arr[a]; arr[a] = arr[b]; arr[b] = t; renderAll(); save(); }

  /* 头像 */
  $('#file-avatar').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    if (f.size > 3 * 1024 * 1024) { alert('图片过大，请选择 3MB 以内的图片'); return; }
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var size = 320, c = document.createElement('canvas');
        var side = Math.min(img.width, img.height);
        c.width = c.height = size;
        c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        state.profile.avatar = c.toDataURL('image/jpeg', .85);
        renderAll(); save();
      };
      img.src = r.result;
    };
    r.readAsDataURL(f);
    e.target.value = '';
  });

  /* 工具栏 */
  function bindSelect(sel, fn) { $(sel).addEventListener('change', function (e) { fn(e.target.value); }); }
  bindSelect('#sel-tpl', function (v) { state.meta.template = v; renderResume(); save(); });
  bindSelect('#sel-density', function (v) { state.meta.gap = +v; renderResume(); save(); });
  bindSelect('#sel-font', function (v) { state.meta.font = v; renderResume(); save(); });
  $('#sel-color').addEventListener('input', function (e) { state.meta.accent = e.target.value; renderResume(); save(); paintSwatches(); });
  $('#sel-fs').addEventListener('input', function (e) {
    state.meta.fs = +e.target.value; $('#val-fs').textContent = state.meta.fs; renderResume(); save();
  });
  $('#sel-zoom').addEventListener('input', function (e) {
    state.meta.zoom = +e.target.value; $('#val-zoom').textContent = state.meta.zoom + '%'; renderResume(); save();
  });

  function paintSwatches() {
    $('#swatches').innerHTML = SWATCHES.map(function (c) {
      return '<button class="sw' + (state.meta.accent.toLowerCase() === c.toLowerCase() ? ' on' : '') + '" data-c="' + c + '" style="background:' + c + '"></button>';
    }).join('');
  }
  $('#swatches').addEventListener('click', function (e) {
    var b = e.target.closest('.sw'); if (!b) return;
    state.meta.accent = b.dataset.c;
    $('#sel-color').value = b.dataset.c;
    renderResume(); save(); paintSwatches();
  });

  /* 顶栏操作 */
  $('#btn-print').addEventListener('click', function () {
    renderResume();
    setTimeout(function () { window.print(); }, 80);
  });
  $('#btn-sample').addEventListener('click', function () {
    if (confirm('载入示例数据？当前内容将被覆盖。')) { state = sampleData(); syncToolbar(); renderAll(); save(); }
  });
  $('#btn-reset').addEventListener('click', function () {
    if (confirm('清空全部内容，从空白开始？')) { state = emptyData(); syncToolbar(); renderAll(); save(); }
  });
  $('#btn-json').addEventListener('click', function () {
    download('简历-' + (state.profile.name || '未命名') + '.json', JSON.stringify(state, null, 2), 'application/json');
  });
  $('#btn-import').addEventListener('click', function () { $('#file-import').click(); });
  $('#file-import').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        if (!d.profile || !d.sections) throw 0;
        state = d; state.meta = Object.assign(sampleData().meta, d.meta || {});
        syncToolbar(); renderAll(); save();
      } catch (err) { alert('文件格式不正确'); }
    };
    r.readAsText(f); e.target.value = '';
  });
  $('#btn-html').addEventListener('click', function () {
    var css = $('#resume-style').textContent;
    var doc = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>' +
      esc(state.profile.name || '简历') + '</title><style>' + css +
      '\nbody{margin:0;background:#eef1f5;display:flex;justify-content:center;padding:20px}' +
      '.page{width:210mm;min-height:297mm;background:#fff;padding:14mm 15mm;box-shadow:0 4px 18px rgba(0,0,0,.12)}' +
      '@media print{@page{size:A4;margin:0}body{padding:0;background:#fff}.page{box-shadow:none;margin:0}}' +
      '</style></head><body><div class="page">' + $('#page').innerHTML + '</div></body></html>';
    download('简历-' + (state.profile.name || '未命名') + '.html', doc, 'text/html');
  });
  $('#btn-md').addEventListener('click', function () {
    var p = state.profile, out = '# ' + (p.name || '') + '\n';
    if (p.title) out += '> ' + p.title + '\n';
    var c = [p.email, p.phone, p.city, p.link, p.extra].filter(Boolean).join(' · ');
    if (c) out += '\n' + c + '\n';
    if (p.summary) out += '\n## 个人简介\n\n' + p.summary + '\n';
    state.sections.forEach(function (s) {
      if (s.visible === false) return;
      out += '\n## ' + s.title + '\n';
      (s.items || []).forEach(function (it) {
        var d = dateRange(it);
        out += '\n### ' + (it.title || '') + (d ? '（' + d + '）' : '') + '\n';
        if (it.subtitle) out += '- ' + it.subtitle + '\n';
        if (it.link) out += '- ' + it.link + '\n';
        if (it.desc) out += '\n' + it.desc + '\n';
      });
    });
    download('简历-' + (p.name || '未命名') + '.md', out, 'text/markdown');
  });

  function download(name, content, mime) {
    var blob = new Blob([content], { type: mime + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 200);
  }

  function syncToolbar() {
    var m = state.meta;
    $('#sel-tpl').value = m.template;
    $('#sel-color').value = m.accent;
    $('#sel-fs').value = m.fs; $('#val-fs').textContent = m.fs;
    $('#sel-density').value = String(m.gap);
    $('#sel-font').value = m.font;
    $('#sel-zoom').value = m.zoom; $('#val-zoom').textContent = m.zoom + '%';
    paintSwatches();
  }

  /* 启动 */
  syncToolbar();
  renderAll();
})();
