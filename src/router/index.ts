import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MailView from "../views/MailView.vue";
import FlyView from "../views/FlyView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/mail",
      name: "mail",
      component: MailView,
    },
    {
      path: "/fly",
      name: "fly",
      component: FlyView,
    },
    {
      path: "/fly/:info",
      name: "flyWithInfo",
      component: FlyView,
    },
  ],
});

export default router;
