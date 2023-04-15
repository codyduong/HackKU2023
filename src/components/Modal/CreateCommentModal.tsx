import { Accessor, createSignal, Setter } from 'solid-js';
import Modal from './Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '~/auth';

interface CreateCommentModalProps {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  placeId: string;
  refetch: () => void;
}

export default function CreateCommentModal(props: CreateCommentModalProps) {
  const [rating, setRating] = createSignal(3);
  const [description, setDescription] = createSignal('');

  const submitComment = async () => {
    await addDoc(collection(db, 'comments'), {
      placeId: props.placeId,
      description: description(),
      rating: rating(),
    });
    props.refetch();
  };

  return (
    <>
      <style jsx>{``}</style>
      <Modal
        open={props.open()}
        onClose={() => props.setOpen(false)}
        onSubmit={() => submitComment()}
        zIndex={2500}
      >
        <label for="comment-rating-input">Rating</label>
        <input
          type="number"
          id="comment-rating-input"
          min={0}
          max={5}
          value={rating()}
          onChange={(e) => setRating(Number(e.currentTarget.value))}
        />
        <label for="comment-description-input">Description</label>
        <input
          type="textbox"
          id="comment-description-input"
          value={description()}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </Modal>
    </>
  );
}
