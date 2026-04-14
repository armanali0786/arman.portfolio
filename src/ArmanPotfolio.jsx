import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "react-feather";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  :root {
    --bg: #060a0f;
    --bg2: #0b1118;
    --panel: #0f1923;
    --border: #1a2d40;
    --accent: #00d4ff;
    --accent2: #00ff88;
    --accent3: #ff6b35;
    --accent4: #a78bfa;
    --text: #e2eaf2;
    --muted: #5a7a94;
    --mono: 'JetBrains Mono', monospace;
    --sans: 'Syne', sans-serif;
    --nav-bg: rgba(6, 10, 15, 0.92);
  }

  .light-theme {
    --bg: #f8fafc;
    --bg2: #ffffff;
    --panel: #f1f5f9;
    --border: #e2e8f0;
    --accent: #2563eb;
    --accent2: #10b981;
    --accent3: #f59e0b;
    --accent4: #7c3aed;
    --text: #0f172a;
    --muted: #64748b;
    --nav-bg: rgba(255, 255, 255, 0.92);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  .portfolio-root {
    background: var(--bg);
    color: var(--text);
    font-family: var(--mono);
    overflow-x: hidden;
    cursor: none;
    min-height: 100vh;
    transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cursor { width: 12px; height: 12px; background: var(--accent); border-radius: 50%; position: fixed; pointer-events: none; z-index: 9999; transition: transform 0.1s ease, background 0.2s; mix-blend-mode: screen; }
  .light-theme .cursor { mix-blend-mode: difference; background: var(--accent); }
  .cursor-trail { width: 32px; height: 32px; border: 1px solid var(--accent); border-radius: 50%; position: fixed; pointer-events: none; z-index: 9998; opacity: 0.4; transition: left 0.12s ease, top 0.12s ease; }

  .scanlines { position: fixed; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.012) 2px, rgba(0,212,255,0.012) 4px); pointer-events: none; z-index: 8888; }
  .light-theme .scanlines { opacity: 0.3; }
  .grid-bg { position: fixed; inset: 0; background-image: linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; z-index: 0; }
  .light-theme .grid-bg { background-image: linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px); }
  .glow { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%); pointer-events: none; z-index: 0; transition: left 1s ease, top 1s ease; }
  .light-theme .glow { background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%); }

  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 18px 60px; background: var(--nav-bg); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); transition: all 0.3s ease; }
  .nav-logo { font-family: var(--mono); font-size: 13px; color: var(--accent); letter-spacing: 2px; font-weight: 700; }
  .nav-logo span { color: var(--muted); }
  .nav-links { display: flex; gap: 24px; }
  .nav-links a { font-size: 10px; letter-spacing: 2px; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; position: relative; }
  .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: var(--accent); transition: width 0.3s; }
  .nav-links a:hover { color: var(--accent); }
  .nav-links a:hover::after { width: 100%; }
  .nav-links a.active { color: var(--accent); }
  .nav-right { display: flex; align-items: center; gap: 20px; }
  .nav-status { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--accent2); letter-spacing: 1px; }
  .status-dot { width: 7px; height: 7px; background: var(--accent2); border-radius: 50%; animation: pulse 2s infinite; }

  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
  .hamburger span { display: block; width: 22px; height: 2px; background: var(--accent); transition: all 0.3s; }
  .mobile-menu { display: none; position: fixed; top: 0; padding-top: 80px; bottom: 0; left: 0; right: 0; background: var(--nav-bg); backdrop-filter: blur(20px); border-left: 1px solid var(--border); z-index: 999; flex-direction: column; padding-inline: 40px; gap: 4px; }
  
  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  .theme-toggle:hover {
    background: rgba(124, 180, 255, 0.1);
    color: var(--accent);
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a { font-size: 18px; font-family: var(--sans); font-weight: 700; letter-spacing: 1px; color: var(--text); text-decoration: none; text-transform: uppercase; padding: 20px 0; border-bottom: 1px solid var(--border); transition: color 0.2s; }
  .mobile-menu a:last-child { border-bottom: none; }
  .mobile-menu a:hover { color: var(--accent); padding-left: 10px; }

  .hero { position: relative; min-height: 100vh; display: flex; align-items: center; padding: 120px 60px 60px; z-index: 1; overflow: hidden; }
  .hero-number { position: absolute; right: 60px; top: 50%; transform: translateY(-50%); font-size: clamp(180px, 22vw, 360px); font-family: var(--sans); font-weight: 800; color: transparent; -webkit-text-stroke: 1px rgba(0,212,255,0.08); letter-spacing: -10px; user-select: none; pointer-events: none; line-height: 1; transition: all 0.4s; }
  .light-theme .hero-number { -webkit-text-stroke: 1px rgba(37,99,235,0.1); }
  .hero-content { max-width: 820px; }
  .hero-eyebrow { font-size: 11px; letter-spacing: 4px; color: var(--accent); text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .hero-eyebrow::before { content: ''; display: block; width: 40px; height: 1px; background: var(--accent); }
  .hero h1 { font-family: var(--sans); font-size: clamp(52px, 8vw, 100px); font-weight: 800; line-height: 0.95; letter-spacing: -3px; margin-bottom: 28px; }
  .hero h1 .line2 { color: var(--accent); }
  .hero-desc { font-size: 14px; line-height: 1.8; color: var(--muted); max-width: 560px; margin-bottom: 48px; }
  .hero-desc strong { color: var(--text); font-weight: 500; }
  .hero-cta { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
  .btn-primary { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; background: var(--accent); color: var(--bg); font-family: var(--mono); font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border: none; cursor: none; transition: all 0.2s; clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-2px); }
  .btn-ghost { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; background: transparent; color: var(--text); font-family: var(--mono); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border: 1px solid var(--border); cursor: none; transition: all 0.2s; }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .hero-stats { display: flex; gap: 40px; flex-wrap: wrap; margin-top: 72px; padding-top: 40px; border-top: 1px solid var(--border); }
  .stat-num { font-family: var(--sans); font-size: 36px; font-weight: 800; color: var(--accent); line-height: 1; }
  .stat-label { font-size: 11px; color: var(--muted); letter-spacing: 2px; margin-top: 6px; }
  .hero-terminal { position: absolute; bottom: 48px; right: 60px; background: var(--panel); border: 1px solid var(--border); padding: 20px 24px; width: 340px; font-size: 12px; line-height: 1.8; }
  .terminal-bar { display: flex; gap: 6px; margin-bottom: 14px; }
  .t-dot { width: 10px; height: 10px; border-radius: 50%; }
  .t-dot.r { background: #ff5f57; } .t-dot.y { background: #febc2e; } .t-dot.g { background: #28c840; }
  .terminal-line { color: var(--muted); }
  .terminal-line .cmd { color: var(--accent2); } .terminal-line .val { color: var(--accent); } .terminal-line .str { color: var(--accent3); }
  .blink { animation: blink 1s step-end infinite; }

  section { position: relative; z-index: 1; padding: 100px 60px; }
  .section-header { display: flex; align-items: baseline; gap: 20px; margin-bottom: 64px; }
  .section-num { font-size: 11px; color: var(--accent); letter-spacing: 3px; opacity: 0.6; }
  .section-title { font-family: var(--sans); font-size: clamp(28px, 4vw, 52px); font-weight: 800; letter-spacing: -2px; }
  .section-line { flex: 1; height: 1px; background: var(--border); margin-left: 20px; }

  .skills-section { background: var(--bg2); }
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2px; }
  .skill-card { background: var(--panel); border: 1px solid var(--border); padding: 32px; position: relative; overflow: hidden; transition: all 0.3s; }
  .skill-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transform: scaleX(0); transition: transform 0.3s; }
  .skill-card:hover::before { transform: scaleX(1); }
  .skill-card:hover { border-color: rgba(0,212,255,0.3); transform: translateY(-4px); }
  .skill-cat { font-size: 10px; letter-spacing: 3px; color: var(--accent); text-transform: uppercase; margin-bottom: 16px; }
  .skill-title { font-family: var(--sans); font-size: 20px; font-weight: 700; margin-bottom: 20px; }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { font-size: 10px; padding: 5px 12px; background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.15); color: var(--muted); letter-spacing: 1px; transition: all 0.2s; }
  .tag:hover { background: rgba(0,212,255,0.15); color: var(--accent); }

  .exp-list { display: flex; flex-direction: column; }
  .exp-item { display: grid; grid-template-columns: 240px 1fr; border: 1px solid var(--border); border-bottom: none; transition: all 0.3s; }
  .exp-item:last-child { border-bottom: 1px solid var(--border); }
  .exp-item:hover { background: rgba(0,212,255,0.02); border-color: rgba(0,212,255,0.25); }
  .exp-left { padding: 36px 32px; border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 12px; }
  .exp-date { font-size: 11px; color: var(--accent); letter-spacing: 1px; }
  .exp-company { font-family: var(--sans); font-size: 17px; font-weight: 700; }
  .exp-location { font-size: 11px; color: var(--muted); }
  .exp-right { padding: 36px 40px; }
  .exp-role { font-family: var(--sans); font-size: 22px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .role-badge { font-family: var(--mono); font-size: 10px; font-weight: 400; padding: 4px 10px; border: 1px solid var(--accent2); color: var(--accent2); letter-spacing: 1px; }
  .exp-bullets { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .exp-bullets li { font-size: 13px; line-height: 1.7; color: var(--muted); padding-left: 20px; position: relative; }
  .exp-bullets li::before { content: '›'; position: absolute; left: 0; color: var(--accent); font-size: 16px; }
  .exp-bullets li strong { color: var(--text); font-weight: 500; }

  .projects-section { background: var(--bg2); }
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
  .project-card { background: var(--panel); border: 1px solid var(--border); overflow: hidden; position: relative; transition: all 0.3s; display: flex; flex-direction: column; }
  .project-card:hover { border-color: rgba(0,212,255,0.4); transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
  .project-header { padding: 28px 32px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .project-index { font-size: 11px; color: var(--accent); letter-spacing: 2px; margin-bottom: 10px; }
  .project-name { font-family: var(--sans); font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
  .project-link-icon { font-size: 18px; color: var(--muted); text-decoration: none; transition: color 0.2s; flex-shrink: 0; margin-top: 4px; }
  .project-link-icon:hover { color: var(--accent); }
  .project-body { padding: 24px 32px; flex: 1; }
  .project-desc { font-size: 12px; line-height: 1.8; color: var(--muted); margin-bottom: 20px; }
  .project-metrics { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
  .metric { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--accent2); letter-spacing: 0.5px; }
  .metric::before { content: '↑'; font-size: 10px; }
  .project-stack { display: flex; flex-wrap: wrap; gap: 6px; }
  .stack-tag { font-size: 10px; padding: 4px 10px; background: rgba(0,255,136,0.06); border: 1px solid rgba(0,255,136,0.15); color: var(--accent2); letter-spacing: 0.5px; }

  .edu-section { background: var(--bg); }
  .edu-timeline { position: relative; padding-left: 28px; }
  .edu-timeline::before { content: ''; position: absolute; left: 0; top: 16px; bottom: 16px; width: 1px; background: linear-gradient(180deg, var(--accent) 0%, var(--accent4) 50%, var(--accent2) 100%); opacity: 0.25; }
  .edu-entry { position: relative; padding: 0 0 52px 48px; }
  .edu-entry:last-child { padding-bottom: 0; }
  .edu-dot { position: absolute; left: -35px; top: 18px; width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--accent); background: var(--bg); z-index: 2; transition: all 0.3s; }
  .edu-entry:nth-child(2) .edu-dot { border-color: var(--accent4); }
  .edu-entry:nth-child(3) .edu-dot { border-color: var(--accent2); }
  .edu-entry:hover .edu-dot { background: var(--accent); box-shadow: 0 0 18px rgba(0,212,255,0.6); }
  .edu-card-inner { background: var(--panel); border: 1px solid var(--border); padding: 32px 36px; transition: all 0.3s; position: relative; overflow: hidden; }
  .edu-card-inner::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent), transparent); opacity: 0; transition: opacity 0.3s; }
  .edu-card-inner:hover { border-color: rgba(0,212,255,0.3); }
  .edu-card-inner:hover::before { opacity: 1; }
  .edu-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
  .edu-degree { font-family: var(--sans); font-size: 20px; font-weight: 800; margin-bottom: 6px; line-height: 1.2; }
  .edu-school { font-size: 13px; color: var(--accent3); line-height: 1.4; }
  .edu-entry:nth-child(2) .edu-school { color: var(--accent4); }
  .edu-entry:nth-child(3) .edu-school { color: var(--accent2); }
  .edu-right { text-align: right; flex-shrink: 0; }
  .edu-years { font-size: 11px; color: var(--muted); letter-spacing: 1px; display: block; margin-bottom: 8px; }
  .edu-score { font-family: var(--sans); font-size: 30px; font-weight: 800; color: var(--accent); line-height: 1; }
  .edu-entry:nth-child(2) .edu-score { color: var(--accent4); }
  .edu-entry:nth-child(3) .edu-score { color: var(--accent2); }
  .edu-score-label { font-size: 10px; color: var(--muted); letter-spacing: 2px; margin-top: 3px; }
  .edu-desc { font-size: 12px; color: var(--muted); line-height: 1.75; margin-top: 4px; }
  .edu-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .edu-tag { font-size: 10px; padding: 4px 12px; background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.15); color: var(--muted); letter-spacing: 0.5px; }
  .edu-entry:nth-child(2) .edu-tag { background: rgba(167,139,250,0.06); border-color: rgba(167,139,250,0.15); }
  .edu-entry:nth-child(3) .edu-tag { background: rgba(0,255,136,0.06); border-color: rgba(0,255,136,0.15); }

  .mentor-section { background: var(--bg2); }
  .mentor-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 72px; padding: 52px 52px; background: var(--panel); border: 1px solid var(--border); position: relative; overflow: hidden; }
  .mentor-hero::after { content: '</>'; position: absolute; right: 32px; bottom: -24px; font-family: var(--sans); font-size: 130px; font-weight: 800; color: rgba(167,139,250,0.04); pointer-events: none; letter-spacing: -4px; transition: color 0.4s; }
  .light-theme .mentor-hero::after { color: rgba(124, 58, 237, 0.08); }
  .mentor-eyebrow { font-size: 10px; letter-spacing: 3px; color: var(--accent4); text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .mentor-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--accent4); display: block; }
  .mentor-hero-title { font-family: var(--sans); font-size: clamp(28px, 3.5vw, 44px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.05; margin-bottom: 20px; }
  .mentor-hero-title span { color: var(--accent4); }
  .mentor-hero-desc { font-size: 13px; line-height: 1.85; color: var(--muted); }
  .mentor-hero-desc strong { color: var(--text); font-weight: 500; }
  .mentor-hero-right { display: flex; flex-direction: column; gap: 16px; }
  .mentor-stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .mentor-stat { background: var(--bg2); border: 1px solid var(--border); padding: 20px 22px; transition: all 0.3s; }
  .mentor-stat:hover { border-color: rgba(167,139,250,0.3); }
  .mentor-stat-num { font-family: var(--sans); font-size: 30px; font-weight: 800; color: var(--accent4); line-height: 1; margin-bottom: 4px; }
  .mentor-stat-label { font-size: 10px; color: var(--muted); letter-spacing: 2px; }
  .mentor-cta { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; background: var(--accent4); color: var(--bg); font-family: var(--mono); font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; transition: all 0.2s; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
  .mentor-cta:hover { background: var(--accent); transform: translateY(-2px); }
  .mentor-offer-label { text-align: center; font-family: var(--sans); font-size: 20px; font-weight: 700; color: var(--muted); margin-bottom: 32px; }
  .mentor-offer-label span { color: var(--text); }
  .mentor-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 56px; }
  .mentor-card { background: var(--panel); border: 1px solid var(--border); padding: 36px 28px; transition: all 0.3s; position: relative; overflow: hidden; }
  .mentor-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent4), var(--accent)); transform: scaleX(0); transition: transform 0.3s; }
  .mentor-card:hover::before { transform: scaleX(1); }
  .mentor-card:hover { border-color: rgba(167,139,250,0.3); transform: translateY(-6px); }
  .mentor-icon { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2); border-radius: 8px; font-size: 24px; margin-bottom: 20px; }
  .mentor-card-title { font-family: var(--sans); font-size: 17px; font-weight: 700; margin-bottom: 12px; }
  .mentor-card-desc { font-size: 12px; color: var(--muted); line-height: 1.75; }
  .mentor-approach-title { font-family: var(--sans); font-size: 18px; font-weight: 700; text-align: center; margin-bottom: 28px; }
  .mentor-steps { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid var(--border); }
  .mentor-step { padding: 28px 24px; border-right: 1px solid var(--border); position: relative; transition: background 0.3s; }
  .mentor-step:last-child { border-right: none; }
  .mentor-step:hover { background: rgba(167,139,250,0.04); }
  .mentor-step-num { font-size: 10px; color: var(--accent4); letter-spacing: 2px; margin-bottom: 12px; }
  .mentor-step-title { font-family: var(--sans); font-size: 15px; font-weight: 700; margin-bottom: 8px; }
  .mentor-step-desc { font-size: 11px; color: var(--muted); line-height: 1.65; }

  .certs-section { background: var(--bg); }
  .certs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
  .cert-card { border: 1px solid var(--border); padding: 28px; display: flex; flex-direction: column; gap: 12px; transition: all 0.3s; position: relative; overflow: hidden; }
  .cert-card::after { content: 'CERT'; position: absolute; right: -16px; bottom: -12px; font-family: var(--sans); font-size: 60px; font-weight: 800; color: rgba(0,212,255,0.03); pointer-events: none; transition: color 0.4s; }
  .light-theme .cert-card::after { color: rgba(37, 99, 235, 0.08); }
  .cert-card:hover { border-color: rgba(0,212,255,0.3); }
  .cert-issuer { font-size: 10px; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; }
  .cert-name { font-family: var(--sans); font-size: 15px; font-weight: 700; line-height: 1.3; }

  .contact-section { background: var(--bg2); text-align: center; }
  .contact-inner { max-width: 640px; margin: 0 auto; }
  .contact-desc { font-size: 14px; color: var(--muted); line-height: 1.8; margin-bottom: 48px; }
  .contact-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-bottom: 48px; }
  .contact-link { display: flex; align-items: center; gap: 10px; padding: 14px 24px; border: 1px solid var(--border); color: var(--muted); text-decoration: none; font-size: 12px; letter-spacing: 1px; transition: all 0.2s; }
  .contact-link:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,212,255,0.04); }
  .contact-link .icon { font-size: 16px; }
  .contact-email { font-family: var(--sans); font-size: clamp(16px, 3vw, 30px); font-weight: 700; color: var(--accent); text-decoration: none; letter-spacing: -0.5px; display: block; margin-bottom: 12px; transition: opacity 0.2s; word-break: break-all; }
  .contact-email:hover { opacity: 0.7; }

  footer { position: relative; z-index: 1; padding: 28px 60px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--muted); letter-spacing: 1px; }
  footer span { color: var(--accent); }

  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  @media (max-width: 1100px) {
    .mentor-cards { grid-template-columns: repeat(2, 1fr); }
    .mentor-steps { grid-template-columns: repeat(2, 1fr); }
    .mentor-step:nth-child(2) { border-right: none; }
    .mentor-step:nth-child(3) { border-top: 1px solid var(--border); border-right: 1px solid var(--border); }
    .mentor-step:nth-child(4) { border-top: 1px solid var(--border); border-right: none; }
  }
  @media (max-width: 900px) {
    nav { padding: 16px 28px; }
    section { padding: 80px 36px; }
    .hero { padding: 100px 36px 60px; }
    .mentor-hero { grid-template-columns: 1fr; gap: 36px; padding: 36px; }
  }
  @media (max-width: 768px) {
    .portfolio-root { cursor: auto; }
    .cursor, .cursor-trail { display: none; }
    nav { padding: 16px 20px; }
    .nav-links { display: none; }
    .nav-status { display: none; }
    .hamburger { display: flex; }
    .hero { padding: 90px 20px 48px; min-height: auto; }
    .hero-number { display: none; }
    .hero-terminal { display: none; }
    .hero h1 { font-size: clamp(42px, 13vw, 68px); letter-spacing: -2px; }
    .hero-desc { font-size: 13px; }
    .hero-stats { gap: 20px; margin-top: 40px; padding-top: 28px; display: grid; grid-template-columns: 1fr 1fr; }
    .stat-num { font-size: 28px; }
    .hero-cta { flex-direction: column; align-items: flex-start; gap: 12px; }
    .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
    section { padding: 60px 20px; }
    .section-title { font-size: clamp(24px, 8vw, 36px); letter-spacing: -1px; }
    .section-header { margin-bottom: 36px; gap: 12px; }
    .section-line { display: none; }
    .skills-grid { grid-template-columns: 1fr; gap: 10px; }
    .skill-card { padding: 22px 20px; }
    .exp-item { grid-template-columns: 1fr; }
    .exp-left { border-right: none; border-bottom: 1px solid var(--border); padding: 20px; }
    .exp-right { padding: 20px; }
    .exp-role { font-size: 17px; }
    .exp-bullets li { font-size: 12px; }
    .projects-grid { grid-template-columns: 1fr; }
    .project-header { padding: 20px 20px 14px; }
    .project-body { padding: 16px 20px; }
    .edu-timeline { padding-left: 16px; }
    .edu-entry { padding: 0 0 36px 36px; }
    .edu-dot { left: -29px; top: 16px; }
    .edu-card-inner { padding: 22px 18px; }
    .edu-top { flex-direction: column; gap: 12px; }
    .edu-right { text-align: left; }
    .edu-score { font-size: 24px; }
    .edu-degree { font-size: 17px; }
    .mentor-hero { padding: 24px 20px; gap: 28px; }
    .mentor-stat-row { grid-template-columns: 1fr 1fr; }
    .mentor-cards { grid-template-columns: 1fr; }
    .mentor-steps { grid-template-columns: 1fr; }
    .mentor-step { border-right: none !important; border-bottom: 1px solid var(--border); }
    .mentor-step:last-child { border-bottom: none; }
    .mentor-step:nth-child(3) { border-top: none !important; }
    .mentor-card { padding: 24px 20px; }
    .certs-grid { grid-template-columns: 1fr; }
    .contact-links { flex-direction: column; align-items: center; }
    .contact-link { width: 100%; max-width: 320px; justify-content: center; }
    footer { flex-direction: column; gap: 8px; text-align: center; padding: 24px 20px; }
  }
  @media (max-width: 480px) {
    .hero h1 { font-size: clamp(36px, 14vw, 56px); }
    .mentor-stat-row { grid-template-columns: 1fr; }
    .hero-stats { grid-template-columns: 1fr 1fr; gap: 16px; }
    .edu-card-inner { padding: 18px 14px; }
    .edu-school { font-size: 12px; }
  }
`;

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 55);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const mx = e.clientX, my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx - 6 + "px";
        cursorRef.current.style.top = my - 6 + "px";
      }
      if (trailRef.current) {
        setTimeout(() => {
          if (trailRef.current) {
            trailRef.current.style.left = mx - 16 + "px";
            trailRef.current.style.top = my - 16 + "px";
          }
        }, 80);
      }
      if (glowRef.current) {
        glowRef.current.style.left = mx - 300 + "px";
        glowRef.current.style.top = my - 300 + "px";
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const enter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "scale(2.5)";
        cursorRef.current.style.background = "var(--accent2)";
      }
    };
    const leave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "scale(1)";
        cursorRef.current.style.background = "var(--accent)";
      }
    };
    const els = document.querySelectorAll("a, button");
    els.forEach((el) => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
    return () => els.forEach((el) => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
  });

  return { cursorRef, trailRef, glowRef };
}

function useActiveNav() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const handler = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
      setActive(current);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}

function TerminalHero() {
  const lines = [
    <><span className="cmd">const</span> <span className="val">engineer</span> = {"{"}</>,
    <>&nbsp;&nbsp;<span className="cmd">name:</span> <span className="str">"Arman Ali"</span>,</>,
    <>&nbsp;&nbsp;<span className="cmd">role:</span> <span className="str">"Full Stack Dev"</span>,</>,
    <>&nbsp;&nbsp;<span className="cmd">location:</span> <span className="str">"Bengaluru 🇮🇳"</span>,</>,
    <>&nbsp;&nbsp;<span className="cmd">stack:</span> [<span className="str">"React"</span>, <span className="str">"Node"</span>],</>,
    <>&nbsp;&nbsp;<span className="cmd">cgpa:</span> <span className="val">8.62</span>,</>,
    <>&nbsp;&nbsp;<span className="cmd">openToWork:</span> <span className="val">true</span></>,
    <>{"}"}<span className="blink">▌</span></>,
  ];
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    lines.forEach((_, i) => {
      setTimeout(() => setVisible((v) => [...v, i]), 700 + i * 180);
    });
  }, []);
  return (
    <div className="hero-terminal">
      <div className="terminal-bar">
        <div className="t-dot r" /><div className="t-dot y" /><div className="t-dot g" />
      </div>
      {lines.map((line, i) => (
        <div className="terminal-line" key={i} style={{ opacity: visible.includes(i) ? 1 : 0, transition: "opacity 0.3s" }}>{line}</div>
      ))}
    </div>
  );
}

const skills = [
  { cat: "Frontend", title: "UI Engineering", tags: ["React.js","TypeScript","JavaScript","Next.js","Redux","Context API","HTML5","CSS3","Tailwind CSS"] },
  { cat: "Backend", title: "API & Services", tags: ["Node.js","Express.js","RESTful APIs","GraphQL","JWT Auth","Socket.io","Microservices","SSE"] },
  { cat: "Databases", title: "Data Layer", tags: ["MongoDB","PostgreSQL","MySQL","NoSQL"] },
  { cat: "DevOps & Cloud", title: "Infrastructure", tags: ["AWS EC2","AWS S3","Docker","GitHub Actions","CI/CD","Git"] },
  { cat: "Testing & Quality", title: "Test Engineering", tags: ["Jest","Mocha","React Testing Library","Unit Testing","Integration Tests"] },
  { cat: "Practices", title: "Engineering Culture", tags: ["Agile / Scrum","Code Reviews","Lazy Loading","Memoization","Virtual Rendering","Chrome DevTools"] },
];

const experience = [
  {
    date: "Sep 2025 — Present", company: "Evolvus Solutions", location: "Bengaluru, India", role: "Frontend Engineer", badge: "CURRENT",
    bullets: [
      <>Engineered a <strong>plug-and-play AI assistant widget</strong> via npm, reducing third-party integration time by <strong>80%</strong> — adopted by 3+ enterprise clients.</>,
      <>Built a <strong>Chat UI with MCP architecture + SSE streaming</strong>, replicating token-by-token LLM output like ChatGPT & Gemini.</>,
      <>Built high-performance <strong>ER Diagram UI</strong> rendering 1000+ tables with virtualized rendering — <strong>60% reduction in load time</strong>.</>,
      <>Delivered enterprise <strong>Job Scheduler UI</strong> — 4 major releases across 6-week Agile sprints.</>,
      <>Jest tests covering <strong>85%+ of critical UI components</strong> — cut production bug rate by <strong>40%</strong>.</>,
    ]
  },
  {
    date: "Sep 2024 — Sep 2025", company: "Cipher Craft", location: "Rajkot, India", role: "Frontend Developer",
    bullets: [
      <>Architected <strong>solar installation planning platform</strong> with 4 map APIs — serving <strong>500+ active users</strong> at 99% accuracy.</>,
      <>Built <strong>LinkedIn Chrome Extension</strong> with OAuth 2.0 for <strong>200+ daily active users</strong>, Stripe-powered subscriptions.</>,
      <>Aggressive performance optimization: bundle reduction, API minimization, faster load times.</>,
    ]
  },
  {
    date: "Jul 2023 — Jul 2024", company: "9Brainz", location: "Rajkot, India", role: "Web Developer",
    bullets: [
      <>Shipped scalable <strong>React.js apps supporting 1000+ active users</strong> across mobile and desktop.</>,
      <><strong>12+ RESTful APIs</strong> integrated with lazy loading & memoization — <strong>30% faster load time</strong>, <strong>22% better retention</strong>.</>,
    ]
  },
  {
    date: "Jan 2023 — Jun 2023", company: "Technomark Solutions", location: "Ahmedabad, India", role: "Software Developer Intern",
    bullets: [
      <>Delivered <strong>MERN stack analytics dashboard</strong> with Chart.js for three stakeholder teams.</>,
      <>Defined <strong>REST API contracts</strong> with backend engineers, translating into clean React components.</>,
    ]
  },
];

const projects = [
  {
    index: "PROJECT_01", name: "StackMastery", link: "https://stackmastery.netlify.app",
    desc: "Interview prep platform with 3-state card progression (Todo → Done → Review) linked to GFG & LeetCode. Real-time analytics dashboard with live completion metrics across 250+ curated DSA topics.",
    metrics: ["250+ topics", "Real-time analytics"],
    stack: ["React.js","TypeScript","Tailwind","Node.js","JWT"],
  },
  {
    index: "PROJECT_02", name: "HomeCare360", link: "https://homecare360.netlify.app",
    desc: "Full-stack local services marketplace with RBAC for customers, providers, and admins. End-to-end Stripe payment flows with real-time booking updates via Socket.io.",
    metrics: ["60% faster booking", "3 user roles"],
    stack: ["React.js","Node.js","MongoDB","Socket.io","Stripe"],
  },
  {
    index: "PROJECT_03", name: "DeliveryPoint", link: "https://delivery-point.netlify.app",
    desc: "Food delivery platform with multi-criteria restaurant search. Google Dialogflow AI bot autonomously resolves orders, refunds, and tracking — reducing manual support workload by 70%.",
    metrics: ["35% higher conversion", "3x faster support", "70% less manual work"],
    stack: ["React.js","Node.js","MongoDB","Dialogflow","Stripe"],
  },
];

const education = [
  {
    degree: "Bachelor of Engineering",
    school: "Marwadi Education Foundation Group of Institutions, Rajkot",
    years: "2019 — 2023", score: "8.62", scoreLabel: "CGPA / 10",
    desc: "Specialized in Web Technologies and Software Engineering. Graduated with honors — built strong foundations in algorithms, data structures, system design, and full-stack development through real-world project work.",
    tags: ["Information Technology","Web Technologies","Software Engineering","Graduated with Honors"],
  },
  {
    degree: "Higher Secondary Education",
    school: "Shrikant Babu Bindu Singh Degree College",
    years: "2017 — 2019", score: "71.8%", scoreLabel: "Percentile",
    desc: "Focused on completing coursework and board exam preparation. Began exploring technology and programming, establishing the foundation for a future in software engineering.",
    tags: ["Science Stream","Board Examinations","Career Exploration"],
  },
  {
    degree: "Secondary School Education",
    school: "Jay Ram Prasad Tiwari High School",
    years: "2016 — 2017", score: "61.9%", scoreLabel: "Percentile",
    desc: "Excelled academically while engaging in extracurricular activities. Developed early curiosity in computers and logical problem-solving that laid the groundwork for a career in technology.",
    tags: ["Academics","Extracurriculars","Early Tech Interest"],
  },
];

const certifications = [
  { issuer: "Codedamn", name: "Learn Next.js 11 — Build Modern Next.js Applications" },
  { issuer: "Amazon Training & Certification", name: "Amazon EC2 Basics" },
  { issuer: "Oracle Academy", name: "Database Programming with SQL" },
  { issuer: "Coding Ninjas", name: "Data Structures and Algorithms" },
];

export default function ArmanPotfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const { cursorRef, trailRef, glowRef } = useCursor();
  const activeSection = useActiveNav();
  useReveal();

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));


  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#education", label: "Education" },
    { href: "#mentorship", label: "Mentorship" },
    { href: "#certifications", label: "Certs" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="portfolio-root">
        <div className="cursor" ref={cursorRef} />
        <div className="cursor-trail" ref={trailRef} />
        <div className="scanlines" />
        <div className="grid-bg" />
        <div className="glow" ref={glowRef} />

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={closeMenu}>{l.label}</a>
          ))}
        </div>

        {/* Nav */}
        <nav>
          <div className="nav-logo">AA<span>.dev</span></div>
          <div className="nav-links">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={activeSection === l.href.slice(1) ? "active" : ""}>{l.label}</a>
            ))}
          </div>
          <div className="nav-right">
            <div className="nav-status"><div className="status-dot" />Available for hire</div>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "" }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "" }} />
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-number">3+</div>
          <div className="hero-content">
            <div className="hero-eyebrow">Full Stack Software Engineer</div>
            <h1>Arman<br /><span className="line2">Ali</span></h1>
            <p className="hero-desc">
              Building <strong>scalable web applications</strong> with React.js, TypeScript, and modern JavaScript frameworks. 3+ years turning complex requirements into <strong>clean, performant systems</strong> — from npm-distributed AI widgets to enterprise-grade ERD renderers.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn-primary">↓ View Projects</a>
              <a href="mailto:armanali.shaikh77@gmail.com" className="btn-ghost">Get in Touch</a>
            </div>
            <div className="hero-stats">
              {[["3+","Years Exp"],["4","Companies"],["3","Live Products"],["85%","Test Coverage"]].map(([n, l]) => (
                <div className="stat-item" key={l}>
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <TerminalHero />
        </section>

        {/* Skills */}
        <section className="skills-section" id="skills">
          <div className="section-header reveal">
            <div className="section-num">01</div>
            <h2 className="section-title">Tech Stack</h2>
            <div className="section-line" />
          </div>
          <div className="skills-grid">
            {skills.map((s) => (
              <div className="skill-card reveal" key={s.title}>
                <div className="skill-cat">{s.cat}</div>
                <div className="skill-title">{s.title}</div>
                <div className="skill-tags">{s.tags.map((t) => <div className="tag" key={t}>{t}</div>)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="exp-section" id="experience">
          <div className="section-header reveal">
            <div className="section-num">02</div>
            <h2 className="section-title">Experience</h2>
            <div className="section-line" />
          </div>
          <div className="exp-list">
            {experience.map((e) => (
              <div className="exp-item reveal" key={e.company}>
                <div className="exp-left">
                  <div className="exp-date">{e.date}</div>
                  <div className="exp-company">{e.company}</div>
                  <div className="exp-location">{e.location}</div>
                </div>
                <div className="exp-right">
                  <div className="exp-role">
                    {e.role} {e.badge && <span className="role-badge">{e.badge}</span>}
                  </div>
                  <ul className="exp-bullets">
                    {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="projects-section" id="projects">
          <div className="section-header reveal">
            <div className="section-num">03</div>
            <h2 className="section-title">Projects</h2>
            <div className="section-line" />
          </div>
          <div className="projects-grid">
            {projects.map((p) => (
              <div className="project-card reveal" key={p.name}>
                <div className="project-header">
                  <div>
                    <div className="project-index">{p.index}</div>
                    <div className="project-name">{p.name}</div>
                  </div>
                  <a href={p.link} target="_blank" rel="noreferrer" className="project-link-icon">↗</a>
                </div>
                <div className="project-body">
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-metrics">{p.metrics.map((m) => <div className="metric" key={m}>{m}</div>)}</div>
                  <div className="project-stack">{p.stack.map((s) => <div className="stack-tag" key={s}>{s}</div>)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="edu-section" id="education">
          <div className="section-header reveal">
            <div className="section-num">04</div>
            <h2 className="section-title">Education</h2>
            <div className="section-line" />
          </div>
          <div className="edu-timeline">
            {education.map((e, idx) => (
              <div className="edu-entry reveal" key={e.degree}>
                <div className="edu-dot" />
                <div className="edu-card-inner">
                  <div className="edu-top">
                    <div>
                      <div className="edu-degree">{e.degree}</div>
                      <div className="edu-school">{e.school}</div>
                    </div>
                    <div className="edu-right">
                      <span className="edu-years">{e.years}</span>
                      <div className="edu-score">{e.score}</div>
                      <div className="edu-score-label">{e.scoreLabel}</div>
                    </div>
                  </div>
                  <p className="edu-desc">{e.desc}</p>
                  <div className="edu-tags">{e.tags.map((t) => <div className="edu-tag" key={t}>{t}</div>)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mentorship */}
        <section className="mentor-section" id="mentorship">
          <div className="section-header reveal">
            <div className="section-num">05</div>
            <h2 className="section-title">Mentorship</h2>
            <div className="section-line" />
          </div>
          <div className="mentor-hero reveal">
            <div>
              <div className="mentor-eyebrow">Open to guide</div>
              <h3 className="mentor-hero-title">Let's grow<br /><span>together</span></h3>
              <p className="mentor-hero-desc">
                I'm passionate about helping others thrive in tech. Whether you need help with <strong>web development</strong>, architecture decisions, interview prep, or navigating your first dev job — my approach is <strong>hands-on, tailored</strong>, and outcome-focused.<br /><br />No fluff. Just real guidance from real industry experience.
              </p>
            </div>
            <div className="mentor-hero-right">
              <div className="mentor-stat-row">
                {[["3+","Yrs industry exp"],["4","Companies worked"],["∞","Passion for teaching"],["Free","First consultation"]].map(([n, l]) => (
                  <div className="mentor-stat" key={l}>
                    <div className="mentor-stat-num">{n}</div>
                    <div className="mentor-stat-label">{l}</div>
                  </div>
                ))}
              </div>
              <a href="mailto:armanali.shaikh77@gmail.com" className="mentor-cta">✉ Request Mentorship</a>
            </div>
          </div>

          <div className="mentor-offer-label reveal">What I <span>Offer</span></div>
          <div className="mentor-cards">
            {[
              { icon: "📖", title: "Code Review & Feedback", desc: "Detailed, constructive reviews to improve code quality, eliminate anti-patterns, and adopt production-grade best practices used in real enterprise systems." },
              { icon: "🎯", title: "Career Guidance", desc: "Actionable career advice — from cracking interviews and negotiating offers to choosing the right stack and navigating your first senior role." },
              { icon: "🤝", title: "Project Collaboration", desc: "Build real projects together to create a standout portfolio. Hands-on experience shipping production-grade React & Node.js applications from scratch." },
            ].map((c) => (
              <div className="mentor-card reveal" key={c.title}>
                <div className="mentor-icon">{c.icon}</div>
                <div className="mentor-card-title">{c.title}</div>
                <div className="mentor-card-desc">{c.desc}</div>
              </div>
            ))}
          </div>

          <div className="mentor-approach-title reveal">My Approach</div>
          <div className="mentor-steps reveal">
            {[
              { num: "STEP_01", title: "Understand Goals", desc: "Deep-dive into where you are and where you want to be. No generic advice — everything is tailored." },
              { num: "STEP_02", title: "Build a Roadmap", desc: "Custom learning path with clear milestones — focused, structured, and not overwhelming." },
              { num: "STEP_03", title: "Hands-on Sessions", desc: "Live coding, architecture walkthroughs, and real-time problem solving together." },
              { num: "STEP_04", title: "Track & Iterate", desc: "Regular check-ins, honest feedback loops, and adjustments as you progress." },
            ].map((s) => (
              <div className="mentor-step" key={s.num}>
                <div className="mentor-step-num">{s.num}</div>
                <div className="mentor-step-title">{s.title}</div>
                <div className="mentor-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="certs-section" id="certifications">
          <div className="section-header reveal">
            <div className="section-num">06</div>
            <h2 className="section-title">Certifications</h2>
            <div className="section-line" />
          </div>
          <div className="certs-grid">
            {certifications.map((c) => (
              <div className="cert-card reveal" key={c.name}>
                <div className="cert-issuer">{c.issuer}</div>
                <div className="cert-name">{c.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="contact-section" id="contact">
          <div className="contact-inner">
            <div className="section-header reveal" style={{ justifyContent: "center" }}>
              <div className="section-num">07</div>
              <h2 className="section-title">Let's Connect</h2>
            </div>
            <p className="contact-desc reveal">Open to full-time roles, freelance contracts, and interesting technical challenges. If you're building something ambitious, let's talk.</p>
            <a href="mailto:armanali.shaikh77@gmail.com" className="contact-email reveal">armanali.shaikh77@gmail.com</a>
            <div className="contact-links reveal">
              <a href="https://linkedin.com/in/arman-ali-8383081ab" target="_blank" rel="noreferrer" className="contact-link"><span className="icon">in</span> LinkedIn</a>
              <a href="https://portfolio-armanali.netlify.app" target="_blank" rel="noreferrer" className="contact-link"><span className="icon">⬡</span> Portfolio</a>
              <a href="tel:+917319977276" className="contact-link"><span className="icon">✆</span> +91-7319977276</a>
            </div>
            <div className="reveal" style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1px" }}>
              📍 Bengaluru, India · B.E. Information Technology · CGPA 8.62 / 10
            </div>
          </div>
        </section>

        <footer>
          <div>© 2026 <span>Arman Ali</span> — Full Stack Engineer</div>
          <div>Bengaluru, <span>India</span></div>
        </footer>
      </div>
    </>
  );
}