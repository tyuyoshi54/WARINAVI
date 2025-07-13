import React, { useState } from 'react';
import TalkListScreen from './TalkListScreen';
import ChatScreen from './ChatScreen';

export default function TalkScreen({ user }) {
  const [selectedTalk, setSelectedTalk] = useState(null);

  const handleSelectTalk = (talkRoom) => {
    setSelectedTalk(talkRoom);
  };

  const handleBackToList = () => {
    setSelectedTalk(null);
  };

  if (selectedTalk) {
    return (
      <ChatScreen 
        talkRoom={selectedTalk}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <TalkListScreen 
      onSelectTalk={handleSelectTalk}
    />
  );
}