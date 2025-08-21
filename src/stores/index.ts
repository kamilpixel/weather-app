import { createStore } from 'vuex';
import weather from './modules/weather';
import user from './modules/user';

export default createStore({
  modules: {
    user,
    weather,
  },
});
