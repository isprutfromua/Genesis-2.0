import { createRouter, createWebHistory } from "vue-router";
import GenHome from "../views/GenHome.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: GenHome,
  },
  {
    path: "/course/:id",
    name: "course",
    props: true,
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/GenCourse.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
