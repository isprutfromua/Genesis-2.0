import { createRouter, createWebHistory } from "vue-router";
import GenHome from "../views/GenHome.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: GenHome,
    meta: {
      title: "Courses Laboratory",
    },
  },
  {
    path: "/course/:id",
    name: "course",
    props: true,
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/GenCourse.vue"),
    meta: {
      title: "Course page | Courses Laboratory",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const title = to.meta.title as string;

  if (title) {
    document.title = title;
  }

  next();
});

export default router;
