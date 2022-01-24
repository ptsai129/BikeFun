let map = L.map('map').setView([24.9430016,121.2153856], 16);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicHRzYWkxMjkiLCJhIjoiY2t5cmYwYXoxMHRlcDJ6bnlvam4xcDNkciJ9.k9CiapfGpvUQEXCHmQoKHg'
}).addTo(map);

L.marker([24.9430016, 121.2153856]).addTo(map)
    .bindPopup('桃園高鐵站')
    .openPopup();