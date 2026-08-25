import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h2>{title}</h2>

          <button type="button" onClick={onClose} className="modal__close">
            ✕
          </button>
        </div>

        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
