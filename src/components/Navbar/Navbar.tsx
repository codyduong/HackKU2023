import { Accessor, createSignal, Setter, Show } from 'solid-js';
import { useUser } from '~/context/User';
import NavbarUserMenu from './NavbarUserMenu';
import { FaSolidCircleUser } from 'solid-icons/fa';

interface NavbarProps {
  viewingMode: Accessor<'creating' | 'viewing'>;
  setViewingMode: Setter<'creating' | 'viewing'>;
}

export default function Navbar(props: NavbarProps) {
  const [user] = useUser();
  const [open, setOpen] = createSignal(false);
  const [error, setError] = createSignal(false);

  return (
    <>
      <style jsx>{`
        .navbar {
          top: 0;
          position: absolute;
          display: flex;
          z-index: 1000;
          padding-top: 24px;
        }
        .right {
          right: 0;
          padding-right: 24px;
          flex-flow: row-reverse nowrap;
        }
        .user-btn {
          all: unset;
          cursor: pointer;
          user-select: none;
        }
        .user-btn:hover {
          box-shadow: 0px 2px 3px 1px #877a78;
        }
        .user-icon {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          overflow: hidden;
        }
      `}</style>
      <div class="navbar right">
        <button class="user-btn user-icon" onClick={() => setOpen(!open())}>
          <Show
            when={!error}
            fallback={
              <FaSolidCircleUser style={{ width: '40px', height: '40px' }} />
            }
          >
            <img
              class="user-icon"
              src={user()?.photoURL ?? ''}
              onError={() => setError(true)}
            />
          </Show>
        </button>
      </div>
      <Show when={open()}>
        <NavbarUserMenu
          open={open}
          setOpen={setOpen}
          viewingMode={props.viewingMode}
          setViewingMode={props.setViewingMode}
        />
      </Show>
    </>
  );
}
