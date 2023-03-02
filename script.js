
//////map
var dataLoaded = false;
var features = null;
var markers = [];
var map;
var heatmap = null;
var InforObj = [];
var centerCords = {
    lat: 1.351784,
    lng: 103.818200
};
const heatmapGradient = [
    "rgba(249, 240, 108, 0)",
    "rgba(249, 240, 108, 1)",
    "rgba(210, 234, 243, 1)",
    "rgba(244, 153, 193, 1)",
    "rgba(238, 60, 150, 1)"
  ];


var markersOnMap = [{
        placeName: " Basketball Playground",
        LatLng: [{
            lat: 1.404979,
            lng: 103.906288
        }],
        number: 20000,
        area: "Punggol",
        audio: "sample.mp3",
        
    },
    {
        placeName: "Sports Center",
        LatLng: [{
            lat: 1.338064,
            lng: 103.694911
        }],
        number: 300,
        image: "sample.gif",
        area: "Jurong",
        
    },
    {
        placeName: "Yunnan Garden",
        LatLng: [{
            lat: 1.342925,
            lng: 103.685330
        }],
        number: 20000,
        video: "video-sample.mp4",
        area: "Jurong",
        
    },
    {
        placeName: "Waterway Park",
        LatLng: [{
            lat: 1.411155,
            lng: 103.904931
        }],
        number: 560,
        image: "punggol-waterway-park.jpg",
        area: "Punggol",
        
    }
];

window.onload = function () {
    initMap();  
};


function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: centerCords,
        mapId: 'fea25608858c0b5b'
    });

    

    ShowMarkers();
      //hide all the legends
    document.getElementById("legend-heatmap").style.display = "none";
   
      
     

}


function addMarkerInfo() {

    for (var i = 0; i < markersOnMap.length; i++) {

            let = image = "";
            let audio = "";
            let video = "";

            if( markersOnMap[i].image != null){
                image = '<img class="info-image" src="./assets/' + markersOnMap[i].image + '"></img>'
            }
            if( markersOnMap[i].audio != null){
                audio = '<audio controls><source type="audio/mpeg" src="./assets/' + markersOnMap[i].audio + '"></audio>'
            }
            if( markersOnMap[i].video != null){
                video = '<video class="info-image" controls><source src="./assets/'+markersOnMap[i].video+'" type="video/mp4"></video>'  
            }

            var contentString = '<div id="content">'+
                image + video + audio +
            '<h1>' + markersOnMap[i].placeName + '</h1>'+
            '<p> <strong>Area:</strong><br> '+markersOnMap[i].area + '</p>'+
            '<p> <strong>Number Value:</strong><br> '+ markersOnMap[i].number + '</p>';
                
            const marker = new google.maps.Marker({
                position: markersOnMap[i].LatLng[0],
                map: map,
                icon: './assets/marker.png'
            });

            const infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 350
                
            });
        
            marker.addListener('click', function () {
                closeOtherInfo();
                infowindow.open(marker.get('map'), marker);
                InforObj[0] = infowindow;
            });
            
            markers.push(marker);
        }
    }
            

function closeOtherInfo() {
    if (InforObj.length > 0) {
        
        InforObj[0].set("marker", null);
        
        InforObj[0].close();
        
        InforObj.length = 0;
    }
}



function DisplayData(map, jsonDataPath, property){
    dataLoaded = true; 
    map.data.loadGeoJson(jsonDataPath, {}, function(feature) { 
        map.data.setStyle(function(feature){  
            var svgCircle = {
                path: "M -2 0 a 2,2 0 1,1 4, 0 a 2,2 0 1,1 -4,0",
                fillColor: 'yellow',
                fillOpacity: 0.9,
                strokeWeight: 0,
                rotation: 0,
                scale: feature.getProperty(property)*2,
                anchor: new google.maps.Point(0,0)
                };
            return{icon: svgCircle};
        });
    });
};


function DisplayHeatMap(map){
    var legendTitle= "Heatmap weight";
    jsonDataPath= './assets/data_points.json'
    var heatMapData = [];
    var legendValues = [];
    var weightValues = [];
    var coordinates = [];
    var weight= 'weight';
    var radius= 50;
    
    map.data.loadGeoJson(jsonDataPath, {}, function(feature){ 
        map.data.forEach(function(feature){
        weightValues.push(feature.getProperty(weight));
        legendValues.push(feature.getProperty(weight));
        let geo = feature.getGeometry();
        geo.forEachLatLng(function(LatLng){
            let coordinate = [LatLng.lat(),LatLng.lng()]
            coordinates.push(coordinate);
        })
        DisplayLegend(map,legendValues, legendTitle);
        });
        
        for(var i = 0; i< coordinates.length;i++){
            let dataPoint = {
                location: new google.maps.LatLng(coordinates[i][0],coordinates[i][1]),
                weight: weightValues[i]*3
            } 

            heatMapData.push(dataPoint);
        }
        console.log(heatMapData);
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatMapData
          });
          heatmap.setMap(map);
          heatmap.set('radius', radius);
          heatmap.set("gradient", heatmapGradient);
    });
    
}

function RemoveData(features){
    for (var i = 0; i < features.length; i++){
      map.data.remove(features[i]);
  }
}


function DisplayLegend(map, legendValues, legendTitle){
    var min = document.getElementById('min');
    var max = document.getElementById('max');
    let text = document.getElementById("legend-title");

    legendValues.sort(function(a,b){
        return a-b;
    })
    console.log(legendValues);
    let minValue = legendValues[0];
    let maxValue = legendValues[legendValues.length -1];
    text.innerHTML = legendTitle;
    min.innerHTML = minValue;
    max.innerHTML = maxValue;
}

function ShowCircles(){
    //first hide all the other data
    map.data.setStyle({visible: true});
    
    if(heatmap){heatmap.setMap(null)};
    if(markers.length>0){deleteMarkers();};
    document.getElementById("legend-heatmap").style.display = "none";

    jsonDataPath= './assets/data_points.json'
    property= "weight";
    DisplayData(map, jsonDataPath, property);
    
}

function ShowMarkers(){
    map.data.setStyle({visible: false});
    if(heatmap){heatmap.setMap(null)};
    document.getElementById("legend-heatmap").style.display = "none";
    addMarkerInfo(); 
}

function ShowHeatmap(){
    map.data.setStyle({visible: false});
    document.getElementById("legend-heatmap").style.display = "block";
    if(markers.length>0){deleteMarkers();};
    if(heatmap){heatmap.setMap(map);}
    else{
    DisplayHeatMap(map);
    }
}


function MapToggle(){
    var mapType = document.getElementById("map-menu").value;
    console.log(mapType);
    if(mapType == "1"){ShowCircles();}
    else if(mapType == "2"){ShowMarkers();}
    else if(mapType == "3"){ShowHeatmap();}
    else{map.data.setStyle({visible: false});
        document.getElementById("legend-heatmap").style.display = "none";
        };
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
  }






