/** @format */

import { createContext, useContext, useState } from "react";

const LocationContext = createContext();

export const useLocationData = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [locationInfo, setLocationInfo] = useState({
    location: { lat: 53.483959, lng: -2.244644 },
    riderId: "",
  });

  return (
    <LocationContext.Provider value={{ locationInfo, setLocationInfo }}>
      {children}
    </LocationContext.Provider>
  );
};
