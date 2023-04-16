import { Component } from 'solid-js';
import { Navigate, Title } from 'solid-start';
import { createEffect, createSignal, Show } from 'solid-js';
import Button from '~/components/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/auth';
import { useUser } from '~/context/User';

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
          {/* <img src={logo} alt="Logo" /> */}
        </section>
        <section class="section dropdown">
          <h3>What is Bridge to Belonging?</h3>
          <section class="about bridge">
            <span>
              this is just a lot of sample text. idk what to say lmao.
              aaaaaaaaaaaaaaaaaa
            </span>
          </section>
          <section class="back button">
            <Button onClick={() => toggleBack()}>Go Back</Button>
          </section>
        </section>
      </main>
    </>
  );
}
