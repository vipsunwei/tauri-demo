export const SET_USER = (state, user) => {
  state.user = user;
  try {
    sessionStorage.setItem("TP-USER", JSON.stringify(user));
  } catch (error) {
    console.trace(error);
  }
};

export const SET_ROUTEFLAG = (state, flag) => {
  state.routerFlag = flag;
};

export const SET_RAWMENUS = (state, rawMenus) => {
  state.rawMenus = rawMenus;
};

export const SET_CUR_MENU = (state, { curMenuName = "", curSubMenuName = "" }) => {
  state.curMenuName = curMenuName;
  state.curSubMenuName = curSubMenuName;
};

export const SET_RAWSTATIONS = (state, rawStations) => {
  state.rawStations = rawStations;
};

export const SET_trajectoryData = (state, trajectoryData) => {
  state.trajectoryData = trajectoryData;
};

export const SET_Energy = (state, energyData) => {
  state.energyData = energyData;
};

export const SET_stationSwitch = (state, stationSwitch) => {
  state.stationSwitch = stationSwitch;
};
