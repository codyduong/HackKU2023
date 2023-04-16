import {
  Accessor,
  createSignal,
  onCleanup,
  onMount,
  Setter,
  Show,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { IoLogOutOutline, IoSettingsOutline } from 'solid-icons/io';
import { TbSwitch3 } from 'solid-icons/tb';
import { useUser } from '~/context/User';
import { Navigate } from 'solid-start';
import { CgFeed } from 'solid-icons/cg';

interface NavbarUseMenuProps {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  viewingMode: Accessor<'creating' | 'viewing'>;
  setViewingMode: Setter<'creating' | 'viewing'>;
}

let selfRef: HTMLDivElement;

export default function NavbarUserMenu(props: NavbarUseMenuProps) {
  const [, { signOut }] = useUser();
  // Forum const
  const [forum, startForum] = createSignal(false);
  const toggleForum = () => startForum(!forum());

  const handleMouse = (e: MouseEvent) => {
    if (e.target && selfRef && !selfRef.contains(e.target as any)) {
      props.setOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleMouse);
  });
  onCleanup(() => {
    document.removeEventListener('mousedown', handleMouse);
  });

  return (
    <>
      <style jsx>{`
        .navbar-menu-wrapper {
          position: absolute;
          right: 64px;
          top: 64px;
          display: flex;
          flex-flow: column nowrap;
          z-index: 1200;
          background-color: #fff5f5;
          border-radius: 16px;
          box-shadow: 0px 2px 4px 0px #976868;
          min-width: 300px;
          overflow: hidden;
        }
        .btn {
          all: unset;
          cursor: pointer;
          user-select: none;
          display: flex;
          flex-grow: 1;
          flex-flow: row nowrap;
          align-items: center;
          gap: 8px;
          transition: background-color 225ms;
        }
        .btn:hover {
          background-color: #dadada;
        }
        .btn2 {
          color: #000;
        }
        .btn2:hover {
          background-color: #e7dada;
        }
        .navbar-signout {
          color: #000;
        }
        .margin {
          margin: 0.5rem;
          margin-bottom: 0rem;
        }
        .padding {
          padding: 1rem;
        }
        .padding-more {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
        .navbar-menu {
          background-color: #fff;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-flow: column nowrap;
          gap: 2px;
        }
      `}</style>
      <Show when={forum()}>
        <Navigate href="/forum" />
      </Show>
      <Portal mount={document.getElementById('modal-root')!}>
        <div class="navbar-menu-wrapper" ref={selfRef}>
          <div class="navbar-menu margin">
            <button class="btn padding">
              <IoSettingsOutline />
              Settings
            </button>
            <button
              class="btn padding"
              onClick={() => {
                props.setViewingMode((p) =>
                  p === 'creating' ? 'viewing' : 'creating'
                );
              }}
            >
              <TbSwitch3 />
              Switch View Mode
            </button>
            <button class="btn padding" onClick={() => toggleForum()}>
              <CgFeed />
              Forum
            </button>
          </div>
          <button
            class="btn btn2 padding padding-more"
            onClick={() => {
              signOut();
            }}
          >
            <IoLogOutOutline />
            Sign out
          </button>
        </div>
      </Portal>
    </>
  );
}
