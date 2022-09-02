<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useStore } from "vuex";
import * as d3 from "d3";
// import { color } from "d3";
import * as turf from "@turf/turf";
import dischargeImg from "../assets/discharge.png";
import sondeImg from "../assets/sonde.png";
import sondeActiveImg from "../assets/sondeActive.png";

const station = computed(() => store.state.rawStations);
let viewer, scene;
let points = [];
let activeShapePoints = [];
let activeShape;
let floatingPoint;
let centerPoint,
  centerPolygon,
  pointPolygon = [];
let drawLines = [],
  drawPoints = [];
let stationPoints = [];
let energyModel = {};

const emit = defineEmits(["lnglat"]);
const store = useStore();
let token = "ddcfd23b0dbc7cdc23bc68daa311d7ec";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZGY4MWEzOC1kMGI0LTQ2ZGUtYTNjMC01YmVkYmM1NzY5MjciLCJpZCI6MTQ1NzEsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyJdLCJpYXQiOjE1NjU5MzkwOTJ9.rK1R8nOFLFW3v4DyUXUiSnUeZzD24FgyrjT_EBvaVaU";
const cesiumContainer = ref(null);
const trajectoryData = computed(() => store.state.trajectoryData);
const stationSwitch = computed(() => store.state.stationSwitch);
watch(
  () => trajectoryData.value,
  (n) => {
    // console.log(n);
    const line = initLineData(n);
    if (drawLines.length > 0) {
      drawLines.forEach((el, i) => {
        viewer.entities.remove(el);
        viewer.entities.remove(drawPoints[i]);
      });
    }
    if (viewer) {
      line.forEach((el) => {
        drawLine(el);
      });
    } else {
      setTimeout(() => {
        line.forEach((el) => {
          drawLine(el);
        });
      }, 2000);
    }
  },
  { immediate: true }
);
watch(
  () => stationSwitch.value,
  (n) => {
    if (n) {
      if (stationPoints.length === 0) {
        if (viewer) {
          drawStation();
        } else {
          setTimeout(() => {
            drawStation();
          }, 2000);
        }
      } else {
        stationPoints.forEach((el) => {
          el.show = true;
        });
      }
    } else {
      stationPoints.forEach((el) => {
        el.show = false;
      });
      // stationPoints.forEach((el) => {
      //   viewer.entities.remove(el);
      // });
      // stationPoints = [];
    }
  },
  { immediate: true }
);
const energyData = computed(() => store.state.energyData);
watch(
  () => energyData.value,
  (n) => {
    // console.log(n);
    const energy = transformCartesian3Pos(n);
    const color = initColor(n);
    // creatGeometry(energy, color);
    if (viewer) {
      creatGeometry(energy, color);
    } else {
      setTimeout(() => {
        creatGeometry(energy, color);
      }, 2000);
    }
    // creatGeometry(n);
  },
  { immediate: true }
);
const props = defineProps({
  isSelect: Boolean,
  isDraw: Boolean,
  isDel: Boolean,
  showPlane: Boolean,
});
watch(
  () => props.isSelect,
  (n) => {
    if (n && centerPoint) {
      viewer.entities.remove(centerPoint);
    }
  },
  { immediate: true }
);
watch(
  () => props.isDraw,
  (n) => {
    if (n && centerPoint) {
      pointPolygon.forEach((el) => {
        viewer.entities.remove(el);
      });
      pointPolygon = [];
      centerPolygon && viewer.entities.remove(centerPolygon);
      centerPoint && viewer.entities.remove(centerPoint);
    }
  },
  { immediate: true }
);
watch(
  () => props.isDel,
  () => {
    pointPolygon.forEach((el) => {
      viewer.entities.remove(el);
    });
    pointPolygon = [];
    centerPolygon && viewer.entities.remove(centerPolygon);
    centerPoint && viewer.entities.remove(centerPoint);
  },
  { immediate: true }
);
watch(
  () => props.showPlane,
  (n) => {
    energyModel.show = n;
    drawLines.forEach((el) => {
      el.show = n;
    });
    drawPoints.forEach((el) => {
      el.show = n;
    });
  }
);
// 将经纬度高度 转换未世界坐标
function transformCartesian3Pos(__positions) {
  let realPos = [];
  for (let i = 0, ii = __positions.length; i < ii; i++) {
    let position = Cesium.Cartesian3.fromDegrees(
      __positions[i][0],
      __positions[i][1],
      __positions[i][2] * 10000
      // __positions[i][2] * 300000
    );
    realPos.push(position.x, position.y, position.z);
    // color.push(Cesium.Color.fromRandom({ alpha: 1.0 }));
  }
  // console.log(realPos);
  return realPos;
}

function addEvent() {
  const handlerd = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handlerd.setInputAction(function onLeftClick(movement) {
    if (props.isSelect) {
      let ellipsoid = scene.globe.ellipsoid;
      let cartesian = viewer.scene.pickPosition(movement.position);
      let cartographic = ellipsoid.cartesianToCartographic(cartesian);
      let lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
      let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
      centerPoint = createPoint(Cesium.Cartesian3.fromDegrees(lng, lat));
      emit("lnglat", { lng, lat });
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction(function (event) {
    const earthPosition = viewer.camera.pickEllipsoid(event.position);
    if (Cesium.defined(earthPosition) && props.isDraw) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(activeShapePoints);
        }, false);
        activeShape = drawShape(dynamicPositions);
      }
      activeShapePoints.push(earthPosition);
      pointPolygon.push(createPoint(earthPosition));
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint) && props.isDraw) {
      const newPosition = viewer.camera.pickEllipsoid(event.endPosition);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(function (event) {
    if (activeShapePoints.length <= 0) return;
    terminateShape();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
function terminateShape() {
  activeShapePoints.pop();
  centerPolygon = drawShape(activeShapePoints);
  compCenter(activeShapePoints);
  viewer.entities.remove(floatingPoint);
  viewer.entities.remove(activeShape);
  floatingPoint = undefined;
  activeShape = undefined;
  activeShapePoints = [];
}
function compCenter(points) {
  let arr = [];
  const ellipsoid = viewer.scene.globe.ellipsoid;
  points.forEach((el) => {
    let cartographic = ellipsoid.cartesianToCartographic(el);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    arr.push([lng, lat]);
  });
  arr.push(arr[0]);
  let polygon = turf.polygon([arr]);
  let center = turf.centerOfMass(polygon);
  centerPoint = createPoint(
    Cesium.Cartesian3.fromDegrees(center.geometry.coordinates[0], center.geometry.coordinates[1])
  );
  emit("lnglat", { lng: center.geometry.coordinates[0], lat: center.geometry.coordinates[1] });
}
function createPoint(worldPosition) {
  const point = viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
  return point;
}
function drawShape(positionData) {
  let shape = viewer.entities.add({
    polygon: {
      hierarchy: positionData,
      material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.4)),
    },
  });
  return shape;
}
function initCesium() {
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    shouldAnimate: true,
    // animation: false, //是否创建动画小器件，左下角仪表
    baseLayerPicker: false, //是否显示图层选择器
    fullscreenButton: false, //是否显示全屏按钮
    geocoder: false, //是否显示geocoder小器件，右上角查询按钮
    homeButton: false, //是否显示Home按钮
    infoBox: false, //是否显示信息框
    sceneModePicker: false, //是否显示3D/2D选择器
    selectionIndicator: false, //是否显示选取指示器组件
    // timeline: false, //是否显示时间轴
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    // terrainProvider:terrainProvider
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
      // url: `${__CURRENT_CONFIG__.MapBaseUrl}/lixianditu/map/L{_z}/{_y}/{_x}.png`, //服务地址
      url: `${import.meta.env.VITE_BASE_baseMAPURL}/lixianditu/map/L{_z}/{_y}/{_x}.png`, //服务地址
      maximumLevel: 8,
      customTags: {
        _z: function (imageryProvider, x, y, level) {
          return level < 10 ? "0" + level : level;
        },
        _x: function (imageryProvider, x, y, level) {
          var oo = "00000000";
          var xx = x.toString(16);
          xx = "C" + oo.substring(0, 8 - xx.length) + xx;
          return xx;
        },
        _y: function (imageryProvider, x, y, level) {
          var oo = "00000000";
          var yy = y.toString(16);
          yy = "R" + oo.substring(0, 8 - yy.length) + yy;
          return yy;
        },
      },
    }),
  });
  scene = viewer.scene;

  var options = {};
  // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
  // options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
  options.defaultResetView = Cesium.Cartographic.fromDegrees(103.84, 31.15, 17850000);
  // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
  options.enableCompass = true;
  // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
  options.enableZoomControls = true;
  // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
  options.enableDistanceLegend = true;
  // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  options.enableCompassOuterRing = true;

  CesiumNavigation.umd(viewer, options);

  viewer.timeline.container.style.visibility = "hidden";
  viewer.animation.container.style.visibility = "hidden";
  viewer.cesiumWidget.creditContainer.style.display = "none";
  viewer.scene.globe.depthTestAgainsTerrain = true;
  //设置操作习惯,更换中键和右键
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    Cesium.CameraEventType.RIGHT_DRAG,
    Cesium.CameraEventType.PINCH,
    {
      eventType: Cesium.CameraEventType.LEFT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
    {
      eventType: Cesium.CameraEventType.RIGHT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
  ];
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    Cesium.CameraEventType.MIDDLE_DRAG,
    Cesium.CameraEventType.WHEEL,
    Cesium.CameraEventType.PINCH,
  ];

  //防止视角进入地下
  // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10
  var mousePosition, startMousePosition;
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction(function (movement) {
    mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
    handler.setInputAction(function (movement) {
      mousePosition = movement.endPosition;
      var y = mousePosition.y - startMousePosition.y;
      if (y > 0) {
        viewer.scene.screenSpaceCameraController.enableTilt = true;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
  viewer.scene.moon.destroy();

  var camera = viewer.camera;
  // 将三维球定位到中国
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(109, 31.15, 4000000),
    orientation: {
      heading: Cesium.Math.toRadians(348.4202942851978),
      pitch: Cesium.Math.toRadians(-89.74026687972041),
      roll: Cesium.Math.toRadians(0),
    },
    // complete: function callback() {
    //   // 定位完成之后的回调函数
    //   this.readyLoadCesium();
    // },
  });
}
// 颜色差值
function calcColor(value) {
  if (value <= 0.1) return [0, 0, 0, 0];
  let aa = d3.rgb(255, 0, 0);
  let bb = d3.rgb(255, 123, 29);
  let compute = d3.interpolate(aa, bb);
  let linear = d3.scaleLinear().domain([0.1, 1.87]).range([1, 0]);
  let tmpres = compute(linear(value));
  let rgb = tmpres.split(",");
  let r = rgb[0].split("(")[1];
  let g = rgb[1];
  let b = rgb[2].split(")")[0];
  return [+r / 255, +g / 255, +b / 255, 0.6];
}
function initColor(data) {
  let arr = [];
  data.forEach((el) => {
    const color = calcColor(el[2]);
    arr.push(color[0], color[1], color[2], color[3]);
  });
  return arr;
}
function initLineData(data) {
  let line = [],
    lineData = [];
  data.forEach((el) => {
    lineData = [];
    el.lon.forEach((ele, i) => {
      if (i % 30 == 0) {
        lineData.push(ele, el.lat[i], el.alt[i]);
      }
    });
    lineData.push(el.lon[el.lon.length - 1], el.lat[el.lat.length - 1], el.alt[el.alt.length - 1]);
    line.push({
      lineData,
      active: el.active,
      Drop_distance_difference: el.Drop_distance_difference,
      Drop_point_alt: el.Drop_point_alt,
      Drop_point_lat: el.Drop_point_lat,
      Drop_point_lng: el.Drop_point_lng,
      hor_heigh: el.hor_heigh,
    });
  });
  return line;
}
function drawLine(polyline) {
  let line = viewer.entities.add({
    name: "lines",
    properties: {
      Drop_distance_difference: polyline.Drop_distance_difference,
      Drop_point_alt: polyline.Drop_point_alt,
      Drop_point_lat: polyline.Drop_point_lat,
      Drop_point_lng: polyline.Drop_point_lng,
      hor_heigh: polyline.hor_heigh,
    },
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(polyline.lineData),
      width: 5,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.3,
        taperPower: 0.3,
        color: polyline.active != "" ? Cesium.Color.RED : Cesium.Color.MEDIUMBLUE,
        taperPower: 1,
      }),
    },
  });
  drawLines.push(line);
  let point = viewer.entities.add({
    name: "points",
    properties: {
      Drop_distance_difference: polyline.Drop_distance_difference,
      Drop_point_alt: polyline.Drop_point_alt,
      Drop_point_lat: polyline.Drop_point_lat,
      Drop_point_lng: polyline.Drop_point_lng,
      hor_heigh: polyline.hor_heigh,
    },
    position: Cesium.Cartesian3.fromDegrees(
      polyline.lineData[polyline.lineData.length - 3],
      polyline.lineData[polyline.lineData.length - 2],
      polyline.lineData[polyline.lineData.length - 1]
    ),
    billboard: {
      image: polyline.active != "" ? sondeActiveImg : sondeImg,
      scale: 0.14,
    },
  });
  drawPoints.push(point);
}
function drawStation() {
  // console.log(station.value);
  station.value.forEach((el) => {
    if (el.STATION_TYPE !== "2") {
      let point = viewer.entities.add({
        name: "station",
        properties: {},
        position: Cesium.Cartesian3.fromDegrees(el.LNG, el.LAT),
        billboard: {
          image: dischargeImg,
          scale: 0.1,
        },
        label: {
          text: el.STATION_NAME,
          font: "8px sans-serif",
          pixelOffset: new Cesium.Cartesian2(0.0, -8.0),
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
      });
      stationPoints.push(point);
    }
  });
}
// 获取索引
function getElementIndex() {
  let arr = [];
  for (let i = 0; i < 119; i++) {
    for (let j = 0; j < 239; j++) {
      // for (let j = 0; j < 240; j++) {
      let x = j + 240 * i;
      let y = x + 1;
      let z = x + 240;
      let arr1 = [x, y, z, y, z, ++z];
      arr.push(...arr1);
    }
  }
  return arr;
}
function creatGeometry(arr, color) {
  // console.log(arr, color);
  // // Create geometry with a position attribute and indexed lines.
  const positions = new Float64Array(arr);
  const colors = new Float32Array(color);
  const indices = new Uint16Array(getElementIndex());
  var geometry = new Cesium.Geometry({
    attributes: {
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: positions,
      }),
      color: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        componentsPerAttribute: 4,
        values: colors,
      }),
    },
    //索引
    indices: indices,
    //绘制类型
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    boundingSphere: Cesium.BoundingSphere.fromVertices(positions),
  });

  const geo = new Cesium.GeometryInstance({
    geometry: geometry,
  });
  energyModel = new Cesium.Primitive({
    geometryInstances: [geo],
    allowPicking: false,
    appearance: new Cesium.PerInstanceColorAppearance(),
  });
  scene.primitives.add(energyModel);
  console.log(energyModel);
}
function bindEvent() {
  const nameOverlay = document.createElement("div");
  viewer.container.appendChild(nameOverlay);
  nameOverlay.className = "backdrop";
  nameOverlay.style.display = "none";
  nameOverlay.style.position = "absolute";
  nameOverlay.style.bottom = "0";
  nameOverlay.style.left = "0";
  nameOverlay.style["pointer-events"] = "none";
  nameOverlay.style.padding = "4px";
  nameOverlay.style.backgroundColor = "black";

  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function onLeftClick(movement) {
    // handler.setInputAction(function onMouseMove(movement) {
    // let pick = viewer.scene.pick(movement.endPosition);
    let pick = viewer.scene.pick(movement.position);
    // console.log(pick);
    // If a feature was previously highlighted, undo the highlight
    if (
      !Cesium.defined(pick) ||
      (Cesium.defined(pick) && pick.id.name !== "points" && pick.id.name !== "lines")
    ) {
      nameOverlay.style.display = "none";
      return;
    }
    if ((Cesium.defined(pick) && pick.id.name === "points") || pick.id.name === "lines") {
      // console.log(pick);
      nameOverlay.style.display = "block";
      nameOverlay.style.bottom = `${viewer.canvas.clientHeight - movement.position.y + 10}px`;
      nameOverlay.style.left = `${movement.position.x + 10}px`;
      // const name = pickedFeature.getProperty("BIN");
      nameOverlay.innerHTML = `<div>落点距离差：${pick.id.properties.Drop_distance_difference} m</div>
      <div>落点经度：${pick.id.properties.Drop_point_lng} °</div>
      <div>落点纬度：${pick.id.properties.Drop_point_lat} °</div>
      <div>落点高度：${pick.id.properties.Drop_point_alt} m</div>
      <div>平漂高度：${pick.id.properties.hor_heigh} m</div>`;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function destroyCesium() {
  if (viewer) {
    if (viewer.entities) {
      viewer.entities.removeAll();
    }
    viewer.destroy();
  }
}

onMounted(() => {
  initCesium();
  addEvent();
  bindEvent();
  // creatGeometry();
  // creatGeometry();
});
onBeforeUnmount(() => {
  destroyCesium();
});
</script>
<style>
.compass {
  right: auto;
  left: 0;
}
.navigation-controls {
  right: auto;
  left: 30px;
}
</style>
<style lang="scss" scoped>
@import url("../assets/css/index.css");
@import url("../assets/css/reset.css");
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
