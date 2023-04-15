import { Navigate, Title } from 'solid-start';
import { Loader } from '@googlemaps/js-api-loader';
import { isServer } from 'solid-js/web';
import { useUser } from '~/context/User';
import Button from '~/components/Button';
import { createSignal, Show, For, createEffect } from 'solid-js';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '~/auth';
import { ImCancelCircle } from 'solid-icons/im';

type SelectPlaceDetails = Pick<
  google.maps.places.PlaceResult,
  'icon' | 'icon_background_color'
>;

export type Place = {
  placeId: null | string;
  latLng: null | google.maps.LatLng;
} & SelectPlaceDetails;

export type PlaceFirestore = {
  lat: null | number;
  lng: null | number;
  tags: null | string[];
} & SelectPlaceDetails;

const styles: Record<string, google.maps.MapTypeStyle[]> = {
  default: [],
  hide: [
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function Dashboard() {
  const [user, { signOut }] = useUser();
  const [tag, setTag] = createSignal('');
  const [tags, setTags] = createSignal<string[]>([]);
  const [place, setPlace] = createSignal<Place>({
    placeId: null,
    latLng: null,
  });
  const [mapBounds, setMapBounds] = createSignal<{
    lat: {
      lower: number;
      upper: number;
    };
    lng: {
      lower: number;
      upper: number;
    };
  }>();
  const [map, setMap] = createSignal<google.maps.Map>();
  const [mapChanged, setMapChanged] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [markers, setMarkers] = createSignal<google.maps.Marker[]>([]);
  // Either we are 'Creating' or 'Viewing'
  const [viewingMode, setViewingMode] = createSignal<'creating' | 'viewing'>(
    'creating'
  );

  if (!isServer) {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      version: 'weekly',
      ...{},
    });

    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        'maps'
      )) as google.maps.MapsLibrary;
      const { PlacesService } = (await google.maps.importLibrary(
        'places'
      )) as google.maps.PlacesLibrary;
      const m = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 38.9543, lng: -95.2558 },
        zoom: 16,
      });
      const p = new PlacesService(m);
      m.addListener(
        'click',
        async (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
          if ('placeId' in e && e.placeId) {
            // get other info from placeId
            const details =
              await new Promise<google.maps.places.PlaceResult | null>(
                (resolve) => {
                  p.getDetails({ placeId: e.placeId! }, (a) => resolve(a));
                }
              );

            // add tags from firestore
            await searchPlace(e.placeId);
            setPlace({
              placeId: e.placeId,
              latLng: e.latLng,
              icon: details?.icon,
              icon_background_color: details?.icon_background_color,
            });
          }
        }
      );
      m.addListener('bounds_changed', async () => {
        const southwest = m.getBounds()?.getSouthWest();
        const northeast = m.getBounds()?.getNorthEast();
        if (southwest && northeast) {
          setMapBounds({
            lat: {
              lower: southwest.lat(),
              upper: northeast.lat(),
            },
            lng: { lower: southwest.lng(), upper: northeast.lng() },
          });
          setMapChanged(true);
        }
      });
      // eslint-disable-next-line solid/reactivity
      m.addListener('idle', async () => {
        const bounds = mapBounds();
        if (mapChanged() && !loading() && bounds) {
          console.log(mapChanged());
          setLoading(true);
          const locations = collection(db, 'locations');
          const matchingLat = await getDocs(
            query(
              locations,
              where('lat', '>=', bounds.lat.lower),
              where('lat', '<=', bounds.lat.upper)
            )
          );
          const matchingLng = await getDocs(
            query(
              locations,
              where('lng', '>=', bounds.lng.lower),
              where('lng', '<=', bounds.lng.upper)
            )
          );
          const associativeArrayLat = matchingLat.docs.reduce(
            (previousValue, currentValue) => {
              const data = currentValue.data();
              const obj = previousValue;
              if (data) {
                obj[currentValue.id] = data;
              }
              return obj;
            },
            {} as Record<string, unknown>
          );
          const associativeArrayLng = matchingLng.docs.reduce(
            (previousValue, currentValue) => {
              const data = currentValue.data();
              const obj = previousValue;
              if (data) {
                obj[currentValue.id] = data;
              }
              return obj;
            },
            {} as Record<string, unknown>
          );
          const values: [placeId: string, place: PlaceFirestore][] = [];
          for (const [key, value] of Object.entries(associativeArrayLat)) {
            if (associativeArrayLng[key]) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              values.push([key, value as any]);
            }
          }
          // unload old markers
          // todo unload only no longer visible
          markers().forEach((marker) => {
            marker.setMap(null);
          });

          setMarkers(
            values.map(([placeId, value]) => {
              const latLngLiteral = { lat: value.lat!, lng: value.lng! };
              const marker = new google.maps.Marker({
                position: latLngLiteral,
                icon: {
                  url: value.icon!,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(25, 25),
                },
              });
              marker.addListener('click', async () => {
                // add tags from firestore
                await searchPlace(placeId);
                setPlace({
                  placeId: placeId,
                  latLng: new google.maps.LatLng(latLngLiteral),
                  icon: value.icon,
                  icon_background_color: value.icon_background_color,
                });
              });
              return marker;
            })
          );
          setLoading(false);
          setMapChanged(false);
        }
      });
      setMap(m);
    });
  }

  createEffect(() => {
    const m = map();
    if (m) {
      console.log(viewingMode());
      if (viewingMode() === 'viewing') {
        m.setOptions({ styles: styles.hide });
        markers().forEach((marker) => marker.setMap(m));
      } else {
        m.setOptions({ styles: styles.default });
        markers().forEach((marker) => marker.setMap(null));
      }
    }
  });

  const clear = () => {
    setPlace({ placeId: null, latLng: null });
    setTag('');
    setTags([]);
  };

  // Attempts to find the place on firestore
  const searchPlace = async (placeId: string | null) => {
    if (placeId === null) {
      return;
    }
    const docRef = doc(db, 'locations', placeId);
    const docSnap = await getDoc(docRef);
    if (docSnap) {
      setTags(docSnap.get('tags') ?? []);
    }
  };

  const onSubmit = async () => {
    const placeId = place().placeId;
    const latLng = place().latLng;
    if (!placeId) {
      throw new TypeError('No placeId specified!');
    }
    if (!latLng) {
      throw new TypeError('No latLng specified!');
    }
    // if (tags().length === 0) {
    //   throw new TypeError('No tags specified!');
    // }

    await setDoc(doc(db, 'locations', placeId), {
      lat: latLng.lat(),
      lng: latLng.lng(),
      tags: tags(),
      icon: place().icon,
      icon_background_color: place().icon_background_color,
    });

    clear();
  };

  return (
    <>
      <Title>Dashboard - B2B</Title>
      <Show when={!user()}>
        <Navigate href="/login" />
      </Show>
      <style jsx>
        {`
          main {
            padding: 0;
            width: 100vw;
            height: 100vh;
          }

          .map {
            width: 100%;
            height: 100%;
          }

          .section {
            display: flex;
            flex-flow: column nowrap;
            padding: 0.5rem;
          }

          .navbar {
            flex-flow: row nowrap;
            width: 100vw;
            height: 4rem;
            z-index: 1000;
            background-color: #fff;
          }

          .modal {
            position: absolute;
            background-color: rgba(51, 51, 51, 0.25);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
          }

          .modal-section {
            padding: 1rem;
            background: #fff;
          }

          .modal-bottom {
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
          }
        `}
      </style>
      <main>
        <Show when={place().placeId}>
          <div class="modal">
            <section class="modal-section">
              <h3>Editing place with placeId: ${place().placeId}</h3>
              <input
                class="input"
                aria-label="Tag"
                placeholder="Tag"
                value={tag()}
                onChange={(e) => setTag(e.currentTarget.value)}
              />
              <Button
                onClick={() => {
                  setTags([...tags(), tag()]);
                  setTag('');
                }}
              >
                Add Tag
              </Button>
              <h4>Current tags</h4>
              <ul>
                <For each={tags()}>
                  {(tag) => (
                    <li>
                      {tag}
                      <Button
                        aria-label={`Delete tag ${tag}`}
                        onClick={() => {
                          setTags(tags().filter((t) => t !== tag));
                        }}
                      >
                        <ImCancelCircle />
                      </Button>
                    </li>
                  )}
                </For>
              </ul>
              <div class="modal-bottom">
                <Button onClick={() => onSubmit()}>Save</Button>
                <Button onClick={() => clear()}>Exit</Button>
              </div>
            </section>
          </div>
        </Show>
        <section class="section navbar">
          <Button onClick={() => signOut()}>Sign Out</Button>
          <Button
            onClick={() => {
              setViewingMode((p) =>
                p === 'creating' ? 'viewing' : 'creating'
              );
            }}
          >
            Switch to {viewingMode() === 'creating' ? 'viewing' : 'creating'}{' '}
            mode
          </Button>
        </section>
        <div id="map" class="map" />
      </main>
    </>
  );
}
