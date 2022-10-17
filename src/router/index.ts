import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MailView from "../views/MailView.vue";
import FlyView from "../views/FlyView.vue";
import SplitView from "../views/SplitView.vue";
import CostView from "../views/CostView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/mail", name: "mail", component: MailView },
    { path: "/fly", name: "fly", component: FlyView },
    { path: "/fly/:info", name: "flyWithInfo", component: FlyView },
    { path: "/split", name: "split", component: SplitView },
    { path: "/cost", name: "cost", component: CostView },
    { path: "/cost/:info", name: "costWithInfo", component: CostView },
  ],
  
});

export default router;
