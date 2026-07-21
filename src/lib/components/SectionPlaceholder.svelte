<script lang="ts">
  export let title: string;
  export let blurb: string = '';
</script>

<div class="section-wrap">
  <div class="viewhead">
    <a class="backlink" href="/">&larr; Back to Command Center</a>
    <h2 class="vtitle serif">{title}</h2>
  </div>
  <div class="coming">
    <div class="ic" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
    </div>
    <h3>{title} is coming online</h3>
    <p>{blurb || `Your ${title} section is being connected to the Legacy Office Manager backend. It will appear here shortly — nothing is broken, and your data is safe.`}</p>
    <a class="cta" href="/">Return to Command Center</a>
  </div>
</div>

<style>
  .section-wrap{padding:24px 52px 40px;}
  .viewhead{max-width:940px;}
  .backlink{color:var(--muted);font-size:13px;display:inline-flex;align-items:center;gap:6px;}
  .backlink:hover{color:var(--navy);}
  .vtitle{font-size:30px;color:var(--navy);margin-top:8px;font-weight:700;}
  .coming{max-width:940px;margin-top:20px;background:#fff;border:1px solid var(--line);border-top:4px solid var(--gold);border-radius:16px;padding:40px 32px;text-align:center;box-shadow:var(--shadow-sm);}
  .ic{width:56px;height:56px;margin:0 auto 14px;border-radius:50%;background:var(--navy);color:var(--gold-soft);display:flex;align-items:center;justify-content:center;}
  .coming h3{font-size:20px;color:var(--navy);margin-bottom:8px;}
  .coming p{color:var(--muted);font-size:15px;line-height:1.6;max-width:520px;margin:0 auto 18px;}
  .cta{display:inline-block;background:var(--navy);color:#fff;font-weight:600;font-size:14px;padding:10px 22px;border-radius:999px;}
  .cta:hover{background:var(--navy-deep);}
  @media (max-width:860px){.section-wrap{padding:16px 16px 30px;}.coming{max-width:100%;padding:28px 18px;}}
</style>
