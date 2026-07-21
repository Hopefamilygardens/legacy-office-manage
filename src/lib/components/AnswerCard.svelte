<script lang="ts">
  export let question: string = '';
  export let answer: string = '';
  export let ok: boolean = true;
</script>

<article class="answer-card" class:warn={!ok}>
  {#if question}
    <p class="q">You asked: {question}</p>
  {/if}
  <div class="a">{answer}</div>
</article>

<style>
  .answer-card {
    background: #0b1220;
    border: 1px solid #1f2937;
    border-left: 4px solid #2563eb;
    border-radius: 10px;
    padding: 1rem 1.2rem;
    white-space: pre-wrap;
  }
  .answer-card.warn {
    border-left-color: #f59e0b;
  }
  .q {
    color: #93c5fd;
    font-size: 0.85rem;
    margin: 0 0 0.5rem;
  }
  .a {
    line-height: 1.5;
  }
</style>
