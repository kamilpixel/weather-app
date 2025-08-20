import { createRouter, createWebHashHistory } from 'vue-router';

const HomeView = () => import('@/views/HomeView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
});

export default router;
