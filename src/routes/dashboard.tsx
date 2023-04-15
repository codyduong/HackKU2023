import { Title } from 'solid-start';
import { Loader } from '@googlemaps/js-api-loader';
import { isServer } from 'solid-js/web';

let map: google.maps.Map;

export default function Dashboard() {
  if (!isServer) {
    const loader = new Loader({
      apiKey: '',
      version: 'weekly',
      ...{},
    });

    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        'maps'
      )) as google.maps.MapsLibrary;
      map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    });
  }

  return (
    <>
      <style jsx>
        {`
          .map {
            width: 100vw;
            height: 100vh;
          }
        `}
      </style>
      <div id="map" class="map" />
    </>
  );
}
