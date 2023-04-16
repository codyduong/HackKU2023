import { Accessor, createSignal, Setter, Show } from 'solid-js';
import { useUser } from '~/context/User';
import NavbarUserMenu from './NavbarUserMenu';

interface NavbarProps {
  viewingMode: Accessor<'creating' | 'viewing'>;
  setViewingMode: Setter<'creating' | 'viewing'>;
}

export default function Navbar(props: NavbarProps) {
  const [user] = useUser();
  const [open, setOpen] = createSignal(false);

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
          <img class="user-icon" src={user()?.photoURL ?? ''} />
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
      {/* <section class="section navbar">
        <Button onClick={() => signOut()}>Sign Out</Button>
        <Button
          onClick={() => {
            props.setViewingMode((p) =>
              p === 'creating' ? 'viewing' : 'creating'
            );
          }}
        >
          Switch to{' '}
          {props.viewingMode() === 'creating' ? 'viewing' : 'creating'} mode
        </Button>
      </section> */}
    </>
  );
}
