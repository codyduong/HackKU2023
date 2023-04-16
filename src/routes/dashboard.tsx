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
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '~/auth';
import { ImCancelCircle } from 'solid-icons/im';
import Modal, { CreateCommentModal } from '~/components/Modal';
import Comments from '~/components/Comments';
import Navbar from '~/components/Navbar';

type SelectPlaceDetails = Pick<
  google.maps.places.PlaceResult,
  'icon' | 'icon_background_color' | 'name'
> & {
  placePhotos: string[];
};

export type Place = {
  placeId: null | string;
  latLng: null | google.maps.LatLng;
} & SelectPlaceDetails;

export type PlaceFirestore = {
  lat: null | number;
  lng: null | number;
  tags:
    | null
    | (string | { tag: string; description?: string; link?: string })[];
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
    {
      featureType: 'road',
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
    placePhotos: [],
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
    'viewing'
  );
  const [comments, setComments] = createSignal<QuerySnapshot<DocumentData>>();
  const [creatingComment, setCreatingComment] = createSignal(false);

  // Forum const
  const [forum, startForum] = createSignal(false);
  const toggleForum = () => startForum(!forum());

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
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      const p = new PlacesService(m);
      m.addListener(
        'click',
        async (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
          if ('placeId' in e && e.placeId) {
            // stop the default popup: https://stackoverflow.com/a/19084796/
            e.stop();

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
              name: details?.name,
              placePhotos:
                details?.photos?.map((photo) => photo.getUrl()) ?? [],
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
                label: value.name,
                collisionBehavior: 'REQUIRED_AND_HIDES_OPTIONAL',
                icon: {
                  url: value.icon!,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(12, 22),
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
                  name: value.name,
                  placePhotos: value.placePhotos ?? [],
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
    setPlace({ placeId: null, latLng: null, placePhotos: [] });
    setTag('');
    setTags([]);
  };

  const getComments = async (placeId: string | null) => {
    if (!placeId) {
      return;
    }
    const comments = collection(db, 'comments');
    const comResult = await getDocs(
      query(comments, where('placeId', '==', placeId))
    );
    if (comResult) {
      setComments(comResult);
    }
  };

  // Attempts to find the place on firestore
  const searchPlace = async (placeId: string | null) => {
    if (placeId === null) {
      return;
    }
    const locations = doc(db, 'locations', placeId);
    const locSnap = await getDoc(locations);
    if (locSnap) {
      setTags(locSnap.get('tags') ?? []);
    }
    await getComments(placeId);
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
      name: place().name,
      placePhotos: place().placePhotos,
    });

    clear();
  };

  return (
    <>
      <Title>Dashboard - B2B</Title>
      <Show when={!user()}>
        <Navigate href="/login" />
      </Show>
      <Show when={forum()}>
        <Navigate href="/forum" />
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

          .ul-tags {
            all: unset;
            display: flex;
            flex-flow: row wrap;
            gap: 12px;
            margin-bottom: 24px;
          }

          .li-tag {
            all: unset;
            display: flex;
            flex-flow: row nowrap;
            gap: 4px;
            border-radius: 12px;
            background-color: #e62727;
            color: #fff;
            padding: 0.25rem 1rem;
            font-size: 1.25rem;
          }

          .li-input {
            background-color: unset;
            padding: 0;
          }

          .input {
            width: fit-content;
            max-width: 240px;
            font-size: 1.25rem;
            padding-left: 8px;
          }

          .btn-icon {
            all: unset;
            border: unset;
            font-size: 1.25rem;
            background-color: inherit;
            aspect-ratio: 1/1;
            padding: 4px;
            padding-right: 2px;
            cursor: pointer;
            user-select: none;
          }

          .img-place {
            display: flex;
            max-height: 320px;
          }

          .inline-block {
            display: inline-block;
          }

          .rating-span {
            display: flex;
            flex-flow: row nowrap;
            gap: 16px;
            align-items: center;
          }

          .rating-block {
            display: block;
            margin: 0;
            padding: 16px 0px;
          }

          .rating-group {
            display: flex;
            gap: 8px;
          }
        `}
      </style>
      <main>
        <Navbar viewingMode={viewingMode} setViewingMode={setViewingMode} />
        <div id="map" class="map" />
        <Modal open={!!place().placeId} onClose={clear} onSubmit={onSubmit}>
          <h3>{place().name ?? place().placeId}</h3>
          <img
            class="img-place"
            src={
              place().placePhotos[0]
                ? `${place().placePhotos[0]}&maxheight=300&maxwidth=300`
                : undefined
            }
            alt={place().name}
          />
          <span class="rating-span">
            <h4 class="rating-block">Accessibility Rating</h4>
            <span class="rating-block rating-group">
              <span>
                {((): string => {
                  const validRatings =
                    comments()?.docs.filter(
                      (comment) => comment.get('rating') !== null
                    ) ?? [];
                  const totalRating = validRatings.reduce(
                    (p, c) => p + c.get('rating') ?? 0,
                    0
                  );
                  if (validRatings.length > 0) {
                    return `${(totalRating / validRatings.length).toFixed(
                      2
                    )} / 5 stars`;
                  } else {
                    return 'Unrated';
                  }
                })()}
              </span>
              <span role="separator">|</span>
              <span>
                {`${
                  (
                    comments()?.docs.filter(
                      (comment) => comment.get('rating') !== null
                    ) ?? []
                  ).length
                }`}{' '}
                Ratings
              </span>
            </span>
          </span>
          <h4>Current tags</h4>
          <ul class="ul-tags">
            <For each={tags()}>
              {(tag) => (
                <li class="li-tag">
                  {tag}
                  <button
                    class="btn-icon"
                    aria-label={`Delete tag ${tag}`}
                    onClick={() => {
                      setTags(tags().filter((t) => t !== tag));
                    }}
                  >
                    <ImCancelCircle />
                  </button>
                </li>
              )}
            </For>
            <li class="li-tag li-input">
              <input
                class="input"
                aria-label="Tag"
                placeholder="Tag"
                value={tag()}
                onChange={(e) => setTag(e.currentTarget.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    setTags([...tags(), tag()]);
                    setTag('');
                  }
                }}
                size={8}
              />
            </li>
          </ul>
          <Comments
            comments={comments()}
            refetch={() => {
              getComments(place().placeId);
            }}
          />
          <button onClick={() => setCreatingComment(true)}>Add Comment</button>
        </Modal>
        <CreateCommentModal
          open={creatingComment}
          setOpen={setCreatingComment}
          refetch={() => {
            getComments(place().placeId);
          }}
          placeId={place().placeId}
        />
<<<<<<< Updated upstream
=======
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
          <Button onClick={() => toggleForum()}> Forum </Button>
        </section>
        <div id="map" class="map" />
>>>>>>> Stashed changes
      </main>
    </>
  );
}
