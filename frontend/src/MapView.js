import React, { useState } from "react";
import Map, { Popup } from "react-map-gl";
import { DeckGL } from "@deck.gl/react";
import { ArcLayer } from "@deck.gl/layers";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

function MapView({ attacks }) {
  const [hoverInfo, setHoverInfo] = useState(null);

  const getMidpoint = (source, target) => {
    const lon = (source.lon + target.lon) / 2;
    const lat = (source.lat + target.lat) / 2;
    return [lon, lat];
  };

  const layers = [
    new ArcLayer({
      id: "arc-layer",
      data: attacks,
      getSourcePosition: d => [d.source.lon, d.source.lat],
      getTargetPosition: d => [d.target.lon, d.target.lat],
      getSourceColor: [255, 0, 0, 180],
      getTargetColor: [0, 255, 0, 180],
      strokeWidth: 2,
      pickable: true,
      autoHighlight: true,
      onHover: ({ object }) => {
        if (object) {
          const [lon, lat] = getMidpoint(object.source, object.target);
          setHoverInfo({ object, longitude: lon, latitude: lat });
        } else {
          setHoverInfo(null);
        }
      },
    }),
  ];

  const initialViewState = {
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
    pitch: 30,
    bearing: 0,
  };

  return (
    // Remove the duplicate panel and flex container - just return the map
    <div style={{ width: "100%", height: "100%" }}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
        style={{ width: "100%", height: "100%" }}
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v11"
        >
          {hoverInfo && (
            <Popup
              longitude={hoverInfo.longitude}
              latitude={hoverInfo.latitude}
              closeOnClick={false}
              closeButton={false}
              anchor="top"
            >
              <div style={{ fontSize: "12px" }}>
                <strong>{hoverInfo.object.type}</strong> attack<br />
                Severity: <em>{hoverInfo.object.severity}</em><br />
                {hoverInfo.object.source.country} ➔ {hoverInfo.object.target.country}
              </div>
            </Popup>
          )}
        </Map>
      </DeckGL>
    </div>
  );
}
export default MapView;
