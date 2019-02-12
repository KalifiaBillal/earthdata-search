import React, { Component } from 'react'
import 'proj4'
import 'proj4leaflet'
import L from 'leaflet'
import { Map, TileLayer } from 'react-leaflet'
import ZoomHome from './ZoomHome'

import 'leaflet/dist/leaflet.css'
import './Map.scss'

class EdscMap extends Component {
  componentDidUpdate() {
    if (this.mapRef) {
      this.mapRef.leafletElement.invalidateSize()
    }
  }

  render() {
    const EPSG4326 = new window.L.Proj.CRS(
      'EPSG:4326',
      '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs', {
        origin: [-180, 90],
        resolutions: [
          0.5625,
          0.28125,
          0.140625,
          0.0703125,
          0.03515625,
          0.017578125,
          0.0087890625,
          0.00439453125,
          0.002197265625
        ],
        bounds: L.Bounds([
          [-180, -90],
          [180, 90]
        ])
      }
    )

    return (
      <Map
        className="map"
        center={[0, 0]}
        zoom={2}
        maxZoom={8}
        crs={EPSG4326}
        maxBounds={[
          [-120, -220],
          [120, 220]
        ]}
        ref={(ref) => { this.mapRef = ref }}
        zoomControl={false}
        attributionControl={false}
        style={{ position: 'absolute' }}
      >
        <TileLayer
          // eslint-disable-next-line
          url="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG4326_500m/{z}/{y}/{x}.jpeg"
          bounds={[
            [-89.9999, -179.9999],
            [89.9999, 179.9999]
          ]}
          tileSize={512}
          noWrap
          continuousWorld
        />
        <ZoomHome />
      </Map>
    )
  }
}

export default EdscMap
