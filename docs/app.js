/* =====================================================
   Md. Mahfuzul Amin — Portfolio
   Interactions: theme toggle, magnetic hover, modal,
   reveal animations, role rotator, count-up, cursor glow
   ===================================================== */

(function () {
  'use strict';

  /* ---------- THEME TOGGLE ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('portfolio-theme');
  if (stored) root.setAttribute('data-theme', stored);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  /* ---------- YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- HAMBURGER ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function closeNav() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick);
  }
  function onDocClick(e) {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) closeNav();
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeNav();
    } else {
      navLinks.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      setTimeout(() => document.addEventListener('click', onDocClick), 0);
    }
  });

  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => closeNav());
  });

  // Close on resize to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 720) closeNav();
    }, 150);
  });

  /* ---------- CURSOR GLOW ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let curX = mouseX, curY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
  });

  function animateGlow() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursorGlow.style.left = curX + 'px';
    cursorGlow.style.top = curY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Hide glow on touch devices
  if ('ontouchstart' in window) cursorGlow.style.display = 'none';

  /* ---------- MAGNETIC HOVER ---------- */
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-reveal-delay') || 0;
        setTimeout(() => entry.target.classList.add('in'), Number(delay));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));

  /* ---------- COUNT-UP STATS ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = Number(el.getAttribute('data-count'));
        const duration = 1400;
        const start = performance.now();
        const animate = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => counterIO.observe(c));

  /* ---------- ROLE ROTATOR ---------- */
  const roles = [
    'Enterprise Solutions Architect',
    'Oracle APEX Specialist',
    'IT Manager',
    'Full-Stack Engineer',
    'Database Migration Lead'
  ];
  const roleEl = document.getElementById('roleText');
  let roleIdx = 0, charIdx = 0, deleting = false;
  function tickRole() {
    const role = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      roleEl.textContent = role.slice(0, charIdx);
      if (charIdx === role.length) {
        deleting = true;
        setTimeout(tickRole, 1800);
        return;
      }
      setTimeout(tickRole, 60);
    } else {
      charIdx--;
      roleEl.textContent = role.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tickRole, 300);
        return;
      }
      setTimeout(tickRole, 35);
    }
  }
  if (roleEl) setTimeout(tickRole, 800);

  /* ---------- PROJECT DATA + MODAL ---------- */
  const projects = {
    'svantex-traceability': {
      title: 'Svantex Traceability System',
      tag: 'Supply Chain Map Engine',
      image: 'TraceabilityDashboard.png',
      summary: 'A high-fidelity supply-chain visibility platform stitched together from procurement orders, vendor shipments, and live GPS coordinates. The application turns raw order data into a flowing map of where every consignment is in the network at any moment.',
      features: [
        'Custom APEX 23.2 interactive reports with cascading region-to-region drilldowns',
        'ORDS 26.2 REST endpoints consumed by the OpenStreetMap canvas',
        'Procedural PL/SQL packages handling geo-fencing and route deviation alerts',
        'Multi-tenant access control via APEX Authorization schemes'
      ],
      challenges: 'Reconciling GPS jitter and weak GPS signals from low-end field devices. Solved with a Kalman-style smoothing routine in PL/SQL plus a confidence radius shown directly on the map.',
      dbLayer: 'Oracle 19c with materialized views for fast map-tile refresh; partitioned tables for shipment logs.'
    },
    'svantex-tna': {
      title: 'Svantex Time & Action (TNA)',
      tag: 'Manufacturing Controller',
      image: 'TNADashboard.png',
      summary: 'A Time & Action controller for manufacturing operations. Every production run is broken into milestones with owners, deadlines, escalations, and follow-up logs surfaced in a single dashboard.',
      features: [
        'Stage-gate workflow editor with bulk follow-up updates',
        'Dynamic forms driven by APEX collections and PL/SQL APIs',
        'Role-based approval chain for stage transitions',
        'Excel-grade export pipelines using ORDS / ORDS Printer'
      ],
      challenges: 'Coordinating dozens of concurrent milestones across cross-functional teams without losing audit history. Solved by append-only event tables and immutable audit triggers.',
      dbLayer: 'Oracle 19c with APEX 20.2; sequences and triggers feed the timeline events.'
    },
    'hrms-geolocation': {
      title: 'Enterprise HRMS & Live Geolocation',
      tag: 'Personnel Tracking Infrastructure',
      image: 'LeaveHome.png',
      summary: 'A full HRMS stack — leave, attendance, payroll — fused with live field GPS tracking. Personnel in the field push coordinates through a mobile companion app; field managers see them on a glass-map dashboard in real time.',
      features: [
        'Leave application & multi-level approval workflow',
        'Biometric punch ingestion from ZKTeco & Anviz devices via SOAP / REST bridges',
        'Live geolocation canvas with personnel clusters and route history',
        'Monthly overtime and attendance summaries (RDL reports)'
      ],
      challenges: 'Stabilizing the device-bridge for biometric punches during network drops. Solved with an on-device buffer and replay queue plus a watchdog service on Tomcat.',
      dbLayer: 'Oracle 19c on CentOS, Apache Tomcat fronting APEX, encrypted credential vault for device secrets.'
    },
    'procurement': {
      title: 'Procurement Management & CS Approval',
      tag: 'Procurement Workflow Engine',
      image: 'ProcurementHome.png',
      summary: 'A complete procurement pipeline covering requisition intake, vendor comparative statements (CS), and multi-stage approvals. The system auto-generates comparative analysis reports and dispatches email notifications to every approval stakeholder in the chain.',
      features: [
        'Requisition-to-PO workflow with role-based approval matrix',
        'Comparative Statement (CS) generator with weighted scoring',
        'Automated email notifications via Oracle AS 10g to each approval stakeholder',
        'Crystal-report style PDF/Excel exports of approved CS sheets'
      ],
      challenges: 'Coordinating parallel approvals across geographically distributed approvers without losing audit history. Solved with a state-machine PL/SQL engine plus an outbox table driving the notification dispatcher.',
      dbLayer: 'Oracle Database 11g with APEX 18 front-end; Oracle Application Server 10g handles the email notification pipeline and report rendering.'
    },
    'vehicle': {
      title: 'Vehicle Management System',
      tag: 'Fleet Operations Controller',
      image: 'VehicleHome.png',
      summary: 'A unified fleet operations platform covering repair requisitions, fuel billing, and scheduled maintenance. Every vehicle has a complete service history surfaced through an APEX-driven dashboard.',
      features: [
        'Repair requisition workflow with parts, labor and vendor cost tracking',
        'Fuel billing ledger with mileage vs. consumption analytics',
        'Preventive maintenance scheduler with service-due alerts',
        'Vehicle-wise history reports (Oracle Reports integration)'
      ],
      challenges: 'Reconciling fuel receipts captured manually against actual pump readings. Solved with a tolerance-checked reconciliation routine that flags anomalies for supervisor review.',
      dbLayer: 'Oracle Database 11g with APEX 18; Oracle Reports for printable service and requisition documents; PL/SQL packages for the maintenance scheduler.'
    }
  };

  const modal = document.getElementById('photomodal');
  const modalMedia = document.getElementById('photomodalMedia');
  const modalContent = document.getElementById('photomodalContent');
  const modalClose = document.getElementById('photomodalClose');

  function openProject(key) {
    const p = projects[key];
    if (!p) return;
    modalMedia.innerHTML = `<img src="${p.image}" alt="${p.title}" />`;
    modalContent.innerHTML = `
      <span class="modal-tag">${p.tag}</span>
      <h2>${p.title}</h2>
      <p>${p.summary}</p>
      <h4>Engineering Highlights</h4>
      <ul class="modal-list">
        ${p.features.map((f) => `<li>${f}</li>`).join('')}
      </ul>
      <h4>Challenges Solved</h4>
      <p>${p.challenges}</p>
      <h4>Database &amp; Infrastructure Layer</h4>
      <p>${p.dbLayer}</p>
      <div class="modal-stack">
        <span class="chip">Oracle APEX</span>
        <span class="chip">PL/SQL</span>
        <span class="chip">ORDS</span>
        <span class="chip">Oracle 19c</span>
      </div>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-project');
      openProject(key);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProject(card.getAttribute('data-project'));
      }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* ---------- CERTIFICATION DATA + MODAL ---------- */
  const certifications = {
    'apex-cdocp': {
      title: 'Oracle APEX Cloud Certified Developer Professional',
      tag: 'Professional · Cloud',
      image: 'APEX24CDOCP.png',
      certificate: 'Oracle APEX Cloud Developer Certified Professional.png',
      issuer: 'Oracle University',
      issued: 'Oracle APEX 24.x',
      summary: 'The professional-level credential validating production-grade expertise in building, securing, deploying, and maintaining Oracle APEX applications on Oracle Cloud Infrastructure.',
      skills: [
        'Designing responsive APEX applications using the latest low-code capabilities',
        'Implementing server-side logic with PL/SQL, collections, and APIs',
        'Securing applications using APEX built-in authentication and authorization schemes',
        'Deploying and managing APEX applications on Oracle Autonomous Database / OCI'
      ],
      verifyUrl: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=4CC4DAD4B507063ACD9EB59EF04579D403273491B6D1369E75FAB3C415B35F88'
    },
    'forms-ocp': {
      title: 'Oracle Forms Developer Certified Professional',
      tag: 'Professional · Legacy Stack',
      image: 'Oracle-Certification-badge_OC-Professional.png',
      certificate: 'Oracle Forms Developer Certified Professional .png',
      issuer: 'Oracle University',
      issued: 'Oracle Forms',
      summary: 'Advanced certification confirming expert-level command of Oracle Forms development — including form design, triggers, LOVs, alerts, and integration with database-side PL/SQL.',
      skills: [
        'Architecting scalable Oracle Forms modules for enterprise operations',
        'Designing complex triggers, alerts, and validation logic',
        'Integrating Forms with Reports, PL/SQL libraries, and external services',
        'Migrating and modernizing legacy Forms assets alongside APEX'
      ],
      verifyUrl: 'https://www.credly.com/earner/earned/badge/fdeecbad-8d2d-47b3-9f1b-70b01fd4a304'
    },
    'plsql-oca': {
      title: 'Oracle PL/SQL Developer Certified Associate',
      tag: 'Associate · Procedural SQL',
      image: 'Oracle_PL_SQL_Developer_Associate.png',
      certificate: 'Oracle PL_SQL Developer Certified Associate.png',
      issuer: 'Oracle University',
      issued: 'Oracle Database',
      summary: 'Foundational credential certifying proficiency in the PL/SQL language — including block structure, control statements, cursors, exceptions, and stored program units.',
      skills: [
        'Writing robust PL/SQL blocks, procedures, functions, and packages',
        'Managing cursors, exceptions, and bulk operations',
        'Working with collections, records, and object types',
        'Trigger design and dependency management'
      ],
      verifyUrl: 'https://www.credly.com/earner/earned/badge/08e867ed-440c-4430-8a17-54303da6076f'
    },
    'sql-expert': {
      title: 'Oracle Database SQL Certified Expert',
      tag: 'Expert · SQL',
      image: 'Oracle-Certification-badge_OC-CertifiedExpert.png',
      certificate: 'Oracle Database SQL Certified Expert.png',
      issuer: 'Oracle University',
      issued: 'Oracle Database SQL',
      summary: 'Expert-level SQL certification validating command of advanced query techniques, DML/DDL operations, constraints, joins, set operators, and analytic functions.',
      skills: [
        'Authoring complex multi-table joins, subqueries, and set operations',
        'Applying analytic and ranking functions for reporting workloads',
        'Schema design, constraints, indexes, and DDL management',
        'Performance-aware query design for high-volume enterprise datasets'
      ],
      verifyUrl: 'https://www.credly.com/earner/earned/badge/bd760dc7-3451-4379-8ba0-e14448148186'
    }
  };

  function openCert(key) {
    const c = certifications[key];
    if (!c) return;
    modalMedia.innerHTML = c.certificate
      ? `<img src="${c.certificate}" alt="${c.title} certificate" />`
      : `<img src="${c.image}" alt="${c.title}" />`;
    modalContent.innerHTML = `
      <div class="cert-modal-hero">
        <img src="${c.image}" alt="${c.title}" />
        <div class="cert-modal-meta">
          <span class="cert-tag">${c.tag}</span>
          <h2>${c.title}</h2>
          <p style="margin:4px 0 0;color:var(--text-muted);font-size:13px;">Issued by ${c.issuer} · ${c.issued}</p>
        </div>
      </div>
      <span class="modal-tag">Verified Credential</span>
      <p>${c.summary}</p>
      <h4>Validated Skills</h4>
      <ul class="modal-list">
        ${c.skills.map((s) => `<li>${s}</li>`).join('')}
      </ul>
      <a class="cert-visit-btn" href="${c.verifyUrl}" target="_blank" rel="noopener noreferrer">
        <span>Visit Original Link</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.cert-card').forEach((card) => {
    card.addEventListener('click', () => {
      openCert(card.getAttribute('data-cert'));
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCert(card.getAttribute('data-cert'));
      }
    });
  });

  /* ---------- GO TO TOP ---------- */
  const goTop = document.getElementById('goTop');
  if (goTop) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 400) {
            goTop.classList.add('show');
          } else {
            goTop.classList.remove('show');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
    goTop.addEventListener('click', () => {
      const startY = window.scrollY || window.pageYOffset;
      const duration = 900;
      const startTime = performance.now();

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        window.scrollTo(0, startY * (1 - eased));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- COOKIE CONSENT + GA GATING ---------- */
  const COOKIE_KEY = 'portfolio-cookie-consent';
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  function setConsent(value) {
    try { localStorage.setItem(COOKIE_KEY, value); } catch (e) { /* ignore */ }
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: value === 'accepted' ? 'granted' : 'denied'
      });
    }
  }

  let storedConsent = null;
  try { storedConsent = localStorage.getItem(COOKIE_KEY); } catch (e) { /* ignore */ }

  if (storedConsent === 'accepted' || storedConsent === 'declined') {
    setConsent(storedConsent);
  } else {
    // Default GA consent to denied until user chooses
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(['consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    }]);
    setTimeout(() => {
      if (cookieBanner) cookieBanner.classList.add('show');
    }, 1200);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      setConsent('accepted');
      cookieBanner.classList.remove('show');
    });
  }
  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      setConsent('declined');
      cookieBanner.classList.remove('show');
    });
  }

  /* ---------- SMOOTH NAV HIGHLIGHT ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          if (a.getAttribute('href') === '#' + id) {
            a.style.color = 'var(--text)';
          } else {
            a.style.color = '';
          }
        });
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px' });
  sections.forEach((s) => navIO.observe(s));

})();