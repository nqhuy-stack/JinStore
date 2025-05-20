import { useState } from 'react';

function ModalAddress({ addresses, onClose, onSelect }) {
  const [selectedId, setSelectedId] = useState(addresses.length > 0 ? addresses[0].id : null);

  const handleConfirm = () => {
    const selectedAddress = addresses.find((addr) => addr.id === selectedId);
    if (selectedAddress) {
      onSelect(selectedAddress); // Truyền địa chỉ về component cha
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal__content-address">
        <div className="modal-header">
          <h2>Địa chỉ của tôi</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="address__options">
            {addresses.map((address) => (
              <label key={address.id} className="address__option">
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedId === address.id}
                  onChange={(e) => setSelectedId(e.target.value)}
                />
                <div className="address__card">
                  <h3>
                    {address.name} | {address.phone}
                  </h3>
                  <p>{address.streetAddress}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <div className="modal-action_buttons">
            <button className="btn btn-cancel modal-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-add modal-btn" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAddress;
