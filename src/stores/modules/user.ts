import type { UserInfo } from '@/types/user.types';

// initial state
const state = () => ({
  userInfo: {
    fullName: '',
    email: '',
    phone: '',
  } as UserInfo,
});

// getters
const getters = {};

// actions
const actions = {
  //
};

// mutations
const mutations = {
  SET_FULL_NAME(state: any, payload: { fullName: string }) {
    state.userInfo.fullName = payload.fullName;
  },

  SET_EMAIL(state: any, payload: { email: string }) {
    state.userInfo.email = payload.email;
  },

  SET_PHONE(state: any, payload: { phone: string }) {
    state.userInfo.phone = payload.phone;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
