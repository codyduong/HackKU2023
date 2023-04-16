import { Navigate, Title } from 'solid-start';
import { createSignal, Show } from 'solid-js';
import Button from '~/components/Button';

export default function Dropdown() {
  const [back, setBack] = createSignal(false);
  const toggleBack = () => setBack(!back());

  return (
    <>
      <Show when={back()}>
        <Navigate href="/profiledrop" />
      </Show>

      <Title>About Us</Title>
      <style jsx>
        {`
          h1 {
            width: fit-content;
            color: #335d92;
            text-transform: uppercase;
            font-size: 3rem;
          }

          h2 {
            margin-top: 0;
            font-size: 2rem;
          }

          .section {
            display: flex;
            flex-flow: column nowrap;
            gap: 16px;
            width: fit-content;
            padding-bottom: 2rem;
            align-items: center;
          }

          .divider {
            width: 100%;
            border-top-style: solid;
            flex-flow: row nowrap;
            justify-content: center;
            border-color: #333333;
            margin: 2rem 0 0.5rem;
          }

          .or {
            font-size: 2rem;
            position: relative;
            background-color: #fff;
            padding: 0 1rem;
            transform: translateY(-1.5rem);
            text-transform: uppercase;
          }

          .form {
            display: flex;
            flex-flow: column nowrap;
            gap: 16px;
          }

          .signup-providers {
            flex-flow: row wrap;
          }

          .btn-signup {
            all: unset;
            display: inline-block;
            color: #335d92;
            cursor: pointer;
          }
        `}
      </style>
      <main>
        <section class="about us">
          <h1>Bridge to Belonging</h1>
          <img src="/logo2.png" alt="Logo" />
        </section>
        <section class="section dropdown">
          <h3>What is Bridge to Belonging?</h3>
          <section class="about bridge">
            <center>
              <span>
                Bridge to Belonging promotes a sense of unity among their users,
                connecting them to local communities based on their personal
                interests. While Bridge to Belonging was designed towards
                immigrants struggling to find their community in new areas,
                Bridge to Belonging is open to any user looking for
                similar-minded people.
              </span>
            </center>
          </section>
          <section class="back button">
            <Button onClick={() => toggleBack()}>Go Back</Button>
          </section>
        </section>
      </main>
    </>
  );
}
