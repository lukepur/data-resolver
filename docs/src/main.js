import Vue from 'vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-default/index.css';

import App from './App';
import router from './router';
import store from './store';

Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

store.dispatch('init');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
