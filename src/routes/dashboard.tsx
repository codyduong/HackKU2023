import { Navigate, Title } from 'solid-start';
import { Loader } from '@googlemaps/js-api-loader';
import { isServer } from 'solid-js/web';
import { useUser } from '~/context/User';
import Button from '~/components/Button';
import { createSignal, Show, For } from 'solid-js';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '~/auth';
import { ImCancelCircle } from 'solid-icons/im';

let map: google.maps.Map;

export default function Dashboard() {
  const [user, { signOut }] = useUser();
  const [tag, setTag] = createSignal('');
  const [tags, setTags] = createSignal<string[]>([]);
  const [placeId, setPlaceId] = createSignal('');

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
      map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 38.9543, lng: -95.2558 },
        zoom: 16,
      });
      map.addListener(
        'click',
        async (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
          if ('placeId' in e && e.placeId) {
            await searchPlace(e.placeId);
            await setPlaceId(e.placeId);
          }
        }
      );

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

      // map.setOptions({ styles: styles.hide });
    });
  }

  const clear = () => {
    setPlaceId('');
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
    if (!placeId()) {
      throw new TypeError('No placeId specified!');
    }
    // if (tags().length === 0) {
    //   throw new TypeError('No tags specified!');
    // }

    await setDoc(doc(db, 'locations', placeId()), {
      tags: tags(),
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
            position: absolute;
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
        <Show when={placeId()}>
          <div class="modal">
            <section class="modal-section">
              <h3>Editing place with placeId: ${placeId()}</h3>
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
        </section>
        <div id="map" class="map" />
      </main>
    </>
  );
}
