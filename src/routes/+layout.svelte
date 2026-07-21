<script lang="ts">
  import '../app.css';
</script>

<div class="app-shell">
  <header class="topbar">
    <div class="brand">Legacy Office Manager</div>
    <nav class="nav">
      <a href="/">Command Center</a>
    </nav>
  </header>
  <main>
    <slot />
  </main>
  <footer class="footbar">
    <span>Presentation layer - business logic runs in n8n</span>
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
    padding: 1rem 1.5rem;
    background: #0b1220;
    border-bottom: 1px solid #1f2937;
  }
  .brand {
    font-weight: 700;
    font-size: 1.1rem;
  }
  .nav a {
    color: #93c5fd;
    text-decoration: none;
    margin-left: 1rem;
  }
  main {
    flex: 1;
    width: 100%;
    max-width: 1040px;
    margin: 0 auto;
    padding: 1.5rem;
    box-sizing: border-box;
  }
  .footbar {
    padding: 1rem 1.5rem;
    color: #6b7280;
    font-size: 0.8rem;
    border-top: 1px solid #1f2937;
    text-align: center;
  }
</style>
