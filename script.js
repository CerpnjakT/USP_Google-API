///////////////////////////////////////////////////////////////////////////////////////
///////slider/////
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}









//////map
var markers = [];
var map;
            var InforObj = [];
            var centerCords = {
                lat: 24.698217,
                lng: 46.696950
            };
            var markersOnMap = [{
                    placeName: "Ar Rayyan",
                    LatLng: [{
                        lat: 24.704607,
                        lng: 46.775405
                    }],
                    area: 20000,
                    price: 100000,
                    data3: "Zone A"
                },
                {
                    placeName: "Laban",
                    LatLng: [{
                        lat: 24.647083,
                        lng: 46.615789
                    }],
                    area: 40000,
                    price: 130000,
                    data3: "Zone C"
                },
                {
                    placeName: "Alyasmin",
                    LatLng: [{
                        lat: 24.820067,
                        lng: 46.662863
                    }],
                    area: 13000,
                    price: 60000,
                    data3: "Zone D"
                },
                {
                    placeName: "As Sulimaniyah",
                    LatLng: [{
                        lat: 24.698217,
                        lng: 46.696950
                    }],
                    area: 80000,
                    price: 190000,
                    data3: "Zone B"
                }
            ];

            window.onload = function () {
                initMap();
                
            };

            function addMarkerInfo() {

                for (var i = 0; i < markersOnMap.length; i++) {

                    if(markersOnMap[i].area < areaSlider.value && markersOnMap[i].price < priceSlider.value){
                        var contentString = '<div id="content"><h1>' + markersOnMap[i].placeName +
                            '</h1><p>Lorem ipsum dolor sit amet, vix mutat posse suscipit id, vel ea tantas omittam detraxit.</p>'+
                            '<p> <strong>Area:</strong><br> '+markersOnMap[i].area + '<span> m2</span>' + '</p><p> <strong>Price:</strong><br> '+
                            markersOnMap[i].price + '<span> SR</span>' + '</p><p><strong>Zone:</strong><br> '+markersOnMap[i].data3 + '</p>'+
                            '<button type="button" id=buttonLink>See Massing</button>' +'</div>';

                        const marker = new google.maps.Marker({
                            position: markersOnMap[i].LatLng[0],
                            map: map,
                            icon: './assets/marker.png'
                        });

                        const infowindow = new google.maps.InfoWindow({
                            content: contentString,
                            maxWidth: 300
                            
                        });
                    
                        marker.addListener('click', function () {
                            closeOtherInfo();
                            infowindow.open(marker.get('map'), marker);
                            InforObj[0] = infowindow;
                        });
                        
                        markers.push(marker);
                    }
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

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: centerCords,
        mapId: '2e3ea0c32b743370'
    });
    //marker.setIcon('./assets/marker.png');
    
    addMarkerInfo();

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





