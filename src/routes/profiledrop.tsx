import { Component } from 'solid-js';
import { Navigate, Title } from 'solid-start';
import { createSignal, Show } from 'solid-js';
import Button from '~/components/Button';

export default function Dropdown() {
  const [edit, setEdit] = createSignal(false);
  const [settings, setSettings] = createSignal(false);
  const [help, setHelp] = createSignal(false);
  const [logout, setLogout] = createSignal(false);
  const [home, setHome] = createSignal(false);
  const toggleEdit = () => setEdit(!edit());
  const toggleSettings = () => setSettings(!settings());
  const toggleHelp = () => setHelp(!help());
  const toggleLogout = () => setLogout(!logout());
  const toggleHome = () => setHome(!home());

  return (
    <>
      <Show when={edit()}>
        <Navigate href="/help" />
      </Show>

      <Show when={settings()}>
        <Navigate href="/help" />
      </Show>

      <Show when={help()}>
        <Navigate href="/help" />
      </Show>

      <Show when={logout()}>
        <Navigate href="/googlelogin" />
      </Show>

      <Show when={home()}>
        <Navigate href="/dashboard" />
      </Show>

      <Title>User Profile</Title>
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
        <section class="section login">
          <h1>Bridge to Belonging</h1>
          <img src="/logo2.png" alt="Logo" />
        </section>
        <section class="section dropdown">
          <h2>Hello, User</h2>
          <section class="section signup">
            <Button onClick={() => toggleEdit()}>Edit Profile</Button>
            <Button onClick={() => toggleHelp()}>Help & Support</Button>
            <Button onClick={() => toggleSettings()}>Settings & Privacy</Button>
            <Button onClick={() => toggleLogout()}>Logout</Button>
            <Button onClick={() => toggleHome()}>Back to Dashboard</Button>
          </section>
        </section>
      </main>
    </>
  );
}
