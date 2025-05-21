import React, { useEffect, useRef } from "react";
import Globe from "globe.gl";
import io from "socket.io-client";

function GlobeView({ onNewAttack }) {
  const globeRef = useRef(null);
  const globeInstance = useRef(null);
  const arcsRef = useRef([]);
  const socket = useRef(null);

  useEffect(() => {
    const globeEl = globeRef.current; // ✅ Safe reference for cleanup

    // Only create one Globe instance
    if (!globeInstance.current && globeEl) {
      globeInstance.current = Globe()(globeEl)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .arcColor(() => 'red')
        .arcAltitude(() => 0.2)
        .arcStroke(() => 1.5)
        .arcDashLength(() => 0.3)
        .arcDashGap(() => 0.15)
        .arcDashInitialGap(() => Math.random())
        .arcDashAnimateTime(() => 4000)
        .arcsTransitionDuration(0)
        .arcLabel(d => `${d.type} (${d.severity})\n${d.source.country} → ${d.target.country}`)
        .backgroundColor('#000');
    }

    socket.current = io("http://localhost:3001");

    socket.current.on("new_attack", (attack) => {
      const {
        source: { lat: startLat, lon: startLng },
        target: { lat: endLat, lon: endLng },
      } = attack;

      if (
        [startLat, startLng, endLat, endLng].some(
          (v) => typeof v !== "number" || isNaN(v)
        )
      ) {
        console.warn("Invalid coordinates for arc, skipping:", attack);
        return;
      }

      const arcData = {
        ...attack,
        startLat,
        startLng,
        endLat,
        endLng,
      };

      arcsRef.current.push(arcData);
      globeInstance.current.arcsData([...arcsRef.current]);
      onNewAttack(attack);
    });

    return () => {
      if (socket.current) socket.current.disconnect();

      // ✅ Use the captured `globeEl`, not globeRef.current
      if (globeEl) globeEl.innerHTML = "";
    };
  }, [onNewAttack]);

  return <div ref={globeRef} className="globe-view" style={{ height: "100vh", width: "100vw" }} />;
}

export default GlobeView;
