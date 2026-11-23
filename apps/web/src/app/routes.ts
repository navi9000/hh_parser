import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router"
import { HomePage } from "@/pages/home-page"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: {},
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export { router }
