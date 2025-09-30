<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1 class="title">IP → Country</h1>
        <p class="subtitle">
          Enter IP addresses to resolve their location and local time. You can add multiple rows.
        </p>
      </div>

      <div class="toolbar">
        <button class="button" @click="addRow">Add</button>
        <button class="button secondary" :disabled="rows.length === 0" @click="clearAll">
          Clear
        </button>
      </div>

      <div class="rows">
        <div v-for="row in rows" :key="row.id" class="row">
          <div class="label">{{ row.label }}</div>
          <input
            v-model="row.ip"
            class="input"
            :disabled="row.status === 'loading'"
            :placeholder="'e.g. 8.8.8.8'"
            @blur="onBlur(row)"
          />
          <div>
            <div v-if="row.status === 'loading'" class="status">
              <span class="spinner"></span> Looking up…
            </div>
            <div v-else-if="row.status === 'error'" class="status error">{{ row.error }}</div>
            <div v-else-if="row.status === 'done' && row.result" class="status">
              <span class="badge">
                <strong class="country">{{ row.result.country || 'Unknown' }}</strong>
                <span v-if="row.result.city">• {{ row.result.city }}</span>
              </span>
              <div v-if="row.result.timezone" class="small">
                Local time: {{ timeNow(row.result.timezone) }}
              </div>
            </div>
            <div v-else class="status small">Blur to search</div>
          </div>
        </div>
      </div>

      <div class="footer">
        Tip: Paste multiple IPs across rows and tab/blur to resolve each independently.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, reactive } from 'vue';

  import { lookupIp } from './api/ipLookup';
  import type { RowItem } from './types';
  import { formatTimeNowInTZ } from './utils/time';
  import { isValidIP } from './utils/validate';

  let counter = 1;

  const rows = reactive<RowItem[]>([]);

  function addRow() {
    rows.push({
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      label: `IP #${counter++}`,
      ip: '',
      status: 'idle',
    });
  }

  function clearAll() {
    rows.splice(0, rows.length);
    counter = 1;
  }

  async function onBlur(row: RowItem) {
    const value = row.ip.trim();
    if (!value) {
      row.status = 'idle';
      row.error = undefined;
      row.result = undefined;
      return;
    }

    if (!isValidIP(value)) {
      row.status = 'error';
      row.error = 'Invalid IPv4 address';
      row.result = undefined;
      return;
    }

    row.status = 'loading';
    row.error = undefined;

    try {
      const res = await lookupIp(value);
      if (res.error) {
        row.status = 'error';
        row.error = res.error;
        row.result = undefined;
        return;
      }
      row.result = res;
      row.status = 'done';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      row.status = 'error';
      row.error = e?.message || 'Unexpected error';
    }
  }

  // Global 1s ticker to update all visible clocks without per-row intervals
  let tickHandle: number | undefined;
  const now = reactive({ t: Date.now() });

  onMounted(() => {
    tickHandle = setInterval(() => {
      now.t = Date.now();
    }, 1000) as unknown as number;
  });

  onBeforeUnmount(() => {
    if (tickHandle) clearInterval(tickHandle);
  });

  function timeNow(tz?: string) {
    if (!tz) return '';
    void now.t; // depend on ticker reactive value
    return formatTimeNowInTZ(tz);
  }
</script>
