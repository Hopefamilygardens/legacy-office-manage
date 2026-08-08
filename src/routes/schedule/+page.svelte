<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchSchedule } from '$lib/api';
  import type { ScheduleResponse } from '$lib/types';

  let schedule: ScheduleResponse | null = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      schedule = await fetchSchedule();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to load schedule.';
    } finally {
      loading = false;
    }
  });

  function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).format(new Date(value));
  }

  function calendarLabel(calendar: string) {
    return calendar.charAt(0).toUpperCase() + calendar.slice(1);
  }
</script>

<svelte:head>
  <title>Schedule — Legacy Office Manager</title>
</svelte:head>

<section class="schedule-page">
  <header class="page-header">
    <div>
      <p class="eyebrow">Legacy Office Manager</p>
      <h1>Schedule</h1>
      <p class="subtitle">Your live calendar at a glance.</p>
    </div>
  </header>

  {#if loading}
    <div class="state-card">
      <p>Loading schedule…</p>
    </div>
  {:else if error}
    <div class="state-card error">
      <h2>Schedule unavailable</h2>
      <p>{error}</p>
    </div>
  {:else if schedule}
    <div class="summary-grid">
      <div class="summary-card">
        <span class="summary-label">Today</span>
        <strong>{schedule.todays_schedule.count}</strong>
        <span>{schedule.todays_schedule.count === 1 ? 'event' : 'events'}</span>
      </div>

      <div class="summary-card">
        <span class="summary-label">Upcoming</span>
        <strong>{schedule.upcoming_schedule.count}</strong>
        <span>next 60 days</span>
      </div>
    </div>

    <section class="schedule-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Today</p>
          <h2>Today's Schedule</h2>
        </div>
        <span class="count-badge">{schedule.todays_schedule.count}</span>
      </div>

      {#if schedule.todays_schedule.items.length === 0}
        <div class="empty-card">
          <p>No events scheduled for today.</p>
        </div>
      {:else}
        <div class="event-list">
          {#each schedule.todays_schedule.items as event}
            <article class="event-card">
              <div class="time-column">
                <strong>{event.start_time_label}</strong>
              </div>

              <div class="event-content">
                <h3>{event.title}</h3>
                <p>{formatDate(event.start)}</p>

                {#if event.location}
                  <p class="detail">📍 {event.location}</p>
                {/if}

                <span class="calendar-tag">{calendarLabel(event.calendar)}</span>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </section>

    <section class="schedule-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Ahead</p>
          <h2>Upcoming Schedule</h2>
        </div>
        <span class="count-badge">{schedule.upcoming_schedule.count}</span>
      </div>

      {#if schedule.upcoming_schedule.items.length === 0}
        <div class="empty-card">
          <p>No upcoming events found.</p>
        </div>
      {:else}
        <div class="event-list">
          {#each schedule.upcoming_schedule.items as event}
            <article class="event-card">
              <div class="time-column">
                <strong>{event.start_time_label}</strong>
              </div>

              <div class="event-content">
                <h3>{event.title}</h3>
                <p>{formatDate(event.start)}</p>

                {#if event.location}
                  <p class="detail">📍 {event.location}</p>
                {/if}

                <span class="calendar-tag">{calendarLabel(event.calendar)}</span>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</section>

<style>
  .schedule-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.5rem;
  }

  .page-header {
    margin-bottom: 1.5rem;
  }

  .eyebrow {
    margin: 0 0 0.35rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.6;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 3rem);
  }

  .subtitle {
    margin-top: 0.5rem;
    opacity: 0.7;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .summary-card,
  .state-card,
  .empty-card,
  .event-card {
    border: 1px solid rgba(128, 128, 128, 0.25);
    border-radius: 14px;
    background: rgba(128, 128, 128, 0.06);
  }

  .summary-card {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .summary-card strong {
    font-size: 2rem;
  }

  .summary-label {
    font-size: 0.8rem;
    font-weight: 700;
    opacity: 0.65;
  }

  .schedule-section {
    margin-top: 2rem;
  }

  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.8rem;
  }

  .section-heading h2 {
    margin: 0;
  }

  .count-badge {
    min-width: 2rem;
    padding: 0.35rem 0.6rem;
    text-align: center;
    border-radius: 999px;
    background: rgba(128, 128, 128, 0.15);
    font-weight: 700;
  }

  .event-list {
    display: grid;
    gap: 0.75rem;
  }

  .event-card {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .time-column {
    border-right: 1px solid rgba(128, 128, 128, 0.2);
    padding-right: 1rem;
  }

  .event-content h3 {
    margin: 0 0 0.3rem;
  }

  .event-content p {
    margin: 0.2rem 0;
    opacity: 0.72;
  }

  .detail {
    margin-top: 0.5rem !important;
  }

  .calendar-tag {
    display: inline-block;
    margin-top: 0.65rem;
    padding: 0.25rem 0.55rem;
    border-radius: 999px;
    background: rgba(128, 128, 128, 0.15);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .state-card,
  .empty-card {
    padding: 1.25rem;
  }

  .error {
    border-color: rgba(220, 80, 80, 0.4);
  }

  @media (max-width: 640px) {
    .schedule-page {
      padding: 1rem;
    }

    .summary-grid {
      grid-template-columns: 1fr 1fr;
    }

    .event-card {
      grid-template-columns: 1fr;
    }

    .time-column {
      border-right: 0;
      border-bottom: 1px solid rgba(128, 128, 128, 0.2);
      padding: 0 0 0.6rem;
    }
  }
</style>
