function initialize() {
  const fenway = { lat: 1.121489, lng: 104.059261 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: fenway,
    zoom: 14
  });
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: fenway,
      pov: {
        heading: 0,
        pitch: 10
      }
    }
  );
  map.setStreetView(panorama);
}
