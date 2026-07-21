<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';

  // Ported from the approved Shell: left navigation with 10 product sections.
  const nav = [
    { href: '/', label: 'Command Center' },
    { href: '/leads', label: 'Leads' },
    { href: '/projects', label: 'Projects' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/estimate-requests', label: 'Estimate Requests' },
    { href: '/daily-reports', label: 'Daily Reports' },
    { href: '/employees', label: 'Employees' },
    { href: '/customers', label: 'Customers' },
    { href: '/documents', label: 'Documents' },
    { href: '/settings', label: 'Settings' }
  ];

  $: pathname = $page.url.pathname;
  function isActive(href: string): boolean {
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }
</script>

<div class="app">
  <aside class="sidebar">
    <div class="brand">
      <div class="roof" aria-hidden="true">
        <svg viewBox="0 0 62 40"><path d="M31 3 L59 24 H51 V37 H11 V24 H3 Z" fill="#12294a"/><path d="M31 3 L59 24 H51 L31 9 L11 24 H3 Z" fill="#c2953f"/><rect x="26" y="26" width="10" height="11" fill="#c2953f"/></svg>
      </div>
      <h1 class="serif">LEGACY</h1>
      <div class="rule"><i></i><span>BUILDERS</span><i></i></div>
      <div class="tag">Building Homes. Building Legacy.<em>Building What Matters Most.</em></div>
    </div>

    <nav class="nav">
      {#each nav as item}
        <a href={item.href} class:active={isActive(item.href)}>{item.label}</a>
      {/each}
    </nav>

    <div class="sb-user">
      <div class="av">DH</div>
      <div><div class="nm">Dustin Hope</div><div class="rl">Owner</div></div>
    </div>
    <div class="sb-foot">Legacy Office Manager v1.0</div>
  </aside>

  <div class="main">
    <header class="topbar">
      <div class="tt"><b>Legacy Office Manager</b><span>Your AI Office Employee</span></div>
    </header>
    <section class="content"><slot /></section>
  </div>
</div>

<style>
  .app{display:flex;min-height:100vh;}
  .sidebar{width:290px;min-width:290px;background:var(--navy);display:flex;flex-direction:column;}
  .brand{background:#fff;padding:26px 22px 22px;text-align:center;}
  .brand .roof{width:62px;height:40px;margin:0 auto 6px;}
  .brand .roof svg{width:100%;height:100%;}
  .brand h1{font-size:27px;letter-spacing:2px;color:var(--navy);font-weight:800;line-height:1;}
  .brand .rule{display:flex;align-items:center;justify-content:center;gap:8px;margin:5px 0 2px;}
  .brand .rule span{font-size:11px;letter-spacing:4px;color:var(--gold);font-weight:600;}
  .brand .rule i{height:1px;width:26px;background:var(--gold);display:inline-block;}
  .brand .tag{font-size:12px;color:var(--navy);margin-top:12px;font-weight:500;}
  .brand .tag em{display:block;color:var(--gold);font-style:italic;margin-top:2px;}
  .nav{flex:1;padding:16px 0;}
  .nav a{display:flex;align-items:center;gap:14px;padding:12px 24px;color:#c3cede;text-decoration:none;font-size:15px;font-weight:500;transition:background .15s;}
  .nav a:hover{background:rgba(255,255,255,.06);}
  .nav a.active{background:var(--gold);color:#fff;font-weight:600;}
  .sb-user{display:flex;align-items:center;gap:12px;padding:16px 22px;border-top:1px solid rgba(255,255,255,.08);}
  .sb-user .av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#3a5680,#243d63);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;}
  .sb-user .nm{color:#fff;font-size:15px;font-weight:600;line-height:1.2;}
  .sb-user .rl{color:#93a2b8;font-size:12.5px;}
  .sb-foot{padding:14px 22px 18px;color:#7f8ea6;font-size:12px;}
  .main{flex:1;display:flex;flex-direction:column;min-width:0;}
  .topbar{height:66px;min-height:66px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 30px;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:40;}
  .topbar .tt{display:flex;align-items:baseline;gap:14px;}
  .topbar .tt b{font-size:19px;color:var(--navy);font-weight:700;}
  .topbar .tt span{font-size:14px;color:var(--gold);font-weight:500;}
  .content{flex:1;background:var(--cream);}
  @media (max-width:860px){
    .app{flex-direction:column;}
    .sidebar{width:100%;min-width:0;}
    .brand{padding:16px;}
    .nav{display:flex;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;padding:8px 12px;gap:6px;}
    .nav a{min-height:44px;padding:10px 16px;font-size:14px;white-space:nowrap;border-radius:8px;}
    .sb-user,.sb-foot{display:none;}
    .topbar{height:auto;min-height:0;padding:12px 18px;}
  }
</style>
