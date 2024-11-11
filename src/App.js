import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faLock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GroupDialog from './components/GroupDialog';
import './styles/App.css';
import projectImage from './assets/project05-img.png';

function App() {
  const [groups, setGroups] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [note, setNote] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState({});
  const [showColumn2, setShowColumn2] = useState(false); // State for mobile view toggling
  const initialLoad = useRef(true);
  const noteInputRef = useRef(null);

  useEffect(() => {
    if (initialLoad.current) {
      const savedGroups = JSON.parse(localStorage.getItem('groups'));
      console.log('Saved Groups:', savedGroups);
      const savedNote = localStorage.getItem('note');
      const savedMessages = JSON.parse(localStorage.getItem('messages'));

      if (savedGroups) setGroups(savedGroups);
      if (savedNote) setNote(savedNote);
      if (savedMessages) setMessages(savedMessages);

      initialLoad.current = false;
    }
  }, []);

  useEffect(() => {
    if (!initialLoad.current) {
      localStorage.setItem('groups', JSON.stringify(groups));
    }
  }, [groups]);

  useEffect(() => {
    if (!initialLoad.current) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const noteInput = noteInputRef.current;
    if (noteInput) {
      const handleInput = () => {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(noteInput);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      noteInput.addEventListener('input', handleInput);
      return () => {
        noteInput.removeEventListener('input', handleInput);
      };
    }
  }, [noteInputRef.current]);

  const generateUniqueInitials = (name) => {
    const initialsSet = new Set(groups.map(group => group.initials));
    let initials = name.slice(0, 2).toUpperCase();
    let index = 1;

    while (initialsSet.has(initials)) {
      initials = name[0].toUpperCase() + name[index].toUpperCase();
      index++;
      if (index >= name.length) {
        initials = name.slice(0, 2).toUpperCase() + index;
        index++;
      }
    }
    return initials;
  };

  const addGroup = (group) => {
    const initials = generateUniqueInitials(group.name);
    const newGroup = { ...group, initials };
    setGroups([...groups, newGroup]);
  };

  const handleSendMessage = () => {
    const newMessage = {
      text: note,
      timestamp: new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).replace(',', ' .'),
    };
    const groupMessages = messages[selectedGroup.name] || [];
    const updatedMessages = {
      ...messages,
      [selectedGroup.name]: [...groupMessages, newMessage],
    };
    setMessages(updatedMessages);
    setNote('');
  };

  const handleFocus = (e) => {
    if (e.currentTarget.textContent === 'Enter your text here...') {
      e.currentTarget.textContent = '';
    }
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.textContent) {
      e.currentTarget.textContent = 'Enter your text here...';
    }
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    if (window.innerWidth <= 768) {
      setShowColumn2(true);
    }
  };

  const handleBackToColumn1 = () => {
    setShowColumn2(false);
  };

  return (
    <div className={`container ${showColumn2 ? 'show-column2' : ''}`}>
      <div className="column1">
        <h1>Pocket Notes</h1>
        <div className="group-names">
          {groups.map((group, index) => (
            <div key={index} className="group" onClick={() => handleGroupSelect(group)}>
              <div className="group-initials" style={{ backgroundColor: group.color }}>
                {group.initials}
              </div>
              <div className="group-names">{group.name}</div>
            </div>
          ))}
        </div>
        <button className="addGroupBtn" onClick={() => setIsDialogOpen(true)}>+</button>
      </div>
      <div className="column2">
        {selectedGroup ? (
          <>
            <div className="group-header">
              {window.innerWidth <= 768 && showColumn2 && (
                <button onClick={handleBackToColumn1} className="backButton">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              )}
              <div className="group-initials" style={{ backgroundColor: selectedGroup.color }}>
                {selectedGroup.initials}
              </div>
              <div className="chat-name">{selectedGroup.name}</div>
            </div>
            <div className="messages">
              {(messages[selectedGroup.name] || []).map((message, index) => (
                <div key={index} className="message">
                  <p>{message.text}</p>
                  <span>{message.timestamp}</span>
                </div>
              ))}
            </div>
            <div className="note-container">
              <div
                className="note-input"
                contentEditable
                suppressContentEditableWarning
                ref={noteInputRef}
                onInput={(e) => setNote(e.currentTarget.textContent)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                {note || 'Enter your text here...'}
              </div>
              <button
                className={`sendBtn ${note ? 'active' : ''}`}
                disabled={!note}
                onClick={handleSendMessage}
              >
                <FontAwesomeIcon icon={faPaperPlane} rotation={90} />
              </button>
            </div>
          </>
        ) : (
          <div className="no-group-selected">
            <img src={projectImage} alt="Project" className="project-image" />
            <h1>Pocket Notes</h1>
            <h2>Send and receive messages without keeping your phone online.<br />
            Use Pocket Notes on up to 4 linked devices and 1 mobile phone.</h2>
            <div className="footer">
              <footer><FontAwesomeIcon icon={faLock} /> end-to-end encrypted</footer>
            </div>
          </div>
        )}
      </div>
      {isDialogOpen && (
        <GroupDialog onClose={() => setIsDialogOpen(false)} onAddGroup={addGroup} />
      )}
    </div>
  );
}

export default App;
