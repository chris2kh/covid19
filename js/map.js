let map;
let geojson;
let info = L.control();
let legend = L.control({position: 'bottomright'});
let threshold;

function getColor(cases) {
    for (let color in threshold) {
        if(cases >= threshold[color]) {
            return color;
        }
    }
}

function style(feature) {
                return {
        fillColor: getColor(feature.properties.cases),
        weight: 0.5,
        opacity: 1,
        color: '#222228',
        dashArray: '2',
        fillOpacity: 0.5
    };
}

function highlightFeature(e) {
    let layer = e.target;
    layer.setStyle({
            weight: 4,
            color: '#444',
            dashArray: '',
            fillOpacity: 1
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
}

export function draw(city, newThreshold) {
    threshold = newThreshold;
    map = L.map('map').setView({lon: city.lon, lat: city.lat},14);
    geojson = L.geoJSON(city, {style: style, onEachFeature: onEachFeature}).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
    // show the scale bar on the lower left corner
    L.control.scale().addTo(map);
}

export function update() {
    geojson.resetStyle();
}

export function setThreshold(newThreshold) {
    threshold = newThreshold;
}

export function changeLegend(newThreshold) {
    // threshold = newThreshold;
    legend.addTo(map);
}

export function drawInfoPanel() {
    info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info');
                this.update();
                return this._div;
    };
    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = (props ?
        '<h4>District</h4>'+'<b>' + props.name + '</b><br />' + Math.round(props.cases) + ' ' 
        + document.getElementById("category").value
        : 'hover your mouse over a district');
    };
    info.addTo(map);
}

export function drawLegend() {
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let grades = Object.values(threshold).sort( (a,b) => a -b);

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
}