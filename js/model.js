import {infections as inf, ICUpatients as ICU} from '../data/dailyData.js';

export let infections = inf ;
export let ICUpatients = ICU;

export let infectedThreshold = {
    '#e84258' : 50,
    '#fd8060' : 25,
    '#fee191' : 10,
    '#b0d8a4' : 0
}

export let ICUthreshold = {
    '#ff71b2' : 20,
    '#ffa0ad' : 12,
    '#509be1' : 7,
    '#d3e9ff' : 0
}

export let maxDays = infections["Aeropuerto"].length - 1; // the length of any district
                                                          // they all have the same number of days

export function sum(dailyCases, currentDay) {
    let total =0;
    for (let district in dailyCases) {
        total += dailyCases[district][currentDay];
    }
    return total;
}