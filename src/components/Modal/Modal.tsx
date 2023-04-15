import { JSX, Show } from 'solid-js';
import { VsClose } from 'solid-icons/vs';
import Button from '../Button';

interface ModalProps {
  children: JSX.Element;
  open: boolean;
  onClose: () => void;
  onSubmit: null | (() => void);
  zIndex?: number;
}

export default function Modal(props: ModalProps) {
  return (
    <>
      <style jsx>
        {`
          .modal {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: ${props.zIndex ?? 2000};
          }

          .shadow {
            background-color: rgba(51, 51, 51, 0.25);
            z-index: ${props.zIndex ? props.zIndex - 1 : 2000};
          }

          .modal-inner {
            background: #fff;
            border-radius: 16px;
            z-index: ${props.zIndex ?? 2000};
          }

          section {
            padding: 1rem;
            padding-top: 0;
          }

          .modal-heading {
            margin: 0;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-end;
            padding: 0.5rem;
            padding-bottom: 0;
          }

          .modal-btn {
            all: unset;
            aspect-ratio: 1/1;
            padding: 4px;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 225ms;
          }
          .modal-btn:hover {
            background-color: #bbb;
          }

          .modal-footer {
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-end;
            padding: 0.5rem 1rem 1rem;
          }

          h3 {
            margin-top: 0;
          }

          h4 {
            margin-top: 0;
            margin-bottom: 1rem;
          }

          .input {
            width: fit-content;
            max-width: 240px;
            font-size: 1.25rem;
            padding-left: 8px;
          }

          .btn-icon {
            all: unset;
            border: unset;
            font-size: 1.25rem;
            background-color: inherit;
            aspect-ratio: 1/1;
            padding: 4px;
            padding-right: 2px;
            cursor: pointer;
          }
        `}
      </style>
      <Show when={props.open}>
        <div class="modal" onClick={(e) => e.stopPropagation()}>
          <div class="modal shadow" onClick={() => props.onClose()} />
          <div class="modal-inner">
            <h2 class="modal-heading">
              <button
                class="modal-btn"
                aria-label="Close modal"
                onClick={() => props.onClose()}
              >
                <VsClose />
              </button>
            </h2>
            <section>{props.children}</section>
            <Show when={props.onSubmit}>
              <div class="modal-footer">
                <Button onClick={() => props.onSubmit()}>Save</Button>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </>
  );
}
