<template>
    <div id="chartdiv" :style="{
        width: '100vw',
        height: '350px'
    }"></div>
</template>

<!-- Styles -->
<style></style>

<script setup>
import { onMounted, defineProps } from 'vue'
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
var props = defineProps({
    currentData: {
        default: [{
            category: "01:00",
            temp: 0,
            icon: '@/assets/weather/Sun.svg',
            precipitation: "20%",
        }, {
            category: "02:00",
            temp: 20,
            icon: '@/assets/weather/Sun.svg',
            precipitation: "20%",
        }]
    },
    height: {
        default: '417px'
    }
})

onMounted(() => {
    var root = am5.Root.new("chartdiv");

    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true,
            layout: root.verticalLayout
        })
    );
    // Define data
    var data = props.currentData
    var yRenderer = am5xy.AxisRendererY.new(root, {})
    yRenderer.labels.template.set('visible', false)
    // Craete Y-axis
    let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: yRenderer
        })
    );

    var xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
    })
    // Create X-Axis
    var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: "category",
            renderer: xRenderer,
            maxDeviation: 0.5,
            bullet: function (root, axis, dataItem) {
                return am5xy.AxisBullet.new(root, {
                    location: 0.5,
                    sprite: am5.Picture.new(root, {
                        width: 24,
                        height: 24,
                        centerY: am5.p50,
                        centerX: am5.p50,
                        src: data[dataItem._settings.index].icon
                    })
                });
            }
        })
    );

    xAxis.get("renderer").grid.template.set("forceHidden", true);
    yAxis.get("renderer").grid.template.set("forceHidden", true);

    xRenderer.grid.template.setAll({
        location: 1
    })
    // console.log(data)
    xRenderer.labels.template.setAll({
        paddingTop: 20,
        textAlign: 'center',
        // text: "",
        html: `<div style="text-align:center">
            <div style="font-size:12px;">&#128167;{rh}%</div>
            <div style="padding-top:8px;font-size:10px;">{category}</div>
        </div>`
    });
    xAxis.data.setAll(data);

    // Create series
    var series1 = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "temp",
            categoryXField: "category"
        })
    );
    series1.data.setAll(data);

    series1.fills.template.set("fillGradient", am5.LinearGradient.new(root, {
        stops: [{
            color: am5.color('#7be0e6'),
            opacity: 1
        }, {
            opacity: 0
        }],
        rotation: 90
    }));

    series1.fills.template.setAll({
        visible: true,
        fillOpacity: 1
    });

    series1.bullets.push(function () {
        return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Label.new(root, {
                fill: am5.color('#ff0000'),
                text: "{temp}ᵒ",
                centerX: am5.percent(50),
                centerY: am5.percent(100),
                populateText: true,
                fontSize: '12px',
                fontWeight: 700
            })
        });
    });

    // series1.strokes.template.setAll({
    //     strokeWidth: 2
    // });
})
</script>