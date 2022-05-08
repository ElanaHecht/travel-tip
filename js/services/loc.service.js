import { storageService } from './storage.service.js';
import { utilService } from './util.service.js';

export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
    addInputLoc
};

const STORAGE_KEY = 'locsDB';
const locs = [];

function getLocs() {
    return new Promise((resolve) => {
        resolve(locs);
    });
}

function addInputLoc(input) {

    _createLoc(input.name, input.lat, input.lng)
}


function addLoc(loc) {
const {lat, lng} = loc
    const locName = document.querySelector('input[name=location]').value
    _createLoc(locName, lat, lng)
}

function deleteLoc(locId) {
    const locIdx = locs.findIndex(loc => {
        return locId === loc.id;
    });
    locs.splice(locIdx, 1);
    storageService.save(STORAGE_KEY, locs);
}

function _createLoc(name, lat, lng) {
    const location = {
        id: utilService.makeId(),
        name,
        lat,
        lng,
        weather: 'chilly',
        createdAt: Date.now(),
        updatedAt: Date.now()
    } 
    locs.unshift(location)
    storageService.save(STORAGE_KEY, locs)
}


