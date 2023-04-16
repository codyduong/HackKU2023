import { createSignal, Show, For, onMount } from 'solid-js';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { FaSolidCircleUser, FaRegularTrashCan } from 'solid-icons/fa';
import { useUser } from '~/context/User';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '~/auth';
import DeleteConfirmationModal from '../Modal/DeleteConfirmationModal';
import Modal from '../Modal';
import { ref, getDownloadURL } from 'firebase/storage';

interface CommentProps {
  comment: QueryDocumentSnapshot<DocumentData>;
  refetch: () => void;
}

export default function Comment(props: CommentProps) {
  /* eslint-disable solid/reactivity */
  const icon = props.comment.get('authorIcon');
  const email = props.comment.get('authorEmail');
  const description = props.comment.get('description');
  /* eslint-enable solid/reactivity */
  const [user] = useUser();
  const [showDelete, setShowDelete] = createSignal(false);
  const [showAttachments, setShowAttachments] = createSignal(false);
  const [files, setFiles] = createSignal<string[]>([]);
  const [error, setError] = createSignal(false);

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'comments', props.comment.id));
    await props.refetch();
    setShowDelete(false);
  };

  const getFile = async (f: string) => {
    const storageRef = ref(storage, f);
    return await getDownloadURL(storageRef);
  };

  onMount(async () => {
    const temp: string[] = [];
    for await (const file of props.comment.get('attachments') ?? []) {
      temp.push(await getFile(file));
    }
    setFiles(temp);
  });

  return (
    <>
      <style jsx>
        {`
          p {
            margin: 4px 0;
          }

          .li-comment {
            display: flex;
            flex-flow: column nowrap:
            gap: 4px;
            margin-bottom: 12px;
          }

          .group {
            display: flex;
            flex-flow: row nowrap;
            gap: 8px;
          }

          .space-between {
            justify-content: space-between;
          }

          .image-wrapper {
            aspect-ratio: 1/1;
            display: flex;
            max-width: 32px;
            overflow: hidden;
            border-radius: 50%;
          }

          .comment-btn-delete {
            all: unset;
            aspect-ratio: 1/1;
            padding: 4px;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 225ms;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .comment-btn-delete:hover {
            background-color: #bbb;
          }
        `}
      </style>
      <li class="li-comment">
        <div class="group space-between">
          <div class="group">
            <div class="image-wrapper">
              <Show
                when={icon && !error}
                fallback={
                  <FaSolidCircleUser
                    style={{ width: '32px', height: '32px' }}
                  />
                }
              >
                <img
                  src={icon}
                  alt={`${email} Icon`}
                  onError={() => {
                    setError(true);
                  }}
                />
              </Show>
            </div>
            <span>{email}</span>
          </div>
          <Show when={email == user()?.email}>
            <button
              class="comment-btn-delete"
              onClick={() => {
                setShowDelete(true);
              }}
            >
              <FaRegularTrashCan />
            </button>
          </Show>
        </div>
        <p>{description}</p>
        <Show when={files().length > 0}>
          <button
            onClick={() => {
              setShowAttachments(true);
            }}
          >
            View attachments
          </button>
        </Show>
      </li>
      {/* Just throw it in some modal */}
      <Modal
        open={showAttachments()}
        onClose={() => {
          setShowAttachments(false);
        }}
        onSubmit={null}
      >
        <For each={files()}>
          {(file) => {
            return <img src={file} />;
          }}
        </For>
      </Modal>
      <DeleteConfirmationModal
        open={showDelete()}
        onClose={() => {
          setShowDelete(false);
        }}
        onSubmit={() => {
          handleDelete();
        }}
        text="Comment"
      />
    </>
  );
}
