<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Chart from './components/Chart.vue'
import { onMounted, reactive } from 'vue'
import maplibregl from 'maplibre-gl'
import { getModelAndParse } from './initmeteogram'
import axios from 'axios'
var data = reactive({
  latlng: {
    lat: 0,
    lng: 115
  },
  currentData: null,
  map: null,
  popupraw: null,
  show: false,
  parsingDataToChart: null
})

function initMap(map) {
  data.map = map
}

var njir = (str) => {
  return str.split("_").join(" ");
};

async function mapclick(e) {
  data.currentData = null;

  const { lng, lat } = e.lngLat;
  data.latlng.lat = lat
  data.latlng.lng = lng

  var res = await getModelAndParse(
    parseFloat(data.latlng.lat),
    parseFloat(data.latlng.lng),
    axios
  );
  // var closest = getClosestTimeWithIndex(res.raw.time);

  data.currentData = {
    closest: {
      time: res.raw.time[0],
      index: 0,
    },
    response: res,
  };

  var d = new Date();
  data.parsingDataToChart = null;
  var result = [];

  data.currentData.response.raw.time.forEach((el, i) => {
    // console.log(new Date(el).getUTCHours(), new Date(props.currentData.closest.time).getUTCHours())
    if (new Date(el).getUTCDate() == new Date(d).getUTCDate()) {
      var obj = {
        category: "01:00",
        temp: 0,
        icon: "@/assets/weather/Sun.svg",
        precipitation: "20%",
        rh: 50
      };

      obj.rh =  parseFloat(
          data.currentData.response.parsed.humidity[i].toFixed(0)
        ) 
      obj.category = el.split("T")[1].split(":").splice(0, 2).join(":");
      obj.temp =
        parseFloat(
          data.currentData.response.parsed.temperatures[i].toFixed(0)
        ) || 0;
      obj.icon =
        "/meteogram/" +
        data.currentData.response.parsed.symbols[i] +
        ".png";
      obj.precipitation =
        parseFloat(
          data.currentData.response.parsed.precipitations[i].toFixed(1)
        ) || 0;
      result.push(obj);
    }
  });

  data.parsingDataToChart = result;

  new maplibregl.Popup()
    .setDOMContent(data.popupraw)
    .setLngLat(e.lngLat)
    .addTo(data.map);
}

onMounted(() => {
  if (!data.popupraw) {
    data.popupraw = document.getElementById("popupcomp");
  }
})
</script>

<template>
  <div class="hidden">
    <div id="popupcomp" :class="'w-full'" style="color:black !important" class="px-2">
      <div>
        <small class="underline" v-if="data.latlng.lat">
          {{ parseFloat(data.latlng.lat).toFixed(2) }} ,
          {{ parseFloat(data.latlng.lng).toFixed(2) }}
        </small>
      </div>
      <div v-if="
        data.currentData &&
        data.currentData.response.parsed.symbols.length > 0
      " class="font-semibold">
        {{
          new Date(data.currentData.closest.time).toLocaleString()
            
        }}
        
      </div>
      <div class="flex items-center space-x-2" v-if="
        data.currentData &&
        data.currentData.response.parsed.symbols.length > 0
      " style="margin-bottom:20px;">
        <div class="flex-none">
          <img class="w-20" :src="'/meteogram/' +
            data.currentData.response.parsed.symbols[
            data.currentData.closest.index
            ] +
            '.png'
            " />
        </div>
        <div class="text-md flex-grow text-right">
          <div class="flex text-4xl justify-end font-bold">
            <div>
              {{
                data.currentData.response.parsed.temperatures[
                  data.currentData.closest.index
                ].toFixed(0)
              }}
            </div>
            <div class="flex text-xl">°C</div>
          </div>
        </div>
      </div>

      <div class="mt-2 relative">
        <div style="margin-right:10px;" class="underline text-xs absolute bottom-1.5 right-0 mt-2 cursor-pointer"
          @click="data.show = true">
          <small>Details Forecast</small>
        </div>
      </div>
    </div>
  </div>
  <div style="background:white;z-index:1000;position:absolute;bottom:0px;left:0px;color:black !important"
    v-if="data.currentData && data.show">
    <div style="position:relative">
      <button @click="data.show = false" class="absolute" style="right:10px; top:10px;z-index:1000;color:red;cursor:pointer">&times;</button>
      <Chart :height="'350px'" :noborder="true" :currentData="data.parsingDataToChart" />
    </div>
  </div>

  <HelloWorld @mapready="initMap" @click="mapclick" />
</template>


<style scoped>
/* Hidden element */
.hidden {
  display: none;
}

/* Width full */
.w-full {
  width: 100%;
}

/* Padding (horizontal x-axis) */
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

/* Underline text */
.underline {
  text-decoration: underline;
}

/* Font weight semi-bold */
.font-semibold {
  font-weight: 600;
}

/* Flexbox layout */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.space-x-2>*:not(:last-child) {
  margin-right: 0.5rem;
}

/* Restrict size */
.flex-none {
  flex: none;
}

.w-20 {
  width: 5rem;
  /* 80px */
}

/* Text properties */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-md {
  font-size: 1rem;
  line-height: 1.5rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.leading-none {
  line-height: 1;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

/* Uppercase text */
.uppercase {
  text-transform: uppercase;
}

/* Font weight bold */
.font-bold {
  font-weight: 700;
}

/* Margins */
.mt-2 {
  margin-top: 0.5rem;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.left-0 {
  left: 0;
}

.top-12 {
  top: 3rem;
  /* Tailwind's `top-12` corresponds to 12 * 0.25rem = 3rem */
}

.w-full {
  width: 100%;
}


.bottom-1\.5 {
  bottom: 0.375rem;
  /* Custom value */
}

.right-0 {
  right: 0;
}

/* Cursor pointer */
.cursor-pointer {
  cursor: pointer;
}

/* Text size small */
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
</style>
