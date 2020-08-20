import React from 'react';

export default ({handleSubmit, handleClose}) => {
    return (
        <div id="modal">
            <div className="modal-content">
                <span className="close" onClick={handleClose}>&times;</span>
                <div className="modal-container">
                    <h2>Warning!</h2>
                    <div className="content">
                        <p className='py-1'>Are you sure you want to continue?</p>
                        <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
                        <button className='btn btn-light' onClick={handleClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};