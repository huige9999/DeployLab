<script setup lang="ts">
import { ref, onMounted } from 'vue';

type Health = {
  status?: string;
  db?: string;
  redis?: string;
  version?: string;
};

type Task = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};


const API = (p: string, opt?: RequestInit) => fetch('/api' + p, opt).then(r =>
  r.status === 204 ? null : r.json()
);

// ---- 任务列表 ----
const tasks = ref<Task[]>([]);
const loading = ref(false);
async function loadTasks() {
  loading.value = true;
  tasks.value = await API('/tasks');
  loading.value = false;
}

// ---- 新增 ----
const newTitle = ref('');
async function addTask() {
  if (!newTitle.value.trim()) return;
  await API('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle.value }),
  });
  newTitle.value = '';
  await loadTasks();
}

// ---- 改状态 / 删除 ----
async function setStatus(id: string, status: string) {
  await API(`/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  await loadTasks();
}
async function removeTask(id: string) {
  await API(`/tasks/${id}`, { method: 'DELETE' });
  await loadTasks();
}

// ---- 系统状态 ----
const tab = ref('list');
const health = ref<Health | null>(null);
async function loadHealth() {
  try {
    health.value = await API('/health');
  } catch {
    health.value = { status: 'error' };
  }
}

onMounted(() => {
  loadTasks();
  loadHealth();
});
</script>

<template>
  <div class="wrap">
    <h1>DeployLab 学习任务板</h1>

    <nav>
      <button :class="{ on: tab === 'list' }" @click="tab = 'list'">任务列表</button>
      <button :class="{ on: tab === 'new' }" @click="tab = 'new'">新增任务</button>
      <button :class="{ on: tab === 'status' }" @click="tab = 'status'; loadHealth()">
        系统状态
      </button>
    </nav>

    <!-- 任务列表 -->
    <section v-if="tab === 'list'">
      <p v-if="loading">加载中…</p>
      <table v-else>
        <thead>
          <tr><th>标题</th><th>状态</th><th>创建时间</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="t in tasks" :key="t.id">
            <td>{{ t.title }}</td>
            <td>{{ t.status }}</td>
            <td>{{ t.created_at }}</td>
            <td>
              <button @click="setStatus(t.id, 'doing')">进行中</button>
              <button @click="setStatus(t.id, 'done')">已完成</button>
              <button @click="removeTask(t.id)">删除</button>
            </td>
          </tr>
          <tr v-if="!tasks.length"><td colspan="4">还没有任务</td></tr>
        </tbody>
      </table>
    </section>

    <!-- 新增任务 -->
    <section v-if="tab === 'new'">
      <input v-model="newTitle" placeholder="任务标题" @keyup.enter="addTask" />
      <button @click="addTask">新增任务</button>
    </section>

    <!-- 系统状态 -->
    <section v-if="tab === 'status'">
      <ul>
        <li>后端状态:{{ health?.status ?? '...' }}</li>
        <li>MySQL 状态:{{ health?.db ?? '...' }}</li>
        <li>Redis 状态:{{ health?.redis ?? '...' }}(第 4 阶段接入)</li>
        <li>当前部署版本:{{ health?.version ?? '...' }}</li>
      </ul>
    </section>
  </div>
</template>
<style>
body { font-family: system-ui, sans-serif; background: #f5f5f5; }
.wrap { max-width: 760px; margin: 24px auto; background: #fff; padding: 24px; }
nav button { margin-right: 8px; }
nav button.on { font-weight: bold; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
</style>