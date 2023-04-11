/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Polyline,
} from "react-google-maps";
import Geocode from "react-geocode";
import red from "../../../assets/images/calendar/calendar.svg";

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
    // defaultZoom={12}
    // defaultCenter={{ lat: props?.latlng?.lat, lng: props?.latlng?.lng }}
    center={{ lat: props?.latlng?.lat, lng: props?.latlng?.lng }}
  >
    <DirectionsRenderer
      directions={props?.directions}
      options={{ suppressMarkers: true }}
      Polyline={{
        path: props?.directions,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      }}
    />
    {props.isMarkerShown && (
      <>
        <Marker
          icon="http://maps.google.com/mapfiles/kml/paddle/blu-blank.png"
          position={{ lat: props?.latlng?.lat, lng: props?.latlng?.lng }}
        />
        <Marker
          icon="http://maps.google.com/mapfiles/kml/paddle/blu-blank.png"
          position={{
            lat: props?.selection?.invoice?.lat,
            lng: props?.selection?.invoice?.lng,
          }}
        />
      </>
    )}
  </GoogleMap>
));

const MyFancyComponent = ({ latLonSet, selection }) => {
  const [directions, setDirections] = useState(null);
  useEffect(() => {
    if (latLonSet && selection) {
      const directionsService = new google.maps.DirectionsService();

      const origin = { lat: latLonSet?.lat, lng: latLonSet?.lng };
      const destination = {
        lat: selection?.invoice?.LATITUDE,
        lng: selection?.invoice?.LONGITUDE,
      };

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections({
              directions: result,
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [latLonSet, selection]);
  const [latlng, setLatlng] = useState({
    lat: 15.431784870997344,
    lng: 100.85050886721454,
  });
  const [isMarkerShown, setIsMakerShown] = useState(false);
  useEffect(() => {
    setLatlng({
      lat: latLonSet?.lat,
      lng: latLonSet?.lng,
    });
    setTimeout(() => {
      setIsMakerShown(true);
    }, 1000);
  }, [latLonSet]);
  return (
    <MyMapComponent
      isMarkerShown={isMarkerShown}
      directions={directions?.directions}
      selection={selection?.invoice}
      latlng={latlng}
      // fillColor="green"
      // style={{ fillColor: "green", color: "green" }}
    />
  );
};

export default MyFancyComponent;
