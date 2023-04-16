import {
  Accessor,
  createEffect,
  createSignal,
  JSX,
  Setter,
  Show,
  For,
} from 'solid-js';
import Modal from './Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '~/auth';
import { useUser } from '~/context/User';
import { ref, uploadBytes } from 'firebase/storage';

interface CreateCommentModalProps {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  placeId: null | string;
  refetch: () => void;
}

let imgRef: HTMLImageElement;

export default function CreateCommentModal(props: CreateCommentModalProps) {
  const [rating, setRating] = createSignal<number | null>(null);
  const [description, setDescription] = createSignal('');
  const [user] = useUser();
  const [files, setFiles] = createSignal<File[]>([]);

  const min = (n: number | null) => {
    return n !== null ? (n < 0 ? 0 : n) : null;
  };
  const max = (n: number | null) => {
    return n !== null ? (n > 5 ? 5 : n) : null;
  };

  const cleanData = () => {
    setRating(null);
    setDescription('');
    setFiles([]);
  };

  const submitComment = async () => {
    try {
      const filesPaths = [];
      for await (const file of files()) {
        const storageRef = ref(storage, `${user()?.uid}/${file.name}`);
        const meta = await uploadBytes(storageRef, file);
        filesPaths.push(meta.metadata.fullPath);
      }
      await addDoc(collection(db, 'comments'), {
        placeId: props.placeId,
        description: description(),
        rating: min(max(rating())),
        author: user()?.uid,
        authorEmail: user()?.email,
        authorIcon: user()?.photoURL,
        approved: false,
        attachments: filesPaths,
      });
      cleanData();
      props.refetch();
      props.setOpen(false);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleFile: JSX.CustomEventHandlersCamelCase<HTMLInputElement>['onChange'] =
    (e) => {
      const f = e.target.files?.[0];
      if (f) {
        imgRef.src = URL.createObjectURL(f);
        setFiles([...files(), f]);
      }
    };

  const handleDrop: JSX.CustomEventHandlersCamelCase<HTMLDivElement>['onDrop'] =
    async (e) => {
      e.preventDefault();
      const temp = files();

      if (e.dataTransfer?.items) {
        [...e.dataTransfer.items].forEach((item) => {
          // If dropped items aren't files, reject them
          if (item.kind === 'file') {
            const file = item.getAsFile();
            file && temp.push(file);
          }
        });
      } else {
        [...(e.dataTransfer?.files ?? [])].forEach((file) => {
          temp.push(file);
        });
      }
      temp.filter((file) => file.name.match('.*.(png|jpg|jpeg)$'));
      await setFiles(temp);
      const last = temp.at(-1);
      if (last) {
        imgRef.src = URL.createObjectURL(last);
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

        .comment-attachments-wrapper {
          position: relative;
          width: 100%;
          max-width: 420px;
          min-height: 5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border: dashed 2px #3a3a3a;
          padding: 1rem;
          flex-flow: column nowrap;
        }

        .comment-attachments {
          display: none;
        }

        .comment-attachments-label {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .comment-attachments-img {
          position: relative;
          width: 100%;
          height: 100%;
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
          <h3>Creating Comment</h3>
          <label for="comment-rating-input">Rating</label>
          <input
            id="comment-rating-input"
            class="input-group one"
            type="number"
            min={0}
            max={5}
            value={min(max(rating())) ?? ''}
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
          <span>Attachments</span>
          <div
            class="comment-attachments-wrapper"
            onDrop={handleDrop}
            onDragOver={async (e) => {
              e.preventDefault();
            }}
          >
            <input
              id="comment-attachments"
              class="comment-attachments"
              type="file"
              multiple
              accept="image/png, image/jpeg"
              onChange={handleFile}
            />
            <label for="comment-attachments" class="comment-attachments-label">
              Upload file...
            </label>
            <For each={files()}>{(file) => <span>{file.name}</span>}</For>
            <img class="comment-attachments-img" ref={imgRef} />
          </div>
        </Modal>
      </Show>
    </>
  );
}
