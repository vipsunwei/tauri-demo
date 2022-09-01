import { createStore, createLogger } from "vuex";
import * as actions from "./actions";
import * as mutations from "./mutations";
import * as getters from "./getters";

const getLocalUser = () => {
  const user = {};
  try {
    const r = sessionStorage.getItem("TP-USER");
    if (r && typeof r === "string") {
      Object.assign(user, JSON.parse(r));
    }
  } catch (error) {}
  return user;
};
const getInitState = () => {
  return {
    user: {},
    rawMenus: [],
    routerFlag: false,
    curMenuName: "",
    curSubMenuName: "",
    rawStations: [],
    trajectoryData: [],
    energyData: [],
    stationSwitch: true,
  };
};
const store = createStore({
  actions,
  mutations: {
    ...mutations,
    RESET_ALL_STATE(state, payload) {
      const initState = getInitState();
      Object.keys(state).forEach((item) => {
        if (item !== "") {
          state[item] = initState[item];
        }
      });
    },
  },
  state() {
    const initState = getInitState();
    initState.user = getLocalUser();
    return initState;
  },
  getters,
  plugins: import.meta.env.PROD ? [] : [createLogger()],
});

export default store;
