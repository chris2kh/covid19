import {myCity} from '../data/coordinates.js';
import * as model from './model.js';
import * as map from './map.js';

let currentDay = 0;
let threshold = model.infectedThreshold;
let dailyData = model.infections;

function changeCategory() {
    let category = document.getElementById("category").value;
    if (category === "infections") {
        threshold = model.infectedThreshold;
        dailyData = model.infections;
    }
    else if (category === "ICU patients") {
        threshold = model.ICUthreshold;
        dailyData = model.ICUpatients;
    }
    map.setThreshold(threshold);
    map.changeLegend();
    update(currentDay);
}

function next() {
     if (currentDay < model.maxDays) {
        update(++currentDay);
    }
}

function back() {
    if (currentDay > 0) {
        update(--currentDay);
    }
}

function setCases(currentDay) {
    for (let district of myCity.features) {
        district.properties.cases = dailyData[district.properties.name][currentDay]; 
    }
}

function update(currentDay) {
    setCases(currentDay);
    let total = Math.round(model.sum(dailyData, currentDay));
    document.getElementById("total").innerText = total + "  " + document.getElementById("category").value
    document.getElementById("dayNumber").innerText = "day  " + (currentDay + 1);
    map.update();
}

map.draw(myCity, threshold);
map.drawInfoPanel();
map.drawLegend();
update(currentDay) // start

document.getElementById("category").addEventListener('change', changeCategory, false);
document.getElementById("back").addEventListener('click', back, false);
document.getElementById("next").addEventListener('click', next, false);
