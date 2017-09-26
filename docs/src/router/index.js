import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/pages/data-resolver-demo';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
  ],
});
