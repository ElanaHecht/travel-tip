export const mapService = {
    initMap,
    addMarker,
    panTo,
    findPlace,
    getCurrLoc,
    getWeather
}

import { locService } from "./loc.service.js";

const W_KEY = 'e898b4ba86009c87130bc0974a1a9761'

var gMap;
var gClickedLoc = {}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            console.log('Map!', gMap);
        })
        .then(() => {
            let infoWindow = new google.maps.InfoWindow({
                content: 'Hello!',
                position: { lat, lng }
            });
            infoWindow.open(gMap);
            infoWindow.close();

            gMap.addListener("click", (mapsMouseEvent) => {
                gClickedLoc = mapsMouseEvent.latLng.toJSON();
                const contentStr = '<h4>What is the name of this location?</h4>' + '<form onsubmit="onAddLoc(event)">' + '<input name="location" placeholder="Name of location">' + '</form>'
                infoWindow = new google.maps.InfoWindow({
                    content: contentStr,
                    position: mapsMouseEvent.latLng,
                });
                infoWindow.open(gMap);
            });
        })
}

function getCurrLoc() {
    return gClickedLoc
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDXNxZYGzQXRBraA5rsPqLrOhvqO8pHxA8';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function findPlace(value) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyDXNxZYGzQXRBraA5rsPqLrOhvqO8pHxA8`)
        .then(res => {
            console.log(res.data)
            locService.addInputLoc({ lat: res.data.results[0].geometry.location.lat, lng: res.data.results[0].geometry.location.lng, name: value });
            return res.data.results[0].geometry.location;
        });
}



function getWeather({ lat, lng }) {

    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${W_KEY}`)
}