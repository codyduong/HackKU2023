import { Show } from 'solid-js';
import { Navigate, Title } from 'solid-start';
import { useUser } from '~/context/User';

export default function Home() {
  const [user] = useUser();

  return (
    <>
      <Title>Loading - B2B</Title>
      <Show when={user} fallback={<Navigate href={'/login'} />}>
        <Navigate href="/dashboard" />
      </Show>
    </>
  );
}
