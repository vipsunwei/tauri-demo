import { getRawMenus } from "../api/login";
import store from "../store/index";
import { getStation } from "@/api/stations";
export const getMenus = async () => {
  const rawMenus = await getRawMenus();
  store.commit("SET_RAWMENUS", rawMenus);
};

export const getStations = async () => {
  const rawStations = await getStation();
  store.commit("SET_RAWSTATIONS", rawStations || []);
};
