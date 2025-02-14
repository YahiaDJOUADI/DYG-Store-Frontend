import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const LeafletMap = ({ selectedWilaya, orderData }) => {
  useEffect(() => {
    const map = L.map("map").setView([selectedWilaya.lat, selectedWilaya.lng], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([selectedWilaya.lat, selectedWilaya.lng])
      .addTo(map)
      .bindPopup(`Delivery to ${orderData?.wilaya || "Algiers"}`)
      .openPopup();

    return () => map.remove();
  }, [selectedWilaya, orderData]);

  return <div id="map" style={{ height: "400px", width: "100%", borderRadius: "8px" }} />;
};

export default LeafletMap;