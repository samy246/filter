import React, { useState, useEffect } from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyDw8-7POKl3AdrdvETv1H8u-8v76TNlao4");
Geocode.setLanguage("en");
Geocode.setLocationType("GEOMETRIC_CENTER");
Geocode.enableDebug();

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDw8-7POKl3AdrdvETv1H8u-8v76TNlao4&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={6}
    defaultCenter={{ lat: props?.latlng?.lat, lng: props?.latlng?.lng }}
    onClick={(e) => props.handleMapClick(e)}
  >
    {props.isMarkerShown && (
      <Marker
        position={{ lat: props?.latlng?.lat, lng: props?.latlng?.lng }}
        onClick={() => props.onMarkerClick}
      />
    )}
  </GoogleMap>
));
const MyFancyComponent = ({
  fucCall,
  selectedLocation,
  get_lat_lng,
  latLonSet,
}) => {
  const [isMarkerShown, setIsMakerShown] = useState(false);
  const [latlng, setLatlng] = useState({
    lat: 15.431784870997344,
    lng: 100.85050886721454,
  });
  useEffect(() => {
    delayedShowMarker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  useEffect(() => {
    setLatlng({
      lat: latLonSet?.lat ? latLonSet?.lat : 15.431784870997344,
      lng: latLonSet?.lng ? latLonSet?.lng : 100.85050886721454,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latLonSet]);

  const handleMapClick = (event) => {
    setLatlng({
      lat: event?.latLng.lat(),
      lng: event?.latLng.lng(),
    });
    get_lat_lng({
      lat: event?.latLng.lat(),
      lng: event?.latLng.lng(),
    });
    var lat = event?.latLng.lat().toString();
    var lng = event?.latLng.lng().toString();
    getAddress(lat, lng);
  };
  const getAddress = (lat, lng) => {
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let city, state, district, country;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_2":
                district = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
              default:
                break;
            }
          }
        }
        var data = {
          city: city,
          state: state,
          district: district,
          country: country,
          address: address,
        };
        fucCall(data);
      },
      (error) => {}
    );
    setTimeout(() => {
      setIsMakerShown(true);
    }, 1000);
  };

  const delayedShowMarker = () => {
    if (selectedLocation === "my_location") {
      navigator.geolocation.getCurrentPosition(function (position) {
        getAddress(
          position?.coords?.latitude?.toString(),
          position?.coords?.longitude?.toString()
        );
        setLatlng({
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
        });
        get_lat_lng({
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
        });
      });
    } else {
      setTimeout(() => {
        setIsMakerShown(true);
      }, 1000);
    }
  };
  const handleMarkerClick = () => {
    setIsMakerShown(false);
    delayedShowMarker();
  };
  return (
    <MyMapComponent
      isMarkerShown={isMarkerShown}
      onMarkerClick={handleMarkerClick}
      latlng={latlng}
      handleMapClick={handleMapClick}
    />
  );
};

export default MyFancyComponent;
