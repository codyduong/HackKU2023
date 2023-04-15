import Button from '../Button';
import Modal from './Modal';

interface DeleteConfirmationModalProps {
  text: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function DeleteConfirmationModal(
  props: DeleteConfirmationModalProps
) {
  return (
    <>
      <style jsx>
        {`
          .modal-footer {
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            padding: 0.5rem 1rem 1rem;
          }
        `}
      </style>
      <Modal
        open={props.open}
        onClose={props.onClose}
        onSubmit={
          <div class="modal-footer">
            <Button
              onClick={() => {
                props.onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                props.onSubmit();
              }}
            >
              Save
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this {props.text}</p>
      </Modal>
    </>
  );
}
