import Vuex from 'vuex';
import Vue from 'vue';
import Store from 'store';

import resolvableLibrary from './modules/resolvable-library';
import { RESOLVABLE_LIBRARY_INIT } from './mutation-types';

const RESOLVABLE_LIBRARY_STORAGE_KEY = 'DATA_RESOLVER_LIBRARY';

Vue.use(Vuex);

const actions = {
  init({ commit }) {
    // load resolvableLibrary from local storage
    const library = Store.get(RESOLVABLE_LIBRARY_STORAGE_KEY) || [];
    commit(RESOLVABLE_LIBRARY_INIT, library);
  }
};

export default new Vuex.Store({
  modules: {
    resolvableLibrary
  },
  actions
});
