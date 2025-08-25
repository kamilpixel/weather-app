import { createRouter, createWebHashHistory } from 'vue-router';

const HomeView = () => import('../views/HomeView.vue');
const DetailView = () => import('../views/DetailView.vue');
const ProfileView = () => import('../views/ProfileView.vue');
const NotFoundView = () => import('../views/NotFoundView.vue');

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView,
    },
    {
      path: '/detail',
      name: 'DetailView',
      component: DetailView,
    },
    {
      path: '/profile',
      name: 'ProfileView',
      component: ProfileView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
});

export default router;
