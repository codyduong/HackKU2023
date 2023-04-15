import { createEffect, createSignal, Show } from 'solid-js';
import { Title } from 'solid-start';
import Button from '~/components/Button';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '~/auth';
import Cats from '~/components/Cats';
// import Cats from '~/components/Button/pinterest';

export default function SignUp() {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [result, setResult] = createSignal<UserCredential>();

  createEffect(() => {
    console.log(email(), password());
  });

  const onSubmit = async () => {
    try {
      setResult(
        await createUserWithEmailAndPassword(auth, email(), password())
      );
      console.log(result());
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      <Title>Sign Up</Title>
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
      <Show when={!result()} fallback={<Cats />}>
        <main>
          <section class="section login">
            <h1>Bridge to Belonging</h1>
            <h2>Login</h2>
            <form class="form">
              <input
                class="input"
                aria-label="Email"
                placeholder="Email"
                value={email()}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <input
                class="input"
                aria-label="Password"
                type="password"
                placeholder="Password"
                value={password()}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <input
                class="input"
                aria-label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword()}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              />
            </form>
            <Button onClick={() => onSubmit()}>Sign Up</Button>
          </section>
          <section class="section signup">
            <span>
              Already have an account?{' '}
              <a href="/login" class="anchor-login">
                Log in
              </a>
            </span>
          </section>
        </main>
      </Show>
    </>
  );
}
