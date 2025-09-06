import React, { useEffect, useRef } from "react";
import * as mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

interface MapboxProps {
  address: string;
}

const MapboxExample: React.FC<MapboxProps> = ({ address }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const accessToken = import.meta.env.VITE_MAX_BOX_TOKEN;
    if (!accessToken) throw new Error("Mapbox access token is not defined.");

    let isMounted = true;

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
          )}.json?access_token=${accessToken}&limit=1`
        );
        const data = await response.json();

        // fallback coordinates nếu Mapbox không tìm thấy
        let longitude = 105.8342;
        let latitude = 21.0278;

        if (data.features && data.features.length > 0 && isMounted) {
          [longitude, latitude] = data.features[0].center;
        } else {
          console.warn("Không tìm thấy tọa độ cho địa chỉ:", address);
        }

        if (!mapRef.current) {
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [longitude, latitude],
            zoom: 16,
            accessToken,
          });

          // Thêm marker
          markerRef.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);

          // Thêm geocoder
          const geocoder = new MapboxGeocoder({
            accessToken,
            mapboxgl: mapboxgl,
            zoom: 16,
            placeholder: "Nhập địa chỉ (tùy chọn)",
          });
          mapRef.current.addControl(geocoder);

          // Đặt sẵn input
          geocoder.setInput(address);
        } else {
          // update map và marker nếu map đã tồn tại
          mapRef.current.setCenter([longitude, latitude]);
          markerRef.current?.setLngLat([longitude, latitude]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tọa độ:", error);
      }
    };

    fetchCoordinates();

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [address]);

  return <div ref={mapContainerRef} style={{ height: "500px", width: "100%", borderRadius: 10 }} />;
};

export default MapboxExample;
