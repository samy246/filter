import React, {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import moment from "moment";
import "./map.scss";
import { car } from "./map.image";
import database from "../../../firebase";

function MapComponent({ delat, delng, truckloc }) {
  const [latLonSet, setLatLonSet] = useState({});
  const [origin, setorigin] = useState({
    lat: parseFloat(delat),
    lng: parseFloat(delng),
  });

  useEffect(() => {
    locationcallback();
  }, []);

  useEffect(async () => {
    setInterval(() => {
      locationcallback();
    }, 30000);
  }, []);


  const locationcallback = async () => {
    // debugger;
    const mobile = truckloc?.drivermobile;
    const routeCode = truckloc?.routecode;
    // console.log(mobile, routeCode, "test");
    const date = moment(new Date()).format("YYYYMMDD");
    const itemRef = `locationTrackingInterval-` + date + mobile + routeCode;
    // console.log("react hook is called", itemRef);
    const collectionRef = database.ref(itemRef);
    collectionRef.limitToLast(1).on("child_added", (snapshot) => {
      const data = snapshot.val();
    });
    collectionRef.once("value", (snapshot) => {
      const data = snapshot.val();
      let key = Object.values(data).sort().pop();
      setLatLonSet({
        lat: key.lat,
        lng: key.long,
      });
    });
  };


  const markerOption = {
    path: car,
    scale: 0.5,
    strokeColor: "white",
    strokeWeight: 0.1,
    fillOpacity: 1,
    // fillColor: "#57c36f",
    fillColor: "#2b2b2b",
    rotation: undefined,
  };
  const mapRef = useRef();

  const centerLatLng = useMemo(
    () => ({
      lat: origin?.lat,
      lng: origin?.lng,
    }),
    [origin]
  );

  const carMarker = useMemo(
    () => ({ lat: latLonSet?.lat, lng: latLonSet?.lng }),
    [latLonSet]
  );

  const options = useMemo(() => {
    return {
      mapId: "4641550cf13bc112",
      disableDefaultUI: true,
      clickableIcons: false,
    };
  }, []);
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  // Direction Logic
  const [directions, setDirections] = useState();
  const fetchDirections = (position) => {
    if (!position) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: position,
        destination: centerLatLng,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          console.log("this is direction");
          setDirections(result);
        }
      }
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (carMarker) {
        fetchDirections(carMarker);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [carMarker]);

  return (
    <GoogleMap
      zoom={12}
      center={centerLatLng}
      mapContainerClassName="map-container"
      options={options}
      onLoad={onLoad}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              zIndex: 50,
              strokeColor: "#37bfa7",
              strokeWeight: 5,
            },
          }}
        />
      )}
      <MarkerF icon={markerOption} position={carMarker}></MarkerF>
      <MarkerF position={centerLatLng}></MarkerF>
    </GoogleMap>
  );
}

export default MapComponent;
