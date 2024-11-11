import React from 'react';
import '../styles/GroupList.css';

function GroupList({ groups, onSelectGroup }) {
  return (
    <div className="groupsContainer">
      {groups.map((group, index) => (
        <div
          key={index}
          className="group"
          onClick={() => onSelectGroup(group)}
        >
          <div className="group-initials" style={{ backgroundColor: group.color }}>
            {group.initials}
          </div>
          <span className="group-name">{group.name}</span>
        </div>
      ))}
    </div>
  );
}

export default GroupList;
