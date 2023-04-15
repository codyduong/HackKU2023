import { For } from 'solid-js';
import { QuerySnapshot, DocumentData } from 'firebase/firestore';
import Comment from './Comment';

interface CommentsProps {
  comments: undefined | QuerySnapshot<DocumentData>;
  refetch: () => void;
}

export default function Comments(props: CommentsProps) {
  return (
    <>
      <style jsx>
        {`
          .ul-comments {
            all: unset;
            display: flex;
            flex-flow: column nowrap;
            gap: 16px;
          }

          .li-comment {
            all: unset;
          }

          .li-comment-empty {
            all: unset;
            align-self: center;
          }
        `}
      </style>
      <ul class="ul-comments">
        <For
          each={props.comments?.docs.filter((comment) =>
            comment.get('description')
          )}
          fallback={<li class="li-comment-empty">No comments found</li>}
        >
          {(comment) => <Comment comment={comment} refetch={props.refetch} />}
        </For>
      </ul>
    </>
  );
}
