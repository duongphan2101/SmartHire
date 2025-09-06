import React from "react";
import "./AddJobModal.css";
import { AiOutlineClose } from 'react-icons/ai';

interface AddJobModalProps {
  onClose: () => void;
}
const AddJobModal: React.FC<AddJobModalProps> = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>THÊM CÔNG VIỆC</h2>
        
        <button className="close-button" onClick={onClose}>
          <AiOutlineClose />
        </button>
      </div>
    </div>
  );
};

export default AddJobModal;