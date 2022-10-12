<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { ElConfigProvider } from "element-plus";

const zIndex = 3000;
const size: "" | "default" | "small" | "large" = "small";

const routers = [
  { src: "/", title: "主页" },
  { src: "/mail", title: "邮件" },
  { src: "/fly", title: "空降" },
  { src: "/split", title: "分配" },
];
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <nav>
          <RouterLink v-for="route of routers" :key="route.src" :to="route.src">
            {{ route.title }}
          </RouterLink>
        </nav>
      </el-header>
      <el-main>
        <el-config-provider :size="size" :z-index="zIndex">
          <RouterView />
        </el-config-provider>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  max-width: 1280px;
  min-height: 100vh;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
