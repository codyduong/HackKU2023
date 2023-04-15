import { createEffect, createSignal, Show } from 'solid-js';
import { Navigate, Title } from 'solid-start';
import Button from '~/components/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/auth';
import { useUser } from '~/context/User';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Login() {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [user, { setUser }] = useUser();
  const provider = new GoogleAuthProvider();

  createEffect(() => {
    console.log(username(), password());
  });

  const onSubmit = async () => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        username(),
        password()
      );
      setUser(result.user);
    } catch (e) {
      console.warn(e);
    }
  };

  const onGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      <Show when={user()}>
        <Navigate href="/dashboard" />
      </Show>
      <Title>Login - B2B</Title>
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
          <h2>Login</h2>
          <form class="form">
            <input
              class="input"
              aria-label="Username"
              placeholder="Username"
              value={username()}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
            <input
              class="input"
              aria-label="Password"
              type="password"
              placeholder="Password"
              value={password()}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </form>
          <Button onClick={() => onSubmit()}>Sign In</Button>
        </section>
        <section class="section divider" role="separator">
          <span class="or">or</span>
        </section>
        <section class="section signup-providers">
          <Button onClick={() => onGoogle()}>Sign in with Google</Button>
        </section>
        <section class="section signup">
          <span>
            Don't have an account?{' '}
            <a href="/signup" class="anchor-signup">
              Sign up
            </a>
          </span>
        </section>
      </main>
    </>
  );
}
