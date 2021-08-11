mapboxgl.accessToken =
    'pk.eyJ1IjoiamF5ZCIsImEiOiJUTjM5bGpNIn0._B2eAOBJiK2-xWKjYnfbyw'; //Put your Mapbox Public Access token here
var boundList = {
    EB: "East Bound",
    WB: "West Bound",
    NB: "North Bound",
    SB: "South Bound"
}
var popup //Popup in global scope so events can access it
var colorList = [
    [1, '#fcc5c0'],
    [51, '#fa9fb5'],
    [101, '#f768a1'],
    [151, '#dd3497'],
    [201, '#ae017e'],
    [251, '#7a0177']
];
var CurrentYear = 2021
var CurrentMonth = 5
document.getElementById('year').textContent= "Year: " +CurrentYear

//Load a new map in the 'map' HTML div
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-123.488802, 48.454731],
    zoom: 9.83
});
//Load the vector tile source of cycling volume
map.on('load', function() {
    map.addSource('cycling-volume', {
        type: 'geojson',
        data: 'static/peakHour.json', //Mapbox tileset Map ID
        attribution: '<a href="about">© CRD</a>'
    });
    //Add the circle layer to the map
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.addLayer({
        'id': 'cycling_volume',
        'source': 'cycling-volume', //name of source
        "filter": ["all", ["==", "Year", CurrentYear],
            ["==", "Month", CurrentMonth]
        ],
        //'source-layer': 'PeakHour-99cunt', //name of the layer in the tileset
        'type': 'circle',
        'paint': {
            'circle-color': {
                property: 'peakHour',
                type: 'interval',
                stops: colorList
            },
            'circle-radius': {
                'stops': [
                    [8, 2],
                    [13, 10],
                    [15, 15],
                    [17, 20]
                ]
            },
            'circle-opacity': 1
        }
    });
    // the feature, with HTML description from its properties
});
map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['cycling_volume']
    });
    // if the features have no info, return nothing
    if (!features.length) {
        return;
    }
    var feature = features[0];
   
        //Combine Both svg nodes under one parent element
        var popUpDiv = document.createElement("div")
        popUpDiv.innerHTML = '<div><h3>' + '#' + feature.properties[
                'countID'] + ' ' + feature.properties[
                'onStreet'] + " " + feature.properties[
                'location'] + " of " + feature.properties[
                'xStreet'] + "</h3></br><span class='peakHour'>Peak Hour:" + feature.properties[
                'peakHour'] + '<span>' + '<a href="/chart/' +
            feature.properties['countID'] +
            '" target="_blank" class="button button-popup">View Hourly Chart</a></div><div style="clear: both;"></div>'
 
        popup = new mapboxgl.Popup({
                closeOnClick: true
            })
            .setLngLat(feature.geometry.coordinates)
            .setDOMContent(popUpDiv)
            .addTo(map);
    
    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'
    map.on('mousemove', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['cycling_volume']
        });
        map.getCanvas()
            .style.cursor = (features.length) ? 'pointer' : '';
    });
});

//Select The Year of the Count
function changeYear(ev){
    CurrentYear = parseInt(ev.target.value,10);
    try {
        popup.remove()
        
    } catch (e) {}
    document.getElementById('year').textContent = "Year: " +CurrentYear
    var UpdateFilter = ["all", ["==", "Year", CurrentYear],
        ["==", "Month", CurrentMonth]
    ]
    map.setFilter('cycling_volume', UpdateFilter);
}
//IE doesn't work with input
if(document.onmspointerup === undefined) {
    document.getElementById('slider')
    .addEventListener('input', function(event){ changeYear(event)});
} else {
document.getElementById('slider')
    .addEventListener('change',function(event){ changeYear(event)});

}   
//Select the Month of the Count
document.getElementById('buttons-month')
    .addEventListener('click', function(event) {
        CurrentMonth = parseInt(event.target.id.substr('button-'.length));
        try {
            popup.remove()
        } catch (e) {}
        var ul = document.getElementById('buttons-month');
        var button = ul.getElementsByTagName('li');
        for (var i = 0; i < button.length; i++) {
            button[i].className = "button"
        }
        event.target.className += " selected"
        var UpdateFilter = ["all", ["==", "Year", CurrentYear],
            ["==", "Month", CurrentMonth]
        ]
        map.setFilter('cycling_volume', UpdateFilter);
    });