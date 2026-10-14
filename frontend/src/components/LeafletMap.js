import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const DEFAULT_LOCATION = { latitude: 7.2083, longitude: 79.8358 };
const EMPTY_EVENTS = [];

function serializeForHtml(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function createMapHtml({ events, selectable }) {
  const safeEvents = serializeForHtml(events);
  const safeSelectable = serializeForHtml(selectable);

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <style>
    html, body, #map { height: 100%; width: 100%; margin: 0; }
    .leaflet-popup-content { font: 14px Arial, sans-serif; }
    .event-title { font-weight: bold; margin-bottom: 5px; }
    .event-location { margin-bottom: 8px; }
    .event-open { color: #246B62; border: 0; padding: 0; background: transparent; font: inherit; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    (function () {
      var events = ${safeEvents};
      var selectable = ${safeSelectable};
      var defaultLocation = [${DEFAULT_LOCATION.latitude}, ${DEFAULT_LOCATION.longitude}];
      var map = L.map('map', { tap: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      function setSelectedMarker(coordinate) {
        if (window.selectedMarker) map.removeLayer(window.selectedMarker);
        window.selectedMarker = L.marker([coordinate.latitude, coordinate.longitude]).addTo(map);
      }

      if (selectable) {
        map.setView(defaultLocation, 13);
        map.on('click', function (event) {
          var coordinate = {
            latitude: event.latlng.lat,
            longitude: event.latlng.lng
          };
          setSelectedMarker(coordinate);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'coordinate',
            coordinate: coordinate
          }));
        });
        return;
      }

      var bounds = [];
      events.forEach(function (event) {
        var latitude = Number(event.latitude);
        var longitude = Number(event.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

        var marker = L.marker([latitude, longitude]).addTo(map);
        var popup = document.createElement('div');
        var title = document.createElement('div');
        title.className = 'event-title';
        title.textContent = event.title || 'Community event';
        popup.appendChild(title);

        if (event.location) {
          var location = document.createElement('div');
          location.className = 'event-location';
          location.textContent = event.location;
          popup.appendChild(location);
        }

        var button = document.createElement('button');
        button.className = 'event-open';
        button.type = 'button';
        button.textContent = 'View event details';
        button.addEventListener('click', function () {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'event',
            id: event.id
          }));
        });
        popup.appendChild(button);
        marker.bindPopup(popup);
        bounds.push([latitude, longitude]);
      });

      if (bounds.length === 1) map.setView(bounds[0], 13);
      else if (bounds.length > 1) map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 });
      else map.setView(defaultLocation, 7);
    })();
  </script>
</body>
</html>`;
}

export default function LeafletMap({
  style,
  events = EMPTY_EVENTS,
  selectable = false,
  onCoordinateSelect,
  onEventPress,
}) {
  const html = useMemo(
    () => createMapHtml({ events, selectable }),
    [events, selectable]
  );

  const handleMessage = useCallback((event) => {
    let message;
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch (error) {
      console.error('Invalid Leaflet map message:', error);
      return;
    }

    if (
      message.type === 'coordinate' &&
      Number.isFinite(message.coordinate?.latitude) &&
      Number.isFinite(message.coordinate?.longitude)
    ) {
      onCoordinateSelect?.(message.coordinate);
    } else if (message.type === 'event' && message.id != null) {
      onEventPress?.(message.id);
    }
  }, [onCoordinateSelect, onEventPress]);

  return (
    <WebView
      source={{ html }}
      originWhitelist={['*']}
      javaScriptEnabled
      domStorageEnabled
      onMessage={handleMessage}
      style={[styles.webView, style]}
      accessibilityLabel={selectable ? 'Tap map to choose the event venue' : 'Map showing event venues'}
    />
  );
}

const styles = StyleSheet.create({
  webView: { backgroundColor: 'transparent' },
});
