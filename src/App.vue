<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { ElConfigProvider } from "element-plus";

const zIndex = 3000;
const size: "" | "default" | "small" | "large" = "small";

const routers = [
  { src: "/", title: "主页" },
  { src: "/mail", title: "邮件" },
];
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <nav>
          <RouterLink to="/">主页</RouterLink>
          <RouterLink to="/mail">邮件</RouterLink>
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
  width: 100vw;
  max-width: 1024px;
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

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
