import { createSignal } from 'solid-js';
import { Title } from 'solid-start';

export default function Login() {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');

  return (
    <>
      <Title>Login</Title>
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
              value={username()}
              placeholder="Username"
            />
            <input
              class="input"
              aria-label="Password"
              type="password"
              value={password()}
              placeholder="Password"
            />
          </form>
        </section>
        <section class="section divider" role="separator">
          <span class="or">or</span>
        </section>
        <section class="section signup-providers">
          <button>Google</button>
          <button>Google</button>
        </section>
        <section class="section signup">
          <span>
            Don't have an account? <button class="btn-signup">Sign Up</button>
          </span>
        </section>
      </main>
    </>
  );
}
