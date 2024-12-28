var config = {
    public: {
        tokenDefault: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjNWFkZWUxYzY5MzM0NjY2N2EzZWM0MWRlMjBmZWZhNDcxOTNjYzcyZDgwMGRiN2ZmZmFlMWVhYjcxZGYyYjQiLCJpYXQiOjE3MDE1ODMzNzl9.D1VNpMoTUVFOUuQW0y2vSjttZwj0sKBX33KyrkaRMcQ'
    }
}
export const nearestMultipleOfThreeHours = (date) => {
    // Ambil waktu sekarang
    var now;
    if (date) {
        now = new Date(date);
    } else {
        now = new Date();
    }
    const hours = now.getHours();

    // Cari kelipatan 3 terdekat
    const remainder = hours % 3;
    const nearestMultiple = remainder === 0 ? hours : hours + (3 - remainder);

    // Jika kelipatan terdekat melebihi 24 jam, kembali ke 0 (hari berikutnya)
    const adjustedHours = nearestMultiple >= 24 ? 0 : nearestMultiple;

    // Set jam ke kelipatan 3 terdekat dan reset menit dan detik
    const year = now.getFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dates = String(now.getUTCDate()).padStart(2, '0');
    const hoursFormatted = String(now.getUTCHours()).padStart(2, '0');

    return `${year}-${month}-${dates}T${hoursFormatted}:00:00`;
};
export const initsus = async (map, dated, withTourism) => {
    if (map.getLayer("kotkab-labels")) {
        map.removeLayer("kotkab-labels");
    }
    //
    if (map.getLayer("kecamatan-labels")) {
        map.removeLayer("kecamatan-labels");
    }
    // kelurahan-labels
    if (map.getLayer("kelurahan-labels")) {
        map.removeLayer("kelurahan-labels");
    }
    if (map.getSource("suspoi")) {
        map.removeSource("suspoi");
    }
    map.addSource("suspoi", {
        type: "vector",
        url: `https://cuaca.bmkg.go.id/api/v1/sus/tiles/data/suspoi.json?api_token=${config.public.tokenDefault}`,
    });
    // '2023-11-27T00:00:00'
    // 2023-11-27T00:00:00Z
    // Add a layer for each type with appropriate zoom range
    let tanggalDipilih = dated
    const weatherIcons = [
        { name: "rain", icon: "light-rain" },
        { name: "rain", icon: "light-rain-night" },
        { name: "moderate_rain", icon: "moderate-rain" },
        { name: "moderate_rain", icon: "moderate-rain-night" },
        { name: "light_rain_sun", icon: "light-rain" },
        { name: "light_rain_sun", icon: "light-rain-night" },
        { name: "fair_sun", icon: "partly-cloudy" },
        { name: "fair_sun", icon: "partly-cloudy-night" },
        { name: "cloudy", icon: "overcast" },
        { name: "cloudy", icon: "overcast-night" },
        { name: "sun", icon: "sunny" },
        { name: "night", icon: "sunny-night" },
        { name: 'fog', icon: 'fog-night' },
        { name: 'fog', icon: 'fog' },
        { name: "mostly_cloudy", icon: "mostly-cloudy" },
        { name: "mostly_cloudy", icon: "mostly-cloudy-night" },
        { name: "dry-thunderstorm", icon: "dry-thunderstorm" },
        { name: "dry-thunderstorm", icon: "dry-thunderstorm-night" },
        { name: "thunderstorm", icon: "thunderstorm" },
        { name: "thunderstorm", icon: "thunderstorm-night" },
        { name: "haze-mist", icon: "haze-mist" },
        { name: "haze-mist", icon: "haze-mist-night" }, // Add the mostly-cloudy icon
    ];

    async function loadIcons(map) {
        for (let i = 0; i < weatherIcons.length; i++) {
            const icon = weatherIcons[i];
            try {
                if (map.hasImage(icon.icon)) {
                    // 
                } else {
                    var image = await map.loadImage(`/meteogram/${icon.icon}.png`);
                    map.addImage(icon.icon, image.data);
                }
          

            } catch (e) {
                // console.log(e)
            }
        }
    }

    loadIcons(map);

    // Kotkab
    map.addLayer({
        id: "kotkab-labels",
        type: "symbol",
        source: "suspoi",
        "source-layer": "suspoi", // Replace with your layer name
        layout: {
            "icon-image": ["get", tanggalDipilih], // Use the weather_icon property from your data
            "icon-size": 0.1,
            visibility: "visible",
            "icon-anchor": "bottom",
            "icon-offset": [0, -10],
            "text-anchor": "top",
            "text-offset": [0, 1],
            "text-field": ["get", "name"],
            "text-radial-offset": 0.5,
            "text-justify": "auto",
            "text-font": ["Klokantech Noto Sans Regular"],
            "text-size": {
                stops: [
                    [6, 10],
                    [12, 16],
                ],
            },
        },
        paint: {
            "text-halo-width": 2,
            "text-halo-color": "rgb(255,255,255)",
            "text-halo-blur": 0.5,
        },
        filter: ["==", ["get", "type"], "kotkab"],
        minzoom: 0,
        maxzoom: 10,
    });

    // Kecamatan
    map.addLayer({
        id: "kecamatan-labels",
        type: "symbol",
        source: "suspoi",
        "source-layer": "suspoi",
        layout: {
            "icon-image": ["get", tanggalDipilih], // Use the weather_icon property from your data
            "icon-size": 0.1,
            visibility: "visible",
            "icon-anchor": "bottom",
            "icon-offset": [0, -10],
            "text-anchor": "top",
            "text-offset": [0, 1],
            "text-field": ["get", "name"],
            "text-radial-offset": 0.5,
            "text-justify": "auto",
            "text-font": ["Klokantech Noto Sans Regular"],
            "text-size": 14,
        },
        paint: {
            "text-halo-width": 2,
            "text-halo-color": "rgb(255,255,255)",
            "text-halo-blur": 0.5,
        },
        filter: ["==", ["get", "type"], "kecamatan"],
        minzoom: 10,
        maxzoom: 12,
    });

    // Kelurahan
    map.addLayer({
        id: "kelurahan-labels",
        type: "symbol",
        source: "suspoi",
        "source-layer": "suspoi",
        layout: {
            "icon-image": ["get", tanggalDipilih], // Use the weather_icon property from your data
            "icon-size": 0.1,
            visibility: "visible",
            "icon-anchor": "bottom",
            "icon-offset": [0, -10],
            "text-anchor": "top",
            "text-offset": [0, 1],
            "text-field": ["get", "name"],
            "text-radial-offset": 0.5,
            "text-justify": "auto",
            "text-font": ["Klokantech Noto Sans Regular"],
            "text-size": 12,
        },
        paint: {
            "text-halo-width": 2,
            "text-halo-color": "rgb(255,255,255)",
            "text-halo-blur": 0.5,
        },
        filter: ["==", ["get", "type"], "kelurahan"],
        minzoom: 12,
    });
};
