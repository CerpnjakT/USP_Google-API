






//////map
var markers = [];
var map;
var heatmap;
var InforObj = [];
var centerCords = {
    lat: 1.351784,
    lng: 103.818200
};



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

    
    var legendTitle = 'value name'
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: centerCords,
        mapId: '2e3ea0c32b743370'
    });
    
    ShowMarkers();
      //hide all the legends
    //document.getElementById("legend-circles").style.display = "none";
    

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
        /* detach the info-window from the marker ... undocumented in the API docs */
        InforObj[0].set("marker", null);
        /* and close it */
        InforObj[0].close();
        /* blank the array */
        InforObj.length = 0;
    }
}



function DisplayData(map, jsonDataPath, property, legendTitle){
       var legendValues = [];
    map.data.loadGeoJson(jsonDataPath, {}, function(feature) { 
        map.data.forEach(function(feature){
        legendValues.push(feature.getProperty(property));
        })
        DisplayLegend(map,legendValues, legendTitle);
        });

    map.data.setStyle(function(feature){  
        var svgCircle = {
            path: "M -2 0 a 2,2 0 1,1 4, 0 a 2,2 0 1,1 -4,0",
            fillColor: 'yellow',
            fillOpacity: 0.9,
            strokeWeight: 0,
            rotation: 0,
            scale: feature.getProperty('weight')*2,
            anchor: new google.maps.Point(0,0)
            };
        //legendValues.push(feature.getProperty('weight'));
        return{icon: svgCircle};
    });

    /*map.data.setStyle({
        icon: './assets/marker.png',
      });
      new google.maps.LatLng(103.74710045407312,1.3267064912460995), 
        new google.maps.LatLng(103.74693813033042, 1.3346582095737887),
        new google.maps.LatLng(103.73609345668541, 1.3458016569619673)
      */
}
function DisplayHeatMap(map){
    var heatMapData = [];

    var weightValues = [];
    var coordinates = [];
    var weight= 'weight';
    jsonDataPath = './assets/data_points.json'


    map.data.loadGeoJson(jsonDataPath, {}, function(feature){ 
        map.data.forEach(function(feature){
        weightValues.push(feature.getProperty("weight"));
        let geo = feature.getGeometry();
        geo.forEachLatLng(function(LatLng){
            let coordinate = [LatLng.lat(),LatLng.lng()]
            coordinates.push(LatLng);
            console.log(LatLng);
        })
        });
        for(var i = 0; i< coordinates.length;i++){
            let dataPoint = {
                location: coordinates[i],
                weight: weightValues[i]
            } 
                
            
            heatMapData.push(dataPoint);
        }
        console.log(heatMapData);
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatMapData
          });
          heatmap.setMap(map);
        });


        
       console.log(heatMapData);
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatMapData
          });
          heatmap.setMap(map);


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
    map.data.setStyle({visible: false});
    if(markers.length>0){deleteMarkers();};

    jsonDataPath= './assets/data_points.json'
    property= "weight";
    legendTitle= "Circle Radius";
    
    DisplayData(map, jsonDataPath, property, legendTitle);
    document.getElementById("legend-circles").style.display = "block";
}

function ShowMarkers(){
    map.data.setStyle({visible: false});
    document.getElementById("legend-circles").style.display = "none";
    addMarkerInfo(); 
}

function ShowHeatmap(map){
    
    DisplayHeatMap(map);
}


function MapToggle(){
    var mapType = document.getElementById("map-menu").value;
    console.log(mapType);
    if(mapType == "1"){ShowCircles();}
    else if(mapType == "2"){ShowMarkers();}
    else{map.data.setStyle({visible: false});
        document.getElementById("legend-circles").style.display = "none";
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






