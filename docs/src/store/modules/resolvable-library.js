import { findIndex } from 'lodash';
import { RESOLVABLE_LIBRARY_SAVE, RESOLVABLE_LIBRARY_INIT } from '../mutation-types';

const state = {
  items: []
};

const getters = {
  resolvableLibrary: s => s.items
};

const actions = {
  saveResolvable ({ commit }, payload) {
    commit(RESOLVABLE_LIBRARY_SAVE, payload);
  }
};

const mutations = {
  [RESOLVABLE_LIBRARY_SAVE] (s, payload) {
    const { id, resolvable } = payload;
    const index = findIndex(s.items, { id });
    if (index > -1) {
      s.items.splice(index, 1);
    }
    s.items.push({ id, resolvable });
  },

  [RESOLVABLE_LIBRARY_INIT] (s, payload) {
    s.items = [...payload];
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
