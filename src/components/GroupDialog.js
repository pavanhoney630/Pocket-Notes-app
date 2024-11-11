import React, { useState } from 'react';
import '../styles/GroupDialog.css';

const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A1'];

function GroupDialog({ onClose, onAddGroup }) {
  const [groupName, setGroupName] = useState('');
  const [groupColor, setGroupColor] = useState('');

  const handleAddGroup = () => {
    onAddGroup({ name: groupName, color: groupColor });
    onClose();
  };

  return (
    <div className="dialog" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="input-group">
          <label>Enter Group Name:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            style={{ borderRadius: '15px', height: '40px' }}
          />
        </div>
        <div className="color-group">
          <label>Choose Color:</label>
          <div className="color-options">
            {colors.map((color) => (
              <div
                key={color}
                className="color-circle"
                style={{ backgroundColor: color }}
                onClick={() => setGroupColor(color)}
              />
            ))}
          </div>
        </div>
        <button
          className="create-group-btn"
          disabled={!groupName || !groupColor}
          onClick={handleAddGroup}
        >
          Create Group
        </button>
      </div>
    </div>
  );
}

export default GroupDialog;


