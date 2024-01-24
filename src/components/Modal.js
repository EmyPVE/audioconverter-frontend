import '../cssmodal/Modal.css';
const Modal = ({ show, onClose, children }) => {
    if (!show) {
      return null;
    }
  
    return (
      <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">Change Password</h4>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-danger">Close</button>
          </div>
        </div>
      </div>
    );
  };
  
export default Modal;