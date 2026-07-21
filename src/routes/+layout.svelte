<script lang="ts">
  import '../app.css';
</script>

<div class="app-shell">
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">LB</div>
      <div class="brand-text">
        <span class="brand-name">Legacy Office Manager</span>
        <span class="brand-sub">Legacy Builders</span>
      </div>
    </div>
    <nav class="nav">
      <a href="/" class="nav-link active">Command Center</a>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer class="footbar">
    <span>Legacy Builders &middot; Run your business. Be home for what matters.</span>
    <span class="foot-note">Human confirmation required for every action &middot; Business logic runs securely in n8n</span>
  </footer>
</div>

<style>
  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 1.5rem;
    background: linear-gradient(90deg, var(--navy-900), var(--navy-700));
    border-bottom: 3px solid var(--gold-500);
    box-shadow: var(--shadow-md);
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }
  .brand-mark {
    flex: none;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--gold-400), var(--gold-600));
    color: var(--navy-900);
    font-weight: 800;
    letter-spacing: 0.5px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
  }
  .brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    min-width: 0;
  }
  .brand-name {
    color: var(--white);
    font-weight: 700;
    font-size: 1.05rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .brand-sub {
    color: var(--gold-400);
    font-size: 0.72rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
  .nav {
    display: flex;
    gap: 0.25rem;
  }
  .nav-link {
    color: var(--cream-100);
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
  }
  .nav-link.active {
    background: rgba(224, 180, 83, 0.18);
    color: var(--white);
  }
  main {
    flex: 1;
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: 1.5rem;
    box-sizing: border-box;
  }
  .footbar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    text-align: center;
    padding: 1.25rem 1.5rem;
    background: var(--navy-900);
    color: var(--cream-100);
    font-size: 0.82rem;
  }
  .foot-note {
    color: rgba(245, 239, 225, 0.6);
    font-size: 0.74rem;
  }
  @media (max-width: 560px) {
    .topbar {
      padding: 0.7rem 1rem;
    }
    .brand-name {
      font-size: 0.95rem;
    }
    main {
      padding: 1rem;
    }
  }
</style>
