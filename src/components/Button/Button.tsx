import { JSX, splitProps } from 'solid-js';
import { css } from 'solid-styled';

type ButtonProps = JSX.HTMLElementTags['button'] & {
  icon?: JSX.Element;
  children: JSX.Element;
  css?: ReturnType<typeof css>;
};

export default function Button(_props: ButtonProps): JSX.Element {
  const [props, rest] = splitProps(_props, ['icon', 'children', 'css']);
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
      {props.css}
      <button {...rest}>
        {props.icon}
        {props.children}
      </button>
    </>
  );
}
