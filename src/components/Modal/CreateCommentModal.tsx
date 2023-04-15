import { Accessor, createSignal, Setter, Show } from 'solid-js';
import Modal from './Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '~/auth';
import { useUser } from '~/context/User';

interface CreateCommentModalProps {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  placeId: null | string;
  refetch: () => void;
}

export default function CreateCommentModal(props: CreateCommentModalProps) {
  const [rating, setRating] = createSignal(3);
  const [description, setDescription] = createSignal('');
  const [user] = useUser();

  const min = (n: number) => {
    return n < 0 ? 0 : n;
  };
  const max = (n: number) => {
    return n > 5 ? 5 : n;
  };

  const submitComment = async () => {
    try {
      await addDoc(collection(db, 'comments'), {
        placeId: props.placeId,
        description: description(),
        rating: min(max(rating())),
        author: user()?.email,
      });
      props.refetch();
    } catch (e) {
      console.log(user()?.email);
      console.warn(e);
    }
  };

  return (
    <>
      <style jsx>{`
        .input-group {
          display: flex;
          flex-wrap: nowrap;
        }

        .one {
          flex-direction: row;
        }

        .two {
          flex-direction: column;
        }

        textarea {
          font-size: 1.25rem;
          min-height: 5rem;
          min-width: 420px;
        }
      `}</style>
      <Show when={props.placeId}>
        <Modal
          open={props.open()}
          onClose={() => {
            setRating(3);
            setDescription('');
            props.setOpen(false);
          }}
          onSubmit={() => submitComment()}
          zIndex={2500}
        >
          <label for="comment-rating-input">Rating</label>
          <input
            id="comment-rating-input"
            class="input-group one"
            type="number"
            min={0}
            max={5}
            value={min(max(rating()))}
            onChange={(e) => setRating(Number(e.currentTarget.value))}
            size={1}
          />
          <label for="comment-description-input">Description</label>
          <textarea
            id="comment-description-input"
            class="input-group two"
            value={description()}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </Modal>
      </Show>
    </>
  );
}
