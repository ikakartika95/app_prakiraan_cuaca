<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import maplibregl from "maplibre-gl";
import { ref, defineEmits, onMounted } from 'vue'
import {
  initsus,
  nearestMultipleOfThreeHours,
} from "../initsus.js";

const mapContainer = ref(null);
var emit = defineEmits(['mapready', 'click'])
onMounted(() => {
  const map = new maplibregl.Map({
    container: mapContainer.value, // Reference to the map container
    style: {
      version: 8,
      glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
      sources: {
        openmaptiles: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
        },
        administration: {
          type: "vector",
          tiles: [
            "https://tiles.circlegeo.com/data/administration/{z}/{x}/{y}.pbf",
          ],
          minzoom: 0,
          maxzoom: 14,
        },
      },
      layers: [

        {
          id: "background",
          type: "background",
          paint: { "background-color": "black" },
        },
        {
          id: "osm-tiles",
          type: "raster",
          source: "openmaptiles",
          minzoom: 0,
          maxzoom: 22,
        },
        {
          id: "administration-boundaries",
          type: "line",
          source: "administration",
          "source-layer": "province",
          paint: {
            "line-color": "#000", // Green color for boundaries
            "line-width": 2, // Thickness of the boundary lines
          },
        },
      ],
    },
    center: [106.826, -6.3], // Longitude, Latitude for Jakarta
    zoom: 8.7, // Appropriate zoom level for Jabodetabek
  });
  map.on('load', function () {
    // Add zoom controls
    const zoomControl = new maplibregl.NavigationControl();
    map.addControl(zoomControl, "top-right");

    // Add geolocation control
    const geolocationControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true, // Continuously watch user's location
      showUserHeading: true, // Show the user's heading
    });
    map.addControl(geolocationControl, "top-right");

    initsus(
      map,
      nearestMultipleOfThreeHours(),
      false
    );
    emit('mapready', map)
  })

  map.on('click', function(e) {
    emit('click', e)
  })
});

</script>

<style>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
