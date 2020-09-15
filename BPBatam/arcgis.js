require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/BasemapToggle",
      "esri/widgets/BasemapGallery",
      "esri/widgets/Search",
      "esri/views/SceneView",
      "esri/widgets/CoordinateConversion"
    ],
function(Map, MapView, FeatureLayer,  BasemapToggle, BasemapGallery, Search, SceneView, CoordinateConversion) {

      var map = new Map({
//          topo-vector
        basemap: "topo-vector"
      });

      var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [104.053252, 1.130432],
        zoom: 10,
        wkid: 4326
      });

      //popup atribut tabel
      var popupswp = {
        "title": "SWP Daerah",
        "content": "<b>Nama:</b> {NAMOBJ}<br><b>Kode:</b> {FCODE}<br>"
      }

      // input feature layer untuk SWP (polygons)
      var swp = new FeatureLayer({
        url: "https://services8.arcgis.com/IZNPdYBN3NgLcqEF/arcgis/rest/services/Batas_Wilayah_Kerja/FeatureServer/0",
        outFields:["NAMOBJ","FCODE"],
        popupTemplate: popupswp
        });

      map.add(swp, 0);

        //popup atribut tabel
      var popupswp = {
        "title": "Jalan Batam",
        "content": "<b>Nama:</b> {name}<br><b>Panjang:</b> {Panjang}<br>"
      }

      // input feature layer untuk Jalan Batam (polygons)
      var jalanbatam = new FeatureLayer({
        url: "https://services8.arcgis.com/IZNPdYBN3NgLcqEF/arcgis/rest/services/jalan_batam_fix/FeatureServer/0",
        outFields:["name","Panjang"],
        popupTemplate: popupswp
        });

      map.add(jalanbatam, 0);

        //Widget Basemap
        var basemapGallery = new BasemapGallery({
            view: view,
            source: {
                portal: {
                    url: "http://www.arcgis.com",

                    // Load vector tile basemap group
                    useVectorBasemaps: true,
                },
                    }
                        });

//        // Add to the view
//        view.ui.add(basemapGallery, "top-right");

        //Add toggle down
        var basemapToggle = new BasemapToggle({
        view: view,
        secondMap: "hybrid"
        });

        view.ui.add(basemapToggle,"bottom-right");

        // Add Search widget
          var search = new Search({
            view: view,
            allPlaceholder: "Pengelolaan Lahan",
            sources: [
                {
                layer: swp,
                searchFields: ["NAMOBJ"],
                suggestionTemplate: "{NAMOBJ}",
                exactmatch:false,
                outfields:["*"],
                placeholder: "example: Sekupang",
                name:"SWP Batam",
                zoomScale: 10000,
                }
            ]
          });
        // Add to the map
          view.ui.add(search, "top-right");

        var checkdata = document.getElementById("swplayer");
        checkdata.addEventListener("change",function(){
        swp.visible = checkdata.checked;
        });
        var checkjalan = document.getElementById("jalanlayer");
        checkjalan.addEventListener("change",function(){
        jalanbatam.visible = checkjalan.checked;
        });


        //buat widget koordinat koordinat
        var koor = document.createElement("div");
            koor.id = "koor";
            koor.className="esri-widget esri-component";
            koor.style.padding = "7px 15px 5px";


        view.ui.add(koor);

        function showCoordinates (pt) {
            var titik = "Lat/Lon : " + pt.latitude.toFixed(3) + " / " + pt.longitude.toFixed(3);
            var point = { lat: pt.latitude.toFixed(3), lon: pt.longitude.toFixed(3)}
            koor.innerHTML = titik;
        }
      
        function extractCoordinate (pt) {
              return { lat: pt.latitude.toFixed(3), lng: pt.longitude.toFixed(3) }
        }
      
//         var coord = extractCoordinate(pt);
//         console.log(coord) menghasilkan { lat: pt.latitude.toFixed(3), lng: pt.longitude.toFixed(3) }

        view.watch(["stationary"], function(){
            showCoordinates(view.center);
        });

        view.on(["pointer-down", "pointer-move"], function(evt){
            showCoordinates(view.toMap({x: evt.x, y:evt.y}));
        });

        var koordinat = document.getElementById("latlong");
        koordinat.appendChild(koor);

        //Konversi Koordinat
        var convers = new CoordinateConversion({
            view:view
        });
        view.ui.add(convers, "bottom-left"); })


