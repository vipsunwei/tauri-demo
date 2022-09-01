<template>
  <div id="mapbox">
    <div id="maps"></div>
    <map3d
      v-if="mapType === '3d'"
      :isSelect="isSelect"
      :isDraw="isDraw"
      @lnglat="lnglat"
      :isDel="isDel"
      :showPlane="showStereoscopic"
    ></map3d>
    <div class="settingPopup">
      <div class="settingPopup-row">
        <div>设置中心点经度：</div>
        <div><el-input v-model="centerLng" placeholder="请输入中心点经度"></el-input></div>
      </div>
      <div class="settingPopup-row">
        <div>设置中心点纬度：</div>
        <div><el-input v-model="centerLat" placeholder="请输入中心点纬度"></el-input></div>
      </div>
      <el-button class="settingPopup-button" @click="settingBtn">确定</el-button>
      <el-button class="settingPopup-button" :class="{ isSelect: isSelect }" @click="selectBtn"
        >选择中心点</el-button
      >
      <el-button class="settingPopup-button" :class="{ isSelect: isDraw }" @click="drawBtn"
        >绘制多边形</el-button
      >
      <el-button class="settingPopup-button" @click="delBtn">删</el-button>
    </div>

    <!-- <div class="hint">
      <div v-if="isSelect">双击左键结束绘制</div>
      <div v-if="isDraw">点击右键结束绘制</div>
    </div> -->
    <div class="asideMenu">
      <div @click="IsShowStation()" :class="{ IsShowStation: showStation }">
        <img src="../assets/station.png" alt="" />
        站点
      </div>
      <div @click="IsShowPlane()" :class="{ IsShowPlane: showPlane }">
        <img src="../assets/2d.png" alt="" />
        2D能量数据
      </div>
      <div @click="IsShowStereoscopic()" :class="{ IsShowStereoscopic: showStereoscopic }">
        <img src="../assets/3d.png" alt="" />
        3D能量数据
      </div>
    </div>
    <div class="lenged">
      <div class="txt-lenged">
        <div><img src="../assets/discharge.png" alt="" />站点</div>
        <div><img src="../assets/sonde.png" alt="" />探空仪</div>
      </div>
      <div v-for="item in lenged" :key="item">{{ item }}</div>
    </div>
    <section class="popup">
      <div class="animate__animated animate__backInRight data-handling-statistics">
        <div class="title">数据处理量统计</div>
        <div class="row">
          <span class="col1"> 格点数据 </span>
          <span class="col2">
            <span class="num">{{ homeCountState.gribNum }}</span>
            <span>个</span>
          </span>
        </div>
        <div class="row">
          <span class="col1"> 轨迹预测 </span>
          <span class="col2">
            <span class="num">{{ homeCountState.preNum }}</span>
            <span>个</span>
          </span>
        </div>
        <div class="row">
          <span class="col1"> 接收数据 </span>
          <span class="col2">
            <span class="num">{{ homeCountState.recNum }}</span>
            <span>个</span>
          </span>
        </div>
        <div class="row">
          <span class="col1"> 作业单数量 </span>
          <span class="col2">
            <span class="num">{{ homeCountState.taskNum }}</span>
            <span>个</span>
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, computed } from "vue";
import map3d from "./3dmap.vue";
import { ElNotification } from "element-plus";
import { useStore } from "vuex";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import * as mapApi from "../api/map.js";
import * as d3 from "d3";
import useHomeCount from "../hooks/useHomeCount";
import sondeImg from "../assets/sonde.png";
import sondeActiveImg from "../assets/sondeActive.png";
import dischargeImg from "../assets/discharge.png";
import mapStyle from "../mapJson/style.json";
import chinaJson from "../mapJson/china.json";
const store = useStore();

const showStation = ref(true);
const showPlane = ref(false);
const showStereoscopic = ref(false);
const mapType = ref("2d");

const centerLng = ref(""),
  centerLat = ref("");
const lenged = ref([]);
let startDate = mapApi.processingDate();
let trajectoryData = [],
  energyData = [],
  energyData_Max = 1;
let map = {};
let stationInfo = [];
let dataState = "2d";
let isSelect = ref(false);
let isDraw = ref(false);
const station = computed(() => store.state.rawStations);
let area,
  drawLatlngs = [];
let hint2d = true,
  hint3d = true;
let isDel = ref(false);

const { homeCountState } = useHomeCount();
function settingBtn() {
  // if (
  //   centerLng.value > 69.15461 ||
  //   centerLng.value < 2.2132 ||
  //   centerLat.value > 142.31824 ||
  //   centerLat.value < 54.35808
  // ) {
  //   return;
  // }
  clearPlaneData();
  // clearStereoscopicData();
  getData(dataState, true);
}
function selectBtn() {
  isSelect.value = !isSelect.value;
  // store.commit("SET_IsSelect", isSelect.value);
  if (isSelect.value) {
    isDraw.value = false;
  }
  if (isSelect.value && dataState === "2d") {
    map.getCanvas().style.cursor = "crosshair";
  } else if (!isSelect.value && dataState === "2d") {
    map.getCanvas().style.cursor = "auto";
  }
}
function drawBtn() {
  isDraw.value = !isDraw.value;
  if (isDraw.value) {
    isSelect.value = false;
  }
  if (isDraw.value && dataState === "2d") {
    map.getCanvas().style.cursor = "crosshair";
    if (drawLatlngs.length > 0) {
      map.getSource("draw").setData({
        type: "FeatureCollection",
        features: [],
      });
      area.set({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            id: "draw",
            geometry: { type: "Polygon", coordinates: [] },
          },
        ],
      });
    }
    if (hint2d) {
      hint2d = false;
      ElNotification({
        title: "提示",
        message: "双击左键结束绘制",
        position: "top-left",
        type: "warning",
      });
    }

    area.changeMode("draw_polygon");
  } else if (!isDraw.value && dataState === "2d") {
    map.getCanvas().style.cursor = "auto";
    area.changeMode("simple_select");
    // cancelDrawArea();
  } else if (isDraw.value && dataState === "3d" && hint3d) {
    hint3d = false;
    ElNotification({
      title: "提示",
      message: "点击右键结束绘制",
      position: "top-left",
      type: "warning",
    });
  }
}
function delBtn() {
  isDel.value = !isDel.value;
  if (dataState === "2d") {
    map.getCanvas().style.cursor = "auto";
    if (drawLatlngs.length > 0) {
      map.getSource("draw").setData({
        type: "FeatureCollection",
        features: [],
      });
      area.set({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            id: "draw",
            geometry: { type: "Polygon", coordinates: [] },
          },
        ],
      });
      drawLatlngs = [];
    }
    area.changeMode("simple_select");

    map.getSource("draw").setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [],
          },
        },
      ],
    });
  }

  isSelect.value = false;
  isDraw.value = false;
  centerLng.value = "";
  centerLat.value = "";
}
function updateDraw(e) {
  // console.log(e);
  map.getCanvas().style.cursor = "auto";
  if (e.features) {
    drawLatlngs = e.features[0].geometry.coordinates;
    isDraw.value = false;
    let polygon = turf.polygon(e.features[0].geometry.coordinates);
    let center = turf.centerOfMass(polygon);
    map.getSource("draw").setData({
      type: "FeatureCollection",
      features: [center],
    });
    centerLng.value = center.geometry.coordinates[0];
    centerLat.value = center.geometry.coordinates[1];
  }
  // if (e.type === "draw.create") {
  //   //
  //   // isAddSensitiveArea.value = true;
  // } else if (e.type === "draw.update") {
  //   // updateDrawLine(drawLatlngs.value);
  // }
}
function addEvent() {
  map.on("click", (e) => {
    // console.log(e);
    if (isSelect.value && dataState === "2d") {
      centerLng.value = e.lngLat.lng;
      centerLat.value = e.lngLat.lat;
      map.getCanvas().style.cursor = "auto";
      isSelect.value = false;
      map.getSource("draw").setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            },
          },
        ],
      });
    }
  });

  // 探空仪（熔断器）弹窗
  let sondePopup = new mapboxgl.Popup({
    closeOnClick: false,
    closeButton: false,
    offset: 20,
    maxWidth: "260px",
    className: "sonde",
  });
  map.on("mouseenter", "sonde", function (e) {
    map.getCanvas().style.cursor = "pointer";
    let coordinates = e.features[0].geometry.coordinates.slice();
    let properties = e.features[0].properties;
    let description = `<div>
        <div>落点距离差：${properties.Drop_distance_difference} m</div>
        <div>落点经度：${properties.Drop_point_lng} °</div>
        <div>落点纬度：${properties.Drop_point_lat} °</div>
        <div>落点高度：${properties.Drop_point_alt} m</div>
        <div>平漂高度：${properties.hor_heigh} m</div>
      </div>`;

    sondePopup.setLngLat(coordinates).setHTML(description).addTo(map);
  });
  map.on("mouseleave", "sonde", function () {
    map.getCanvas().style.cursor = "auto";
    sondePopup.remove();
  });
}
function lnglat(n) {
  centerLng.value = n.lng;
  centerLat.value = n.lat;
  isSelect.value = false;
  isDraw.value = false;
}
// 初始化地图
function init() {
  mapboxgl.accessToken = mapApi.mapboxToken;
  mapStyle.glyphs = import.meta.env.VITE_BASE_baseMAPURL + "/map/fonts/{fontstack}/{range}.pbf";
  map = new mapboxgl.Map({
    container: "maps",
    style: mapStyle,
    // // baise
    // style: "mapbox://styles/13141100175/ckeeahfry0pse19rrnj30b3ms",
    // 空白
    // style: "mapbox://styles/13141100175/ckxa8posu0yl515t9rp7u8ry6",
    center: [110, 36],
    zoom: 4,
    maxBounds: [
      [69.15461, 2.2132],
      [142.31824, 54.35808],
    ], //赋值最大界限为你之前赋值的界限
    dragRotate: false,
    renderWorldCopies: false,
  });
}
function initChinaMap() {
  map.addLayer({
    id: "route",
    type: "line",
    source: {
      type: "geojson",
      data: chinaJson,
    },
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#C7DC9D",
      "line-width": 0.5,
    },
  });
}
// 初始化天地图
function initTDT() {
  const token = "a714c85d6f6b4c1813ba1de9833bc6ce";
  // 矢量注记
  // const cvaUrl = "//t0.tianditu.gov.cn/cva_w/wmts?tk=" + token;
  // 全球境界
  const iboUrl = "//t0.tianditu.gov.cn/ibo_w/wmts?tk=" + token;
  // const tdtCva = {
  //   type: "raster",
  //   tiles: [
  //     cvaUrl +
  //       "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
  //   ],
  //   tileSize: 256,
  // };
  const tdtIbo = {
    type: "raster",
    tiles: [
      iboUrl +
        "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ibo&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
    ],
    tileSize: 256,
  };
  // this.map.addLayer({
  //   id: "tdtCva",
  //   type: "raster",
  //   source: {
  //     type: "raster",
  //     version: "1.1.1",
  //     tiles: tdtCva.tiles,
  //     tileSize: 256,
  //   },
  //   paint: {},
  // });
  map.addLayer({
    id: "tdtIbo",
    type: "raster",
    source: {
      type: "raster",
      version: "1.1.1",
      tiles: tdtIbo.tiles,
      tileSize: 256,
    },
    paint: {},
  });
}
// 初始化行政区划
// function initDistrict() {
//   axios.get(`/china.json`).then((res) => {
//     // console.log(res.data);
//     const data = res.data;
//     // 省边界
//     map.addLayer({
//       id: "district",
//       type: "fill",
//       source: {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: data.features,
//         },
//       },
//       paint: {
//         "fill-color": "#0c115f",
//         "fill-outline-color": "#fff",
//       },
//     });

//     // 省边界线
//     map.addLayer({
//       id: "district-line",
//       type: "line",
//       source: {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: data.features,
//         },
//       },
//       paint: {
//         "line-color": "#fff",
//       },
//     });

//     let districtText = [];
//     data.features.forEach((el) => {
//       if (el.properties.name != "" && el.properties.centroid?.length > 0) {
//         districtText.push({
//           geometry: {
//             type: "Point",
//             coordinates: el.properties.centroid,
//           },
//           properties: {
//             name: el.properties.name,
//             adcode: el.properties.adcode,
//           },
//         });
//       }
//     });

//     // 省中心文字标注
//     map.addLayer({
//       id: "district-text",
//       type: "symbol",
//       source: {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: districtText,
//         },
//       },
//       layout: {
//         "text-allow-overlap": true,
//         "text-field": "{name}",
//         "text-anchor": "top",
//         "text-size": ["interpolate", ["linear"], ["zoom"], 3, 0, 4, 12, 6, 16],
//       },
//       paint: {
//         "text-color": "#ffffff",
//         "text-halo-color": "rgba(0, 0, 0, 0.6)",
//         "text-halo-width": 1,
//       },
//     });

//     if (map.getLayer("station")) {
//       map.moveLayer("district", "district-text");
//       map.moveLayer("district", "station");
//     }
//   });
// }
// 初始化图片
function initImage() {
  // 站点正常状态
  map.loadImage(dischargeImg, function (error, image) {
    if (error) throw error;
    map.addImage("discharge", image);
  });
  // 探空仪
  map.loadImage(sondeImg, function (error, image) {
    if (error) throw error;
    map.addImage("Sonde", image);
  });
  map.loadImage(sondeActiveImg, function (error, image) {
    if (error) throw error;
    map.addImage("SondeActive", image);
  });
}
// 初始化绘制中心点
function initDraw() {
  area = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },
    // defaultMode: "draw_polygon",
  });
  map.addControl(area);
  drawLatlngs = [];
  map.on("draw.create", updateDraw);
  map.on("draw.update", updateDraw);

  map.addLayer({
    id: "draw",
    type: "circle",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    },
    paint: {
      "circle-radius": 6,
      "circle-color": "rgba(55,148,179,1)",
    },
  });
}
// 站点显示及信息
function drawStation() {
  stationInfo = [];
  station.value.forEach((el) => {
    // if (el.STATION_TYPE === "1") {
    if (el.STATION_TYPE !== "2") {
      stationInfo.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [el.LNG, el.LAT],
        },
        properties: {
          stationImage: "discharge",
          name: el.STATION_NAME,
          number: el.STATION_NUMBER,
          type: "discharge",
          typeNumber: el.STATION_TYPE,
          lng: el.LNG,
          lat: el.LAT,
          MEASalt: el.MEAS_ALTITUDE,
          RADARalt: el.RADAR_ALTITUDE,
          TKalt: el.TK_ALTITUDE,
        },
      });
    }
    //  else if (el.STATION_TYPE === "2") {
    //   stationInfo.push({
    //     type: "Feature",
    //     geometry: {
    //       type: "Point",
    //       coordinates: [el.LNG, el.LAT],
    //     },
    //     properties: {
    //       stationImage: "receive_close",
    //       name: el.STATION_NAME,
    //       number: el.STATION_NUMBER,
    //       type: "receive",
    //       typeNumber: el.STATION_TYPE,
    //       lng: el.LNG,
    //       lat: el.LAT,
    //       alt: el.MEAS_ALTITUDE,
    //       MEASalt: el.MEAS_ALTITUDE,
    //       RADARalt: el.RADAR_ALTITUDE,
    //       TKalt: el.TK_ALTITUDE,
    //     },
    //   });
    // } else if (el.STATION_TYPE === "4") {
    //   stationInfo.push({
    //     type: "Feature",
    //     geometry: {
    //       type: "Point",
    //       coordinates: [el.LNG, el.LAT],
    //     },
    //     properties: {
    //       stationImage: "o3_close",
    //       name: el.STATION_NAME,
    //       number: el.STATION_NUMBER,
    //       type: "o3",
    //       typeNumber: el.STATION_TYPE,
    //       lng: el.LNG,
    //       lat: el.LAT,
    //       alt: el.MEAS_ALTITUDE,
    //       MEASalt: el.MEAS_ALTITUDE,
    //       RADARalt: el.RADAR_ALTITUDE,
    //       TKalt: el.TK_ALTITUDE,
    //     },
    //   });
    // }
  });

  map.addLayer({
    id: "station",
    type: "symbol",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: stationInfo,
      },
    },
    layout: {
      "icon-image": ["get", "stationImage"],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 0, 0, 8, 0.3],
      // "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      "icon-padding": 0,
      "text-field": "{name}",
      "text-anchor": "top",
      // "text-offset": [0, -2],
      "text-offset": [
        "case",
        ["==", ["get", "number"], "23456"],
        ["literal", [0, -3.5]],
        ["literal", [0, -2.5]],
      ],
      "text-size": ["interpolate", ["linear"], ["zoom"], 3, 0, 7, 24],
    },
    paint: {
      "text-color": "#ffffff",
    },
  });
  // if (map.getLayer("district")) {
  //   map.moveLayer("district", "station");
  //   map.moveLayer("district", "district-text");
  // }
}
// 初始化探空仪曲线图层
function initSonde() {
  map.addLayer({
    id: "sonde",
    type: "symbol",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    },
    layout: {
      "icon-image": ["get", "image"],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 0, 0, 8, 0.3],
      "icon-offset": [6, -90],
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
    },
  });

  map.addLayer({
    id: "sonde-line",
    type: "line",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    },
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      // "line-color": "#3eede7",
      "line-color": ["get", "lineColor"],
      "line-width": 2,
    },
  });
  map.moveLayer("station", "sonde");
}
// 数据处理
// 世界时0，12点更新数据
function processingData(type) {
  const nowDate = mapApi.processingDate();
  dataState = type;
  mapType.value = type;
  if (
    startDate.hour == nowDate.hour &&
    startDate.day == nowDate.day &&
    trajectoryData.length !== 0 &&
    energyData.length !== 0
  ) {
    if (type === "2d") {
      addPlaneEnergy();
      addPlaneTrajectory();
      // } else if (type === "3d") {
      //   addStereoscopicTrajectory();
      //   addStereoscopicEnergy();
    }
    return;
  }
  getData(type);
}
// 轨迹可视化数据
function getTrajectory(type) {
  let dataObj = { date: "202107191215" };
  if (centerLng.value !== "") {
    dataObj.lon = centerLng.value;
    dataObj.lat = centerLat.value;
  }
  mapApi.getTrajectory(dataObj).then((trajectoryRes) => {
    const results = trajectoryRes?.results;
    if (!results?.length) return;
    for (let j = 0; j < results.length; j++) {
      try {
        const d = results[j]?.res?.data?.[0];
        d &&
          trajectoryData.push({
            lon: JSON.parse(d.lon),
            lat: JSON.parse(d.lat),
            alt: JSON.parse(d.alt),
            active: results?.length > 1 && j === 0 ? "active" : "",
            Drop_distance_difference: d.Drop_distance_difference,
            Drop_point_alt: d.Drop_point_alt,
            Drop_point_lat: d.Drop_point_lat,
            Drop_point_lng: d.Drop_point_lng,
            hor_heigh: d.hor_heigh,
          });
      } catch (error) {
        console.warn(error);
      }
    }

    store.commit("SET_trajectoryData", trajectoryData);
    if (type === "2d") {
      addPlaneTrajectory();
    }
  });
}
// 能量可视化数据
function getEnergy(type) {
  let dataObj = { date: "2021071912" };
  // if (centerLng.value !== "") {
  //   dataObj.lon = centerLng.value;
  //   dataObj.lat = centerLat.value;
  // }
  mapApi.getEnergy(dataObj).then((energyRes) => {
    try {
      energyData_Max = energyRes.data.max_v;
      lenged.value = [0.1, energyRes.data.max_v.toFixed(2)];
      JSON.parse(energyRes.data.data).forEach((el, i) => {
        el.forEach((ele, j) => {
          energyData.push([0 + 1.5 * j, -89.5 + 1.4875 * i, ele]);
        });
      });
      store.commit("SET_Energy", energyData);
      if (type === "2d") {
        addPlaneEnergy();
      }
    } catch (error) {
      console.warn(error);
    }
  });
}
// 获取数据
function getData(type, isSetting = false) {
  trajectoryData = [];
  energyData_Max = 1;
  energyData = [];
  getTrajectory(type);
  if (isSetting) return;
  getEnergy(type);
  return;
}
// 添加2d轨迹与能量数据
function addPlaneTrajectory() {
  let arr = [],
    pointArr = [],
    lineArr = [];
  console.log(trajectoryData);
  trajectoryData.forEach((d) => {
    arr = [];
    d.lon.forEach((el, j) => {
      if (j % 30 === 0) {
        arr.push([el, d.lat[j]]);
      }
    });
    arr.push(d.lon[d.lon.length - 1], d.lat[d.lat.length - 1]);
    lineArr.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: arr,
      },
      properties: {
        lineColor: d.active === "active" ? "#f00" : "#3eede7",
        Drop_distance_difference: d.Drop_distance_difference,
        Drop_point_alt: d.Drop_point_alt,
        Drop_point_lat: d.Drop_point_lat,
        Drop_point_lng: d.Drop_point_lng,
        hor_heigh: d.hor_heigh,
      },
    });
    pointArr.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [d.lon[d.lon.length - 1], d.lat[d.lat.length - 1]],
      },
      properties: {
        image: d.active === "active" ? "SondeActive" : "Sonde",
        Drop_distance_difference: d.Drop_distance_difference,
        Drop_point_alt: d.Drop_point_alt,
        Drop_point_lat: d.Drop_point_lat,
        Drop_point_lng: d.Drop_point_lng,
        hor_heigh: d.hor_heigh,
      },
    });
  });
  map.getSource("sonde-line").setData({
    type: "FeatureCollection",
    features: lineArr,
  });
  map.getSource("sonde").setData({
    type: "FeatureCollection",
    features: pointArr,
  });
  map.moveLayer("sonde-line", "sonde");
  map.moveLayer("station", "sonde");
  map.moveLayer("station", "sonde-line");
}
function addPlaneEnergy() {
  let result = tof32Array(energyData);
  // let pointLen = result.length / 6;
  let indexEle = getElementIndex();
  let customLayer = {
    id: "energy-2d",
    type: "custom",
    onAdd: function (map, gl) {
      // 顶点着色器
      let vertexSource = `
        uniform mat4 u_matrix;
        attribute vec2 a_pos;
        attribute   vec4  inColor;
        varying     vec4  outColor;
        void main() {   
            outColor    =   inColor;
            gl_Position = u_matrix * vec4(a_pos,0.0 , 1.0); 
          }
        `;

      // 片元着色器
      let fragmentSource = `
        precision   lowp  float;
        varying     vec4  outColor;
        void main() {
            gl_FragColor = outColor;
          //  gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
        }
        `;
      // 创建顶点着色器
      let vertexShader = gl.createShader(gl.VERTEX_SHADER);
      // 提供顶点数据源——定点着色器代码字符串
      gl.shaderSource(vertexShader, vertexSource);
      // 编译，生成顶点着色器
      gl.compileShader(vertexShader);
      // 创建片元着色器
      let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      // 提供片元着色器数据源——片元着色器代码字符串
      gl.shaderSource(fragmentShader, fragmentSource);
      // 编译片元着色器
      gl.compileShader(fragmentShader);
      // 创建着色程序-并链接顶点着色器和片元着色器
      this.program = gl.createProgram();
      gl.attachShader(this.program, vertexShader);
      gl.attachShader(this.program, fragmentShader);
      gl.linkProgram(this.program);

      // 从顶点着色器中获取 a_pos 属性所在的位置
      this.aPos = gl.getAttribLocation(this.program, "a_pos");
      this.inColor = gl.getAttribLocation(this.program, "inColor");

      // 创建buffer存储数据，着色器中的 a_pos 属性将从buffer里面获取数据
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(result), gl.STATIC_DRAW);

      this.indexBuffer = gl.createBuffer();
      // 绑定buffer
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      // 绑定数据
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexEle), gl.STATIC_DRAW);
    },

    render: function (gl, matrix) {
      // 使用色程序，着色程序可能有多个，绘制数据前指定使用哪个着色程序
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_matrix"), false, matrix);
      // 给视口矩阵赋值
      // 使用缓冲前要先绑定
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      //启用 a_pos 属性
      gl.enableVertexAttribArray(this.aPos);
      // 指定从缓冲中读取数据的策略
      gl.enableVertexAttribArray(this.inColor);
      gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 4 * 6, 0);
      // console.log(this.inColor)
      gl.vertexAttribPointer(this.inColor, 4, gl.FLOAT, false, 4 * 6, 4 * 2);
      // 启用颜色混合，大概意思就是把某一像素位置原来的颜色和将要画上去的颜色，通过某种方式混在一起，从而实现特殊的效果
      gl.enable(gl.BLEND);
      // 剔除遮挡
      gl.enable(gl.CULL_FACE);
      // 指定颜色混合方式
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      //
      gl.drawElements(gl.TRIANGLE_STRIP, indexEle.length, gl.UNSIGNED_SHORT, 0);
      map.triggerRepaint();
      return true;
    },
  };

  map.addLayer(customLayer);
  if (map.getLayer("sonde")) {
    map.moveLayer("sonde-line", "sonde");
    map.moveLayer("energy-2d", "sonde-line");
    // map.moveLayer("energy-2d", "tdtIbo");
  }
}
// 处理数据点信息
function tof32Array(csvstr) {
  let tmparr = csvstr;
  let res = [];
  for (let i = 0; i < tmparr.length; i += 1) {
    let item = tmparr[i];
    let tmpitem = item;
    tmpitem[0] = Number(tmpitem[0]);
    tmpitem[1] = Number(tmpitem[1]);
    tmpitem[2] = Number(tmpitem[2]);
    let nor = mapboxgl.MercatorCoordinate.fromLngLat({
      lng: Number(tmpitem[0]),
      lat: Number(tmpitem[1]),
    });
    let tmp = [
      nor.x,
      nor.y,
      ...calcColor(tmpitem[2]), // r,g,b,a
    ];
    res.push(...tmp);
  }
  return res;
}
// 获取索引
function getElementIndex() {
  let arr = [];
  for (let i = 0; i < 120; i++) {
    for (let j = 0; j < 239; j++) {
      let x = j + 240 * i;
      let y = x + 1;
      let z = x + 240;
      let arr1 = [x, y, z, y, z, ++z];
      arr.push(...arr1);
    }
  }
  return arr;
}
// 颜色差值
function calcColor(value, type) {
  // if (value == 0) return [0, 0, 0, 0];
  if (value <= 0.1) return [0, 0, 0, 0];
  let aa = d3.rgb(255, 0, 0);
  let bb = d3.rgb(255, 123, 29);
  let compute = d3.interpolate(aa, bb);
  let linear = d3.scaleLinear().domain([0.1, energyData_Max]).range([1, 0]);
  let tmpres = compute(linear(value));
  let rgb = tmpres.split(",");
  let r = rgb[0].split("(")[1];
  let g = rgb[1];
  let b = rgb[2].split(")")[0];
  // return [r / 255.0, g / 255.0, b / 255.0, type === "3d" ? 0.6 : 0.6];
  return [r / 255.0, g / 255.0, b / 255.0, 0.6];
}
// 清除2d数据
function clearPlaneData() {
  if (map.getLayer("sonde")) {
    map.getSource("sonde-line").setData({
      type: "FeatureCollection",
      features: [],
    });
    map.getSource("sonde").setData({
      type: "FeatureCollection",
      features: [],
    });
  }
  if (map.getLayer("energy-2d")) {
    map.removeLayer("energy-2d");
  }
}

// 切换3d视图时切换视角
function changeView() {
  map.flyTo({
    center: [map.getCenter().lng, map.getCenter().lat],
    pitch: 60,
    bearing: 0,
  });
  map.dragRotate.enable();
}
// 还原视角
function returnView() {
  map.flyTo({
    center: [map.getCenter().lng, map.getCenter().lat],
    pitch: 0,
    bearing: 0,
  });
  map.dragRotate.disable();
}
// 添加3d能量和轨迹数据
function addStereoscopicTrajectory() {
  let result = tof32ArrayStereoscopicTrajectory(trajectoryData);
  let pointLen = result.length / 7;
  let customLayer = {
    id: "trajectory-3d",
    type: "custom",
    onAdd: function (map, gl) {
      var vertexSource = `
                        uniform mat4 u_matrix;
                        attribute vec2 a_pos;
                        attribute   vec4  inColor;
                         varying     vec4  outColor;
                         attribute float  pointH; 
                        void main() {   
                              outColor    =   inColor;
                              gl_Position = u_matrix * vec4(a_pos,pointH , 1.0); 
                              gl_PointSize = 4.0;
                  
                         }
                        `;

      var fragmentSource = `
                        precision   lowp  float;
                        varying     vec4  outColor;
                        void main() {
                        gl_FragColor = outColor;
                        //    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
                        }
                        `;
      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertexSource);
      gl.compileShader(vertexShader);
      var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragmentSource);
      gl.compileShader(fragmentShader);
      this.program = gl.createProgram();
      gl.attachShader(this.program, vertexShader);
      gl.attachShader(this.program, fragmentShader);
      gl.linkProgram(this.program);

      this.aPos = gl.getAttribLocation(this.program, "a_pos");
      this.inColor = gl.getAttribLocation(this.program, "inColor");
      this.pointH = gl.getAttribLocation(this.program, "pointH");
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(result), gl.STATIC_DRAW);
    },

    render: function (gl, matrix) {
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_matrix"), false, matrix);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.enableVertexAttribArray(this.aPos);
      gl.enableVertexAttribArray(this.inColor);
      gl.enableVertexAttribArray(this.pointH);
      gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 4 * 7, 0);
      gl.vertexAttribPointer(this.inColor, 4, gl.FLOAT, false, 4 * 7, 4 * 2);
      gl.vertexAttribPointer(this.pointH, 1, gl.FLOAT, false, 4 * 7, 4 * 6);
      // gl.disable(gl.BLEND);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      // gl.drawArrays(gl.LINE_STRIP, 0, pointLen);
      gl.drawArrays(gl.POINTS, 0, pointLen);
      map.triggerRepaint();
      return true;
    },
  };
  map.addLayer(customLayer);
}
function addStereoscopicEnergy() {
  let activeBuffer = null;
  let result = tof32ArrayStereoscopic(energyData);
  // let pointLen = result.length / 7;
  let indexEle = getElementIndex();
  let customLayer = {
    id: "energy-3d",
    type: "custom",
    onAdd: function (map, gl) {
      let vertexSource = `
        uniform mat4 u_matrix;
        attribute vec2 a_pos;
        attribute   vec4  inColor;
        varying     vec4  outColor;
        attribute float  pointH; 
        void main() {   
            outColor      =   inColor;
            gl_Position =    u_matrix * vec4(a_pos,pointH , 1.0); 
        }
      `;
      let fragmentSource = `
        precision   lowp  float;
        varying     vec4  outColor;
        void main() {
        gl_FragColor = outColor;
          //  gl_FragColor =   vec4(1.0, 0.0, 0.0, 0.5);
        }
        `;
      let vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertexSource);
      gl.compileShader(vertexShader);
      let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragmentSource);
      gl.compileShader(fragmentShader);
      this.program = gl.createProgram();
      gl.attachShader(this.program, vertexShader);
      gl.attachShader(this.program, fragmentShader);
      gl.linkProgram(this.program);

      this.aPos = gl.getAttribLocation(this.program, "a_pos");
      this.inColor = gl.getAttribLocation(this.program, "inColor");
      this.pointH = gl.getAttribLocation(this.program, "pointH");

      // for (let i = 0; i < result.length; i++) {
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(result), gl.STATIC_DRAW);
      // buffers.push(this.buffer);
      // }

      activeBuffer = this.buffer;
      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexEle), gl.STATIC_DRAW);
    },

    render: function (gl, matrix) {
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_matrix"), false, matrix);
      gl.bindBuffer(gl.ARRAY_BUFFER, activeBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.enableVertexAttribArray(this.aPos);
      gl.enableVertexAttribArray(this.inColor);
      gl.enableVertexAttribArray(this.pointH);
      gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 4 * 7, 0);
      gl.vertexAttribPointer(this.inColor, 4, gl.FLOAT, false, 4 * 7, 4 * 2);
      gl.vertexAttribPointer(this.pointH, 1, gl.FLOAT, false, 4 * 7, 4 * 6);
      // 颜色混合
      // gl.enable(gl.BLEND);
      // gl.enable(gl.CULL_FACE);
      // gl.enable(gl.DEPTH_TEST);
      // gl.depthFunc(gl.LEQUAL);
      // // gl.blendFunc(gl.one, gl.zero)
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      //
      // gl.drawArrays(gl.LINE_STRIP, 0, pointLen);
      // gl.drawElements(gl.LINE_STRIP, indexEle.length, gl.UNSIGNED_SHORT, 0);
      gl.drawElements(gl.TRIANGLES, indexEle.length, gl.UNSIGNED_SHORT, 0);
      map.triggerRepaint();
      return true;
    },
  };
  map.addLayer(customLayer);
}
function tof32ArrayStereoscopic(csvstr) {
  let tmparr = csvstr;
  let res = [];
  for (let i = 0; i < tmparr.length; i += 1) {
    let item = tmparr[i];
    let tmpitem = item;
    tmpitem[0] = Number(tmpitem[0]);
    tmpitem[1] = Number(tmpitem[1]);
    tmpitem[2] = Number(tmpitem[2]);
    let nor = mapboxgl.MercatorCoordinate.fromLngLat({
      lng: Number(tmpitem[0]),
      lat: Number(tmpitem[1]),
    });
    // x,y,r,g,b,a,h
    // let h = (tmpitem[2] / 800.0).toFixed(3);
    let tmp = [
      nor.x,
      nor.y,
      ...calcColor(tmpitem[2], "3d"), // r,g,b,a
      tmpitem[2] / 500.0,
    ];
    res.push(...tmp);
  }
  return res;
}
function tof32ArrayStereoscopicTrajectory(data) {
  let res = [];
  for (let item of data) {
    for (let i = 0; i < item.lon.length; i += 1) {
      let nor = mapboxgl.MercatorCoordinate.fromLngLat(
        {
          lng: Number(item.lon[i]),
          lat: Number(item.lat[i]),
        },
        Number(item.alt[i])
      );
      // x,y,r,g,b,a,h
      let tmp = [];
      if (item.active == "active") {
        tmp = [nor.x, nor.y, 255 / 255, 0 / 255, 0 / 255, 1.0, nor.z * 5];
      } else {
        tmp = [nor.x, nor.y, 62 / 255, 237 / 255, 231 / 255, 1.0, nor.z * 5];
      }
      res.push(...tmp);
    }
  }
  return res;
}
function getTrajectoryElementIndex() {
  console.log(trajectoryData);
  let arr = [];
  for (let i = 0; i < trajectoryData[0].lon.length; i++) {
    // for (let j = 0; j < 239; j++) {
    let arr1 = [trajectoryData[0].lon[i], trajectoryData[0].lat[i], trajectoryData[0].alt[i]];
    arr.push(...arr1);
    // }
  }
  return arr;
}
// 清除3d数据
function clearStereoscopicData() {
  if (map.getLayer("energy-3d")) {
    map.removeLayer("energy-3d");
    map.removeLayer("trajectory-3d");
  }
}
// 侧边栏点击事件
function IsShowStation() {
  showStation.value = !showStation.value;
  store.commit("SET_stationSwitch", showStation.value);
  if (map.getLayer("station") && showStation.value) {
    map.setLayoutProperty("station", "visibility", "visible");
  } else if (map.getLayer("station") && !showStation.value) {
    map.setLayoutProperty("station", "visibility", "none");
  }
}
function IsShowPlane() {
  showPlane.value = !showPlane.value;
  if (showPlane.value) {
    // clearStereoscopicData();
    // returnView();
    showStereoscopic.value = false;
    processingData("2d");
  } else {
    clearPlaneData();
  }
}
function IsShowStereoscopic() {
  showStereoscopic.value = !showStereoscopic.value;
  if (showStereoscopic.value) {
    clearPlaneData();
    showPlane.value = false;
    // changeView();
    processingData("3d");
    // } else {
    //   returnView();
    //   clearStereoscopicData();
  }
}
onMounted(() => {
  init();
  map.on("load", function () {
    initChinaMap();
    // initDistrict();
    initImage();
    initDraw();
    drawStation();
    initSonde();
    IsShowPlane();
    addEvent();
  });
});
onBeforeUnmount(() => {
  map.remove();
});
</script>

<style>
#mapbox,
#maps {
  width: 100%;
  height: 100%;
  /* background: #342c3c; */
}
.mapboxgl-control-container {
  display: none;
}
.infoLabel {
  width: 200px;
  height: 200px;
  background: #fff;
}
.sonde {
  color: #333;
}
</style>
<style lang="scss" scoped>
// .hint {
//   position: absolute;
//   top: 10px;
//   left: 10px;
//   background: #fff;
//   border-radius: 4px;
// }
.settingPopup {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  border: 1px solid #3586f4;
  border-radius: 6px;
  backdrop-filter: blur(5px);
  .settingPopup-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  .settingPopup-button {
    float: right;
    margin-left: 10px;
  }
  .isSelect {
    background: rgb(93, 102, 199);
  }
  :deep(.el-input) {
    --el-input-bg-color: rgb(51 59 153 / 53%);
    --el-input-border: 1px solid #3586f4;
    --el-input-text-color: #fff;
  }
  :deep(.el-button) {
    --el-button-bg-color: rgb(51 59 153 / 53%);
    --el-button-border-color: #3586f4;
    --el-button-text-color: #fff;
  }
}
.asideMenu {
  position: absolute;
  bottom: 20px;
  left: 20px;
  div {
    height: 28px;
    display: flex;
    align-items: center;
    font-size: 18px;
    cursor: pointer;
    img {
      width: 24px;
      margin-right: 4px;
    }
  }
  .IsShowStation,
  .IsShowPlane,
  .IsShowStereoscopic {
    color: yellow;
  }
}
.lenged {
  width: 200px;
  height: 24px;
  border-radius: 20em;
  position: absolute;
  bottom: 20px;
  right: 20px;
  border: 1px solid #fff;
  background: linear-gradient(to right, rgb(255, 123, 29), #f00);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 12px;
  align-items: center;
}
.txt-lenged {
  position: absolute;
  bottom: 40px;
  right: 20px;
  img {
    width: 22px;
    margin-right: 6px;
  }
  div {
    display: flex;
    font-size: 16px;
    margin-bottom: 6px;
  }
}

.popup {
  position: absolute;
  top: 40%;
  right: 0px;
  box-sizing: border-box;
  backdrop-filter: blur(5px);
  .data-handling-statistics {
    width: 280px;
    height: 260px;
    background-image: url("../assets/ztjk-rt-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;

    padding: 30px;

    .title {
      font-size: 20px;
      color: #70f3ff;
      padding: 10px 0;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      .col1 {
        font-size: 16px;
        color: #f2f2f2;
      }
      .col2 {
        .num {
          font-family: Digital;
          font-size: 20px;
          font-weight: bold;
          margin-right: 10px;
          letter-spacing: 4px;
          color: #4eebfb;
        }
      }
    }
  }
}
</style>
