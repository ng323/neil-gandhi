
var satellitemap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ", {
    attribution: "Map data &copy;" +
      "<a href='http://openstreetmap.org'>OpenStreetMap</a> contributors," +
      "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>," +
      "Imagery &copy; <a href='http://mapbox.com'>Mapbox</a>",
    maxZoom: 18
  }
);


var outdoors = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ", {
    attribution: "Map data &copy;" +
      "<a href='http://openstreetmap.org'>OpenStreetMap</a> contributors," +
      "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>" +
      "Imagery &copy; <a href='http://mapbox.com'>Mapbox</a>",
    maxZoom: 18
  }
);

var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=" +
  "pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ", {
    attribution: "Map data &copy;" +
      "<a href='http://openstreetmap.org'>OpenStreetMap</a> contributors," +
      "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>" +
      "CC-BY-SA</a>" +
      "Imagery &copy;" +
      "<a href='http://mapbox.com'>Mapbox</a>",
    maxZoom: 18
  });

var map = L.map("mapid", {
  center: [40.7, -94.5],
  zoom: 3,
  layers: [satellitemap, outdoors, graymap]
});

graymap.addTo(map);

var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();
var timelineLayer = new L.LayerGroup();


var baseMaps = {
  Satellite: satellitemap,
  Grayscale: graymap,
  Outdoors: outdoors
};

var overlays = {
  "Earthquake Timeline": timelineLayer,
  "Tectonic Plates": tectonicplates,
  "All Earthquakes": earthquakes
};

L.control.layers(baseMaps, overlays).addTo(map);

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
  function(data) {
    var getInterval = function(quake) {
      return {
        start: quake.properties.time,
        end: quake.properties.time + quake.properties.mag * 1800000 * 2
      };
    };

    var timelineControl = L.timelineSliderControl({
      formatOutput: function(date) {
        return new Date(date).toString();
      },
      steps: 2000
    });

    var timeline = L.timeline(data, {
      getInterval: getInterval,
      pointToLayer: function(layerData, latlng) {
        return L.circleMarker(latlng, {
          radius: layerData.properties.mag * 6,
          color: getColor(layerData.properties.mag),
          opacity: 0.75,
          fillOpacity: 0.75,
          weight: 0
        }).bindPopup(
          "Magnitude: " +
          layerData.properties.mag +
          "<br>Location: " +
          layerData.properties.place
        );
      }
    });
    timelineControl.addTo(map);
    timelineControl.addTimelines(timeline);
    timeline.addTo(timelineLayer);
    timelineLayer.addTo(map);

    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }

    function getColor(magnitude) {
      switch (true) {
        case magnitude > 5:
          return "#ea2c2c";
        case magnitude > 4:
          return "#ea822c";
        case magnitude > 3:
          return "#ee9c00";
        case magnitude > 2:
          return "#eecc00";
        case magnitude > 1:
          return "#d4ee00";
        default:
          return "#98ee00";
      }
    }

    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }

      return magnitude * 4;
    }


    L.geoJson(data, {

      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          "Magnitude: " +
          feature.properties.mag +
          "<br>Location: " +
          feature.properties.place
        );
      }

    }).addTo(earthquakes);

    var legend = L.control({
      position: "bottomright"
    });

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");

      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];

      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };

    legend.addTo(map);

    d3.json(
      "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
      function(platedata) {
        L.geoJson(platedata, {
          color: "orange",
          weight: 2
        }).addTo(
          tectonicplates
        );
        tectonicplates.addTo(map);
      }
    );
  }
);
