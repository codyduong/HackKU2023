import { JSX, splitProps } from 'solid-js';

type ButtonProps = JSX.HTMLElementTags['button'] & {
  icon?: JSX.Element;
  children: JSX.Element;
};

export default function Button(_props: ButtonProps): JSX.Element {
  const [props, rest] = splitProps(_props, ['icon', 'children']);
  return (
    <>
      <style jsx>
        {`
          button {
            all: unset;
            font-size: 1.5rem;
            padding: 8px 16px;
            border-radius: 8px;
            border: solid #333 2px;
            cursor: pointer;
            width: fit-content;
            user-select: none;
          }
        `}
      </style>
      <button {...rest}>
        {props.icon}
        {props.children}
      </button>
    </>
  );
}
