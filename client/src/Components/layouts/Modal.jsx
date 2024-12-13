import React from 'react';

const Modal = ({handleSubmit, handleClose, childJSX}) => {
  return (
    <div id="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose} onKeyDown={handleClose} role="button">
          &times;
        </span>
        <div className="modal-container">
          <h2 className="p">
            <i className="fas fa-exclamation-triangle"></i> Warning!
          </h2>
          <div className="content">
            {childJSX}
            <p className="py-1">Are you sure you want to continue?</p>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
            <button className="btn btn-light" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
