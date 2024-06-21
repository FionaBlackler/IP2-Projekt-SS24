import './confirmationModal.scss'
//import alarmImage from '../../assets/alarm.jpg';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, content }) => {
    if (!isOpen) return null

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                <div className="custom-modal-header">
                    <h2>{title}</h2>
                </div>
                <div className="custom-modal-image-container">
                    <img
                        src={alarmImage}
                        alt="Confirmation Visual"
                        className="custom-modal-image"
                    />
                </div>
                <div className="custom-modal-content">
                    <p>{content}</p>
                </div>
                <div className="custom-modal-actions">
                    <button onClick={onClose} className="cancel-button">
                        No
                    </button>
                    <button onClick={onConfirm} className="confirm-button">
                        No but pink :)
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
