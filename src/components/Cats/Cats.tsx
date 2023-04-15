import { Component, createSignal, Show, For } from 'solid-js';
import { Navigate, Title } from 'solid-start';
import Button from '../Button';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '~/auth';

type Category =
  | 'religion'
  | 'healthcare'
  | 'education'
  | 'bikes'
  | 'food'
  | 'employment';

const categories: [Category, boolean][] = [
  ['religion', false],
  ['healthcare', false],
  ['education', false],
  ['bikes', false],
  ['food', false],
  ['employment', false],
];

const [cats, setCats] = createSignal(categories);
const [location, setLocation] = createSignal('');

const toggleCat = (cat: Category) => {
  const temp = Object.fromEntries(cats());
  temp[cat] = !temp[cat];
  setCats(Object.entries(temp) as any);
};

const submitAccount = async () => {
  const tags: Category[] = [];
  cats().forEach(([t, v]) => {
    if (v) {
      tags.push(t);
    }
  });
  await setDoc(doc(db, 'users', auth.currentUser!.uid), {
    // hasSetup: true,
    interestedTags: tags,
    location: '',
  });
};

const Cats: Component = () => {
  return (
    <>
      <Show when={!auth.currentUser}>
        <Navigate href="/signup" />
      </Show>
      <Title>Categories</Title>
      <style jsx>
        {`
          h1 {
            width: fit-content;
            color: #335d92;
            text-transform: uppercase;
            font-size: 3rem;
          }
          h2 {
            width: fit-content;
            font-size: 2rem;
          }
          div {
            background-color: #808080;
          }
          .buttons {
            display: flex;
            flex-flow: row wrap;
            gap: 16px;
            margin-bottom: 32px;
          }
          .form {
            display: flex;
            flex-flow: column nowrap;
            gap: 16px;
            margin-bottom: 2rem;
          }
          .next {
            margin: 1rem 0 2rem;
          }
          .btn-cat {
            all: unset;
            display: flex;
            flex-flow: row nowrap;
            gap: 4px;
            border-radius: 12px;
            border: 2px solid #333;
            padding: 0.25rem 1rem;
            font-size: 1.25rem;
            cursor: pointer;
            transition: background-color 225ms;
            user-select: none;
          }
          .btn-cat:hover {
            background-color: #acacac;
          }
          .active {
            background-color: #64eb6f;
            border: 2px solid #12831b;
          }
          .active:hover {
            background-color: #36ce43;
          }
          .section {
            display: flex;
            flex-flow: column nowrap;
            gap: 16px;
            width: fit-content;
            padding-bottom: 2rem;
            align-items: center;
          }
        `}
      </style>
      <main>
        <section>
          <h1>Categories</h1>
          <h2>Select which categories you are interested in.</h2>
        </section>
        <section class="buttons">
          <For each={cats()}>
            {([cat, v]) => {
              return (
                <button
                  onClick={() => toggleCat(cat as any)}
                  class={`btn-cat${v ? ' active' : ''}`}
                >
                  {cat}
                </button>
              );
            }}
          </For>
        </section>
        <section>
          <form class="form">
            <label for="input-location">Location</label>
            <input
              id="input-location"
              class="input"
              placeholder="City, State, Country"
              value={location()}
              onChange={(e) => setLocation(e.currentTarget.value)}
            />
          </form>
        </section>
        <section class="next">
          <Button onClick={() => submitAccount()}>Submit</Button>
        </section>
        <section class="section signup">
          <span>
            <a href="/dashboard" class="anchor-signup">
              Skip this step for now
            </a>
          </span>
        </section>
      </main>
    </>
  );
};
export default Cats;
