import type { GeoLocation } from '@/types/location.types';

// initial state
const state = () => ({
  cities: [] as GeoLocation[],
});

// getters
const getters = {};

// actions
const actions = {
  //
};

// mutations
const mutations = {
  SET_CITY(state: any, cityObj: GeoLocation) {
    const isExists = state.cities.some((c: GeoLocation) => c.id === cityObj.id);
    if (!isExists) {
      state.cities.push(cityObj);
    }
  },
  REMOVE_CITY(state: any, cityId: string) {
    state.cities = state.cities.filter((c: GeoLocation) => c.id !== cityId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
