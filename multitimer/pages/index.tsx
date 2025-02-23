// pages/timer-test.tsx
import React, { useState } from 'react';
import { Timer,  addTimerToSequence, moveTimerInSequence, removeTimerFromSequence, startTimer, stopTimer,resetTimer} from '../logic/timer';

const TimerTestPage: React.FC = () => {
  const [timerSequence, setTimerSequence] = useState<Timer[]>([]);
  const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(null);

  const handleAddTimer = () => {
    const newTimer: Timer = {
      id: `timer-${Date.now()}`, // Simple unique ID using timestamp
      expectedTime: 60, // Default expected time (you can make this configurable later)
      elapsedTime: 0,
      isRunning: false,
      isOverrun: false,
    };
    const updatedSequence = addTimerToSequence(timerSequence, newTimer);
    setTimerSequence(updatedSequence); // Update the timerSequence state
  };

  const handleRemoveTimer = (timerId: string | number) => {
    const updatedSequence = removeTimerFromSequence(timerSequence, timerId);
    setTimerSequence(updatedSequence);
  };

  const handleMoveTimerUp = (timerId: string | number, currentIndex: number) => {
    if (currentIndex > 0) { // Prevent moving up if already at the top (index 0)
      const newPosition = currentIndex - 1;
      const updatedSequence = moveTimerInSequence(timerSequence, timerId, newPosition);
      setTimerSequence(updatedSequence);
    }
  };

  const handleMoveTimerDown = (timerId: string | number, currentIndex: number) => {
    if (currentIndex < timerSequence.length - 1) { // Prevent moving down if already at the bottom
      const newPosition = currentIndex + 1;
      const updatedSequence = moveTimerInSequence(timerSequence, timerId, newPosition);
      setTimerSequence(updatedSequence);
    }
  };
  const handleStartTimer = (timerId: string | number) => {
    const timerToStart = timerSequence.find(timer => timer.id === timerId);
    if (timerToStart) {
      const updatedTimer = startTimer(timerToStart); // Call startTimer logic
      const updatedSequence = timerSequence.map(timer =>
        timer.id === timerId ? updatedTimer : timer // Update the specific timer in the sequence
      );
      setTimerSequence(updatedSequence);
    }
  };

  const handleStopTimer = (timerId: string | number) => {
    const timerToStop = timerSequence.find(timer => timer.id === timerId);
    if (timerToStop && timerToStop.isRunning) { // Only stop if it's currently running
      const updatedTimer = stopTimer(timerToStop); // Call stopTimer logic
      const updatedSequence = timerSequence.map(timer =>
        timer.id === timerId ? updatedTimer : timer // Update the specific timer in the sequence
      );
      setTimerSequence(updatedSequence);
    }
  };

  const handleResetTimer = (timerId: string | number) => {
    const timerToReset = timerSequence.find(timer => timer.id === timerId);
    if (timerToReset) {
      const updatedTimer = resetTimer(timerToReset); // Call resetTimer logic
      const updatedSequence = timerSequence.map(timer =>
        timer.id === timerId ? updatedTimer : timer // Update the specific timer in the sequence
      );
      setTimerSequence(updatedSequence);
    }
  };


  return (
    <div>
      <h1>Timer Test Page</h1>
      <div>
        <button onClick={handleAddTimer}>Add Timer</button>
      </div>
      <div>
        <h2>Timer Sequence</h2>
        <ul>
          {timerSequence.map((timer, index) => (
            <li key={timer.id}>
              Timer ID: {timer.id}, Expected Time: {timer.expectedTime}s, Elapsed Time: {timer.elapsedTime}s, Running: {timer.isRunning ? 'Yes' : 'No'}, Overrun: {timer.isOverrun ? 'Yes' : 'No'}
              <button onClick={() => handleRemoveTimer(timer.id)}>Remove</button>
              <button onClick={() => handleMoveTimerUp(timer.id, index)}>Up</button>
              <button onClick={() => handleMoveTimerDown(timer.id, index)}>Down</button>
              {!timer.isRunning && <button onClick={() => handleStartTimer(timer.id)}>Start</button>} {/* Start Button */}
              {timer.isRunning && <button onClick={() => handleStopTimer(timer.id)}>Stop</button>}   {/* Stop Button */}
              <button onClick={() => handleResetTimer(timer.id)}>Reset</button>                   {/* Reset Button */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default TimerTestPage;