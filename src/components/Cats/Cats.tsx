import { Component, createSignal, Show } from 'solid-js';
import { Title } from 'solid-start';

const [religion, setReligion] = createSignal(false);
const [healthcare, setHealthcare] = createSignal(false);
const [education, setEducation] = createSignal(false);
const [food, setFood] = createSignal(false);
const [neighborhoods, setNeighborhoods] = createSignal(false);
const [employment, setEmployment] = createSignal(false);
const toggleRel = () => setReligion(!religion());
const toggleHealth = () => setHealthcare(!healthcare());
const toggleEdu = () => setEducation(!education());
const toggleFood = () => setFood(!food());
const toggleNeighbor = () => setNeighborhoods(!neighborhoods());
const toggleEmploy = () => setEmployment(!employment());

const [location, setLocation] = createSignal('');

const Cats: Component = () => {
  return (
    <>
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
          }
          .form {
            display: flex;
            flex-flow: column nowrap;
            gap: 16px;
          }
          .next {
            margin-top: 0;
            font-size: 2rem;
          }
        `}
      </style>
      <main>
        <section>
          <h1>Categories</h1>
          <h2>Select which categories you are interested in.</h2>
        </section>
        <section class="buttons">
          <Show
            when={religion()}
            fallback={<button onClick={toggleRel}>Religion</button>}
          >
            <button onClick={toggleRel}>
              <div>Religion</div>
            </button>
          </Show>
          <Show
            when={healthcare()}
            fallback={<button onClick={toggleHealth}>Healthcare</button>}
          >
            <button onClick={toggleHealth}>
              <div>Healthcare</div>
            </button>
          </Show>
          <Show
            when={education()}
            fallback={<button onClick={toggleEdu}>Education</button>}
          >
            <button onClick={toggleEdu}>
              <div>Education</div>
            </button>
          </Show>
          <Show
            when={food()}
            fallback={<button onClick={toggleFood}>Food</button>}
          >
            <button onClick={toggleFood}>
              <div>Food</div>
            </button>
          </Show>
          <Show
            when={neighborhoods()}
            fallback={<button onClick={toggleNeighbor}>Neighborhoods</button>}
          >
            <button onClick={toggleNeighbor}>
              <div>Neighborhoods</div>
            </button>
          </Show>
          <Show
            when={employment()}
            fallback={<button onClick={toggleEmploy}>Employment</button>}
          >
            <button onClick={toggleEmploy}>
              <div>Employment</div>
            </button>
          </Show>
        </section>
        <section>
          <h2>Enter your location:</h2>
          <form class="form">
            <input
              class="input"
              placeholder="City, State, Country "
              value={location()}
              onChange={(e) => setLocation(e.currentTarget.value)}
            />
          </form>
        </section>
        <section class="next">
          <button>Next</button>
        </section>
      </main>
    </>
  );
};
export default Cats;
