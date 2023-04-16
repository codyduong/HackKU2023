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
  const [error, setError] = createSignal('');

  createEffect(() => {
    console.log(email(), password());
  });

  const onSubmit = async () => {
    if (password().length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (password() !== confirmPassword()) {
      alert('Passwords do not match!');
      return;
    }
    try {
      setResult(
        await createUserWithEmailAndPassword(auth, email(), password())
      );
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
            font-size: 1.5rem;
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

          .form input {
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 10px;
            font-size: 20px;
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 10px;
          }
          
          .form input:focus {
            outline: none;
            border-color: #ff847c;
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
          img {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            height: 200px;
          }
          .btn-signup {
            display: inline-block;
            color: #ff847c;
            cursor: pointer;
            background-color: #fff;
            border: 2px solid #ff847c;
            border-radius: 0.25rem;
            padding: 0.5rem 1rem;
            transition: all 0.3s ease-in-out;
          }
          
          .btn-signup:hover {
            background-color: #ff847c;
            color: #fff;
          }
        `}
      </style>
      <Show when={!result()} fallback={<Cats />}>
        <main>
          <section class="section login">
          <img src="src/components/img/logo2.png"></img>
            <h2>Register for an Account</h2>
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
            <Button onClick={() => onSubmit()} class="btn-signup">Sign Up</Button>
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
