export const parseYrData = (response) => {
    var that = {};
    var xml = {
      dates: [],
      temperatures: [],
      precipitations: [],
      pressures: [],
      dewPoints: [],
      wind_dir: [],
      windspeeds: [],
      cloudcover: [],
      humidity: [],
      lonlat: [],
      wind250: [],
      wind400: [],
      wind500: [],
      wind600: [],
      wind700: [],
      wind800: [],
      wind850: [],
      wind900: [],
      wind950: [],
      templev: [],
    };
    var temp = response.data.t;
    var lev = Object.keys(response.data.t);
    var x, y, value, dateIso, yst;
  
    for (let i = 0; i < response.data.time.length; i++) {
      xml.temperatures[i] = response.data.t["0"][i]; //1000
      // xml.pressures[i] = response.data.mslp['0'][i];
      xml.wind_dir[i] = response.data.wdir["0"][i] + 180; //1000
      xml.windspeeds[i] = response.data.wspd["0"][i]; //1000
      xml.precipitations[i] = response.data.tp["0"][i];
      xml.dewPoints[i] = null;
      xml.humidity[i] = response.data.rh["0"][i]; //1000
      xml.cloudcover[i] = response.data.tcc ? response.data.tcc["0"][i] : null;
      xml.dates[i] = response.data.time[i];
    }
  
    that.dates = [];
    that.temperatures = [];
    that.windspeeds = [];
    that.precipitations = [];
    that.wind_dir = [];
    that.cloudcover = [];
    that.winds = [];
    that.symbols = [];
    that.temperaturesScale = Math.max.apply(null, xml.temperatures) + 5;
    that.windMax = Math.max.apply(null, xml.windspeeds) + 10;
    that.status = xml.simbol;
  
    var basic = {
      temperatures: [],
      windspeeds: [],
      precipitations: [],
      winds: [],
      pressure: [],
      humidity: [],
      cloudcover: [],
      symbols: [],
    };
    var datesNow, datesNowEpoch, tempInt, hour;
    var precip = [];
  
    that.precipitations[0] = 0;
    for (let i = 0; i < xml.dates.length; i++) {
      datesNow = new Date(xml.dates[i]);
      datesNowEpoch = datesNow.getTime();
  
      basic.temperatures[i] = xml.temperatures[i];
      basic.pressure[i] = xml.pressures[i];
      basic.humidity[i] = xml.humidity[i];
      basic.windspeeds[i] = xml.windspeeds[i];
      basic.cloudcover[i] = xml.cloudcover[i];
  
      if (i == 0) {
        precip[i] = 0;
      } else {
        precip[i] = xml.precipitations[i] - xml.precipitations[i - 1];
      }
  
      basic.precipitations[i] = Math.round(precip[i] * 100) / 100;
  
      basic.winds[i] = {
        value: xml.windspeeds[i],
        direction: xml.wind_dir[i],
      };
  
      hour = new Date().getHours();
  
      var codetoweather = {
        0: "sunny",
        1: "sunny",
        2: "partly-cloudy",
        3: "mostly-cloudy",
        4: "overcast", // overcast
        10: "haze-mist",
        17: "dry-thunderstorm",
        45: "fog",
        61: "light-rain",
        63: "moderate-rain",
        65: "heavy-rain",
        95: "thunderstorm",
        96: "thunderstorm",
        99: "thunderstorm",
      };
  
      if (hour < 6 || hour >= 18) {
        basic.symbols[i] = codetoweather[response.data.weather[0][i]] + "-night";
      } else {
        basic.symbols[i] = codetoweather[response.data.weather[0][i]];
      }
  
      // if (precip[i] > 0.1 && precip[i] < 2 && (hour < 6 || hour >= 18)) {
      //   basic.symbols[i] = "light_rain_night";
      // } else if (precip[i] > 0.1 && precip[i] < 2 && hour >= 6 && hour < 18) {
      //   basic.symbols[i] = "light_rain_sun";
      // } else if (precip[i] >= 2 && precip[i] < 10) {
      //   basic.symbols[i] = "moderate_rain";
      // } else if (precip[i] > 10) {
      //   basic.symbols[i] = "rain";
      // } else if (precip[i] <= 0.1 && xml.cloudcover[i] >= 90) {
      //   basic.symbols[i] = "cloudy";
      // } else if (
      //   xml.cloudcover[i] >= 40 &&
      //   xml.cloudcover[i] < 90 &&
      //   hour >= 6 &&
      //   hour < 18
      // ) {
      //   basic.symbols[i] = "fair_sun";
      // } else if (
      //   xml.cloudcover[i] >= 40 &&
      //   xml.cloudcover[i] < 90 &&
      //   (hour < 6 || hour >= 18)
      // ) {
      //   basic.symbols[i] = "fair_night";
      // } else if (xml.cloudcover[i] < 40 && hour >= 6 && hour < 18) {
      //   basic.symbols[i] = "sun";
      // } else if (xml.cloudcover[i] < 40 && (hour < 6 || hour >= 18)) {
      //   basic.symbols[i] = "night";
      // } else {
      //   basic.symbols[i] = "";
      // }
    }
  
    return basic;
  };
  
  export const getClosestTimeWithIndex = (timeArray, date) => {
    const now = date ? new Date(date) : new Date();
    let closestIndex = 0;
    var skipped = true;
  
    timeArray.forEach((time, index) => {
      if (
        now.getHours() == new Date(time).getUTCHours() &&
        now.getDate() == new Date(time).getUTCDate()
      ) {
        closestIndex = index;
        skipped = false;
      }
    });
  
    if (skipped) {
      timeArray.forEach((time, index) => {
        if (now.getDate() == new Date(time).getUTCDate()) {
          closestIndex = index;
        }
      });
    }
    // Return both the closest time and its index
    return {
      time: timeArray[0],
      index: 0,
    };
  };
  
  function directionToDegree(direction) {
    switch (direction) {
      case "N":
        return 0;
      case "NE":
        return 45;
      case "E":
        return 90;
      case "SE":
        return 135;
      case "S":
        return 180;
      case "SW":
        return 225;
      case "W":
        return 270;
      case "NW":
        return 315;
      default:
        return null; // For invalid input
    }
  }
  
  function deleteEntriesBeforeToday(data) {
    // Get today's date and clear the time part to compare only dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Filter out entries with datetime before today
    return data.filter((entry) => {
      // Parse the entry's datetime to a Date object and clear the time part
      const entryDate = new Date(entry.datetime);
      entryDate.setHours(0, 0, 0, 0);
  
      // Keep the entry if its date is today or in the future
      return entryDate.getTime() >= today.getTime();
    });
  }
  export const getModelAndParse = async (lat, lon, axios) => {
    if (lon && lat) {
      var data;
      // "2023-12-27T00:00:00Z",
      var body = {
        time: [],
        tcc: {
          0: [],
        },
        tp: {
          0: [],
        },
        rh: {
          0: [],
        },
        t: {
          0: [],
        },
        visibility: {
          0: [],
        },
        u: {
          0: [],
        },
        v: {
          0: [],
        },
        wspd: {
          0: [],
        },
        wdir: {
          0: [],
        },
        weather: {
          0: [],
        },
      };
      // var d = await axios.get("sus/modelrun");
      // data = d.data;
  
      // var r = await axios.post("sus/map/point", {
      //   model: "sus",
      //   modelrun: data.sus[0],
      //   lon: lon,
      //   lat: lat,
      // });
      try {
        // var baseurl = axios.defaults.baseURL.replace("v1/", "");
        // console.log(baseurl)
        const res2 = await axios.get(
          `https://cuaca.bmkg.go.id/api/df/v1/forecast/coord?lon=${lon}&lat=${lat}`
        );
        // console.log(res2.data, lon, lat);
        var datares = []; //deleteEntriesBeforeToday(res2.data)
        res2.data.data[0].cuaca.forEach((el) => {
          el.forEach((l) => {
            datares.push(l);
          });
        });
        datares.forEach((el) => {
          if (new Date(el.local_datetime) >= new Date()) {
            body.time.push(el.local_datetime.split(' ').join('T'));
            body.rh[0].push(el.hu);
            body.t[0].push(el.t);
            body.visibility[0].push(el.vs);
            body.v[0].push(el.vs);
            body.wdir[0].push(directionToDegree(el.wd_to));
            body.wspd[0].push(el.ws);
            body.weather[0].push(el.weather);
          }
        });
        return {
          raw: body,
          parsed: parseYrData({ data: body }),
        };
      } catch (error) {
        console.log(error);
      }
    } else {
      return {};
    }
  };
  
  export const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  
  // Function to calculate the distance between two points in latitude and longitude using the Haversine formula
  export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in kilometers
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // Distance in km
    return distance;
  };
  
  // Function to find the closest point
  export const findClosestPoint = (currentLocation, points) => {
    var minDist = Infinity;
    var closestPoint = null;
    points.features.forEach((point) => {
      var dist = getDistanceFromLatLonInKm(
        currentLocation.geometry.coordinates[1],
        currentLocation.geometry.coordinates[0],
        point.geometry.coordinates[1],
        point.geometry.coordinates[0]
      );
      if (dist < minDist) {
        minDist = dist;
        closestPoint = point;
      }
    });
  
    return closestPoint;
  };
  