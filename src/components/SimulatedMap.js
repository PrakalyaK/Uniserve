import React from 'react';
import RealLiveTrackingMap from './RealLiveTrackingMap';

/**
 * Drop-in upgrade: SimulatedMap now directly renders RealLiveTrackingMap
 * with interactive OpenStreetMap/CartoDB road layers, real road route polyline,
 * live moving vehicle with compass bearing, and Rapido/Uber speedometer HUD.
 */
export const SimulatedMap = (props) => {
  return <RealLiveTrackingMap {...props} />;
};

export default SimulatedMap;
