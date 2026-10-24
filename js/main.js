/**
 * U-Tron (Beijing) Electronics Co. Ltd. — Main JavaScript
 * Lightweight, Vanilla JavaScript. Zero external dependencies.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Sticky Navigation & Scroll Spy
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-drawer a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (sec) {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile drawer when a link is clicked
    mobileDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } );
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!mobileToggle.contains(e.target) && !mobileDrawer.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Product Category Filtering
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      const targetCat = this.getAttribute('data-category');

      productCards.forEach(function (card) {
        const cardCat = card.getAttribute('data-category');
        if (targetCat === 'all' || cardCat === targetCat) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(function () {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Modal Windows (Datasheets, Corporate Letter, Contact)
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  function openModal(title, htmlContent) {
    if (modalBackdrop && modalTitle && modalBody) {
      modalTitle.textContent = title;
      modalBody.innerHTML = htmlContent;
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

    // Attach Datasheet triggers
  const isZh = document.documentElement.lang.startsWith('zh');

  document.querySelectorAll('.btn-datasheet').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const title = this.getAttribute('data-title') || (isZh ? '产品技术规格说明书' : 'Technical Product Datasheet');
      const part = this.getAttribute('data-part') || 'N/A';
      const power = this.getAttribute('data-power') || 'N/A';
      const lumens = this.getAttribute('data-lumens') || 'N/A';
      const cct = this.getAttribute('data-cct') || 'N/A';
      const input = this.getAttribute('data-input') || 'N/A';
      const certs = this.getAttribute('data-certs') || 'CE, RoHS';
      const desc = this.getAttribute('data-desc') || '';
      const img = this.getAttribute('data-img') || '';
      const pdf = this.getAttribute('data-pdf') ? encodeURI(this.getAttribute('data-pdf')) : '';

      const content = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          ${img ? `<div style="text-align:center; background:#f8fafc; border-radius:10px; padding:1.5rem; border:1px solid #e2e8f0;"><img src="${img}" style="max-height:220px; margin:0 auto; object-fit:contain;" alt="${title}"></div>` : ''}
          <div style="font-size:0.875rem; color:#475569; line-height:1.6;">${desc}</div>
          
          <h4 style="font-size:0.95rem; font-weight:700; color:#0a193b; border-bottom:1px solid #e2e8f0; padding-bottom:0.5rem; margin-top:0.5rem;">${isZh ? '权威技术指标与认证参数' : 'Verified Technical Specifications'}</h4>
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
            <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:0.45rem 0; color:#64748b;">${isZh ? '工程型号:' : 'Engineering Model:'}</td><td style="font-weight:700; color:#0a193b; text-align:right;">${part}</td></tr>
            <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:0.45rem 0; color:#64748b;">${isZh ? '系统功率:' : 'System Power:'}</td><td style="font-weight:700; color:#0a193b; text-align:right;">${power}</td></tr>
            <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:0.45rem 0; color:#64748b;">${isZh ? '光通量输出:' : 'Luminous Output:'}</td><td style="font-weight:700; color:#0a193b; text-align:right;">${lumens}</td></tr>
            <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:0.45rem 0; color:#64748b;">${isZh ? '色温范围:' : 'Color Temperature:'}</td><td style="font-weight:700; color:#0a193b; text-align:right;">${cct}</td></tr>
            <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:0.45rem 0; color:#64748b;">${isZh ? '工作电压:' : 'Operating Voltage:'}</td><td style="font-weight:700; color:#0a193b; text-align:right;">${input}</td></tr>
            <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:0.45rem 0; color:#64748b;">${isZh ? '权威认证:' : 'Certifications:'}</td><td style="font-weight:700; color:#0345BF; text-align:right;">${certs}</td></tr>
          </table>

          <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:1rem; font-size:0.8125rem; color:#1e40af;">
            <strong>${isZh ? '品质与售后保证：' : 'Quality Assurance Note:'}</strong> ${isZh ? '产品已通过国家及国际质量检测标准。享有36个月至60个月工业级原厂质保与技术支持。' : 'Certified and tested according to international standard benchmarks. 36-Month Standard Limited Warranty applies with factory RMA support.'}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-top:0.5rem; padding-top:0.75rem; border-top:1px solid #e2e8f0;">
            ${pdf ? `
              <a href="${pdf}" target="_blank" rel="noopener noreferrer" download class="btn-primary" style="display:inline-flex; align-items:center; gap:0.45rem; font-size:0.8125rem; background:#059669; border-color:#059669;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                ${isZh ? '下载官方规格说明书 (PDF)' : 'Download Official Datasheet (PDF)'}
              </a>
            ` : '<span></span>'}
            <a href="#contact" onclick="document.getElementById('modalBackdrop').classList.remove('open'); document.body.style.overflow='';" class="btn-primary" style="display:inline-block; font-size:0.8125rem;">${isZh ? '索取项目工程报价单' : 'Request Official Engineering Quote'}</a>
          </div>
        </div>
      `;
      openModal(title, content);
    });
  });

  // Attach Corporate Letter trigger
  const letterBtn = document.getElementById('openLetterBtn');
  if (letterBtn) {
    letterBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const letterContent = isZh ? `
        <div style="font-size:0.925rem; color:#334155; line-height:1.8; display:flex; flex-direction:column; gap:1.25rem;">
          <div style="text-align:center; padding-bottom:1rem; border-bottom:1px solid #e2e8f0;">
            <h4 style="color:#0a193b; font-size:1.2rem; font-weight:800; margin-bottom:0.35rem;">优是一种品质 &bull; 创是不懈追求</h4>
            <p style="font-size:0.85rem; color:#64748b;">优创（北京）电子有限公司 创立与发展纪实</p>
          </div>
          <p>优创（北京）电子有限公司（U-Tron）成立于1992年，是一家专业高新技术企业，由<a href="https://america-china.com/zh.html" target="_blank" rel="noopener noreferrer" style="color:var(--primary); text-decoration:underline;">美中贸易合作公司（China Business Associates, CBA / America-China.com）</a>在京全额投资成立。创立伊始，优创即确立了“引进、研制、开发世界一流高新科技产品”的发展战略，搭建了代表美国先进科技进入中国现代化交通与电子建设的坚实平台。</p>
          <p>公司初创时期在北京市东城区北京第二印刷厂东五层设立了精密制造车间（签署25年长期租赁合同）。随着北京CBD区域的发展演变，优创积极响应首都城市产业规划，将生产与研发中心迁往北京经济技术开发区（亦庄BDA）锦绣街2,000平方米专用厂区，并在通州宋庄六合乔西路设立了生产基地。</p>
          <p>三十余年来，优创稳步前行。从1990年代为北京市公安交通管理局指挥调度中心研制大型背投大屏幕显示墙，到与国家模糊数据中心联合开发“优创6000”电子警察智能抓拍取证系统；从2007年携手Cree中标北京奥运会LED照明工程，到2009年为中铁建设承揽南京地铁2号线13公里地下隧道全线BatLED照明工程，再到启动北京通州3亿元市政改造及瑞典哥德堡北极严寒道路测试，优创始终走在行业前列。</p>
          <p>优创始终秉承“优越、创新”的经营理念与“诚信为本、顾客至上”的服务理念。公司每年将15%的净利润持续投入自主知识产权与核心技术研发，已拥有十余项国家专利，全系产品通过CE、RoHS、CSA等权威认证。</p>
          <div style="border-top:1px solid #e2e8f0; padding-top:1rem; font-style:italic; color:#64748b; font-size:0.85rem;">
            拉贾·马格斯维伦（Raja Mageswaran） 总经理 &bull; 优创（北京）电子有限公司
          </div>
        </div>
      ` : `
        <div style="font-size:0.925rem; color:#334155; line-height:1.75; display:flex; flex-direction:column; gap:1.25rem;">
          <div style="text-align:center; padding-bottom:1rem; border-bottom:1px solid #e2e8f0;">
            <h4 style="color:#0a193b; font-size:1.15rem; font-weight:800; margin-bottom:0.25rem;">In the Beginning: 1992 Founding Narrative</h4>
            <p style="font-size:0.8125rem; color:#64748b;">By Management &amp; Founders &bull; U-Tron (Beijing) Electronics Co. Ltd.</p>
          </div>
          <p>U-Tron (Beijing) Electronics Co. Ltd. was established in 1992 as a Wholly Owned Foreign Enterprise (WOFE) registered in Beijing, China. The founding investment was fully provided by an American enterprise, <strong><a href="https://america-china.com" target="_blank" rel="noopener noreferrer" style="color:var(--primary); text-decoration:underline;">America-China Business Associates (CBA)</a></strong>, with the core mission of introducing advanced American computer, telecommunication, and electronics technology to China for localization and manufacturing.</p>
          <p>Our initial operations began in central Beijing on the East 5th Floor of the historic #2 Printing Factory of Beijing under a 25-year operational lease covering 1,000 square meters. As urban development rapidly elevated the central district into Beijing's prime CBD, municipal zoning prompted industrial relocations. U-Tron subsequently relocated its comprehensive engineering and manufacturing operations to a modern 2,000 m² facility within the Beijing Economic-Technological Development Area (BDA) in Yizhuang.</p>
          <p>From pioneering digital overhead projectors and Beijing Traffic Bureau Command Center rear-projection walls in the 1990s, to deploying emergency 110/119/122 dispatch systems and partnering with Cree in 2007 for the Beijing Olympic Games, U-Tron has remained at the vanguard of innovation.</p>
          <p>Today, our solid-state High Power LED luminaires and Intelligent Transportation Systems illuminate thoroughfares and secure critical infrastructure in over 12 countries. We dedicate 15% of annual profits to continuous research and development, remaining true to our founding principle: people-oriented engineering built with integrity and pride.</p>
          <div style="border-top:1px solid #e2e8f0; padding-top:1rem; font-style:italic; color:#64748b; font-size:0.85rem;">
            Raja Magasweran, Managing Director &bull; U-Tron (Beijing) Electronics Co. Ltd.
          </div>
        </div>
      `;
      openModal(isZh ? '优创历史与企业历程' : 'Historic Corporate Background', letterContent);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 5. Contact Form Client-Side Validation & Simulated Submission
  const contactForm = document.getElementById('consultationForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const org = document.getElementById('formOrg').value.trim();
      const dept = document.getElementById('formDept').value;
      const message = document.getElementById('formMsg').value.trim();

      if (!name || !email || !message) {
        alert(isZh ? '请填写所有必填字段。' : 'Please complete all required fields.');
        return;
      }

      const safeName = escapeHtml(name);
      const safeDept = escapeHtml(dept);
      const safeEmail = escapeHtml(email);

      // Simulated success confirmation modal
      const confContent = isZh ? `
        <div style="text-align:center; padding:1.5rem 0;">
          <div style="width:60px; height:60px; border-radius:50%; background:#dcfce7; color:#16a34a; font-size:2rem; display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">✓</div>
          <h3 style="font-size:1.35rem; color:#0a193b; font-weight:800; margin-bottom:0.5rem;">技术咨询需求已成功提交</h3>
          <p style="color:#475569; font-size:0.9rem; line-height:1.6; max-width:440px; margin:0 auto 1.5rem;">
            感谢您，<strong>${safeName}</strong>！您关于 <strong>${safeDept}</strong> 的工程咨询需求已成功转接至工程技术团队。我们将尽快审核您的项目规格并发送回复至 <strong>${safeEmail}</strong>。
          </p>
          <button onclick="document.getElementById('modalBackdrop').classList.remove('open'); document.body.style.overflow='';" class="btn-primary" style="margin:0 auto;">确认并关闭</button>
        </div>
      ` : `
        <div style="text-align:center; padding:1.5rem 0;">
          <div style="width:60px; height:60px; border-radius:50%; background:#dcfce7; color:#16a34a; font-size:2rem; display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">✓</div>
          <h3 style="font-size:1.35rem; color:#0a193b; font-weight:800; margin-bottom:0.5rem;">Inquiry Successfully Transmitted</h3>
          <p style="color:#475569; font-size:0.9rem; line-height:1.6; max-width:440px; margin:0 auto 1.5rem;">
            Thank you, <strong>${safeName}</strong>. Your consultation request for the <strong>${safeDept}</strong> department has been logged. Our engineering liaison will review your specifications and reply to <strong>${safeEmail}</strong> within one business day.
          </p>
          <button onclick="document.getElementById('modalBackdrop').classList.remove('open'); document.body.style.overflow='';" class="btn-primary" style="margin:0 auto;">Close Confirmation</button>
        </div>
      `;
      contactForm.reset();
      openModal(isZh ? '咨询申请已受理' : 'Consultation Request Logged', confContent);
    });
  }
});
