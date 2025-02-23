// pages/timer-test.tsx
import React, { useState, useEffect } from 'react';
import {
  Timer,
  addTimerToSequence,
  moveTimerInSequence,
  removeTimerFromSequence,
  startTimer,
  stopTimer,
  resetTimer,
  updateTimer,
  getNextTimer,
  formatTime,
} from '../logic/timer';

const TimerTestPage: React.FC = () => {
  const [timerSequence, setTimerSequence] = useState<Timer[]>([]);
  const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(
    null,
  );

  const handleAddTimer = () => {
    const newTimer: Timer = {
      id: `timer-${Date.now()}`, // Simple unique ID using timestamp
      expectedTime: 5, // Default expected time (you can make this configurable later)
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

  const handleMoveTimerUp = (
    timerId: string | number,
    currentIndex: number,
  ) => {
    if (currentIndex > 0) {
      // Prevent moving up if already at the top (index 0)
      const newPosition = currentIndex - 1;
      const updatedSequence = moveTimerInSequence(
        timerSequence,
        timerId,
        newPosition,
      );
      setTimerSequence(updatedSequence);
    }
  };

  const handleMoveTimerDown = (
    timerId: string | number,
    currentIndex: number,
  ) => {
    if (currentIndex < timerSequence.length - 1) {
      // Prevent moving down if already at the bottom
      const newPosition = currentIndex + 1;
      const updatedSequence = moveTimerInSequence(
        timerSequence,
        timerId,
        newPosition,
      );
      setTimerSequence(updatedSequence);
    }
  };
  const handleStartTimer = (timerId: string | number) => {
    const timerToStart = timerSequence.find((timer) => timer.id === timerId);
    if (timerToStart) {
      const updatedTimer = startTimer(timerToStart); // Call startTimer logic
      const updatedSequence = timerSequence.map(
        (timer) => (timer.id === timerId ? updatedTimer : timer), // Update the specific timer in the sequence
      );
      setTimerSequence(updatedSequence);
    }
  };

  const handleStopTimer = (timerId: string | number) => {
    const timerToStop = timerSequence.find((timer) => timer.id === timerId);
    if (timerToStop && timerToStop.isRunning) {
      // Only stop if it's currently running
      const updatedTimer = stopTimer(timerToStop); // Call stopTimer logic
      const updatedSequence = timerSequence.map(
        (timer) => (timer.id === timerId ? updatedTimer : timer), // Update the specific timer in the sequence
      );
      setTimerSequence(updatedSequence);
    }
  };

  const handleResetTimer = (timerId: string | number) => {
    const timerToReset = timerSequence.find((timer) => timer.id === timerId);
    if (timerToReset) {
      const updatedTimer = resetTimer(timerToReset); // Call resetTimer logic
      const updatedSequence = timerSequence.map(
        (timer) => (timer.id === timerId ? updatedTimer : timer), // Update the specific timer in the sequence
      );
      setTimerSequence(updatedSequence);
    }
  };

  const handleMasterStart = () => {
    if (timerSequence.some((timer) => timer.isRunning)) {
      // Optionally: Decide what to do if a timer is already running when "Master Start" is pressed.
      // For now, let's do nothing if any timer is already running.
      return;
    }

    const firstTimer = getNextTimer(timerSequence); // Get the first timer in the sequence
    if (firstTimer) {
      handleStartTimer(firstTimer.id); // Use existing handleStartTimer to start the first one
      setCurrentTimerIndex(0); // Set currentTimerIndex to the index of the first timer (0) - assuming it's always the first for master start.  We might need to refine this if sequence changes dynamically during run. For now, simple approach.
    }
  };

  const handleMasterStop = () => {
    const runningTimer = timerSequence.find((timer) => timer.isRunning); // Find the currently running timer
    if (runningTimer) {
      handleStopTimer(runningTimer.id); // Use existing handleStopTimer to stop it
      setCurrentTimerIndex(null); // Reset currentTimerIndex as no timer is actively running in sequence after master stop
    }
  };

  const [isMasterPaused, setIsMasterPaused] = useState(false); // State to track master pause status

  const handleMasterPause = () => {
    setIsMasterPaused((wasPaused) => {
      // Functional update for pause state
      const runningTimer = timerSequence.find((timer) => timer.isRunning);
      if (runningTimer) {
        if (!wasPaused) {
          // Pause: Stop time progression but keep timer as 'isRunning' conceptually
          handleStopTimer(runningTimer.id); // Stop time updates by calling stopTimer (which sets isRunning: false)
          return true; // Set master pause state to true (now paused)
        } else {
          // Resume: Restart time progression
          handleStartTimer(runningTimer.id); // Restart time updates by calling startTimer (sets isRunning: true)
          return false; // Set master pause state to false (now running)
        }
      }
      return wasPaused; // If no running timer, keep pause state unchanged
    });
  };

  const getListItemStyle = (timer: Timer) => {
    let baseStyle = listItemStyle; // Start with the default list item style

    if (timer.isRunning) {
      baseStyle = { ...baseStyle, backgroundColor: 'lightgreen' }; // Apply green background if running
    }
    if (timer.isOverrun) {
      baseStyle = { ...baseStyle, backgroundColor: 'lightcoral' }; // Apply red background if overrun
    }

    return baseStyle;
  };

  // Default list item style (slightly modified to be a base for dynamic styles)
  const listItemStyle = {
    border: '1px solid #eee',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9', // Default background color
  };

  // --- Time Progression Logic using useEffect ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimerSequence((currentSequence) => {
        // Use functional update for state
        return currentSequence.map((timer) => {
          if (timer.isRunning) {
            return updateTimer(timer, 1); // Increment elapsed time by 1 second (or adjust as needed)
          }
          return timer; // Return unchanged timer if not running
        });
      });
    }, 1000); // Update every 1000 milliseconds (1 second) - adjust as needed

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []); // Empty dependency array means this effect runs only on mount and unmount

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {' '}
      {/* Main container styling */}
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Timer Test Page
      </h1>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        {' '}
        {/* Button container styling */}
        <button style={buttonStyle} onClick={handleAddTimer}>
          Add Timer
        </button>
      </div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        {' '}
        {/* Master controls container styling */}
        <button style={buttonStyle} onClick={handleMasterStart}>
          Master Start
        </button>
        <button style={buttonStyle} onClick={handleMasterStop}>
          Master Stop
        </button>
        <button style={buttonStyle} onClick={handleMasterPause}>
          {isMasterPaused ? 'Master Resume' : 'Master Pause'}
        </button>
      </div>
      <div>
        <h2 style={{ marginBottom: '10px' }}>Timer Sequence</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {' '}
          {/* Unordered list styling */}
          {timerSequence.map((timer, index) => (
            <li key={timer.id} style={getListItemStyle(timer)}>
              {' '}
              {/* List item styling */}
              <div style={{ marginBottom: '5px' }}>
                {' '}
                {/* Timer info line container */}
                <span>Timer ID: {timer.id}, </span>
                <span>Expected Time: {formatTime(timer.expectedTime)}, </span>
                <span>Elapsed Time: {formatTime(timer.elapsedTime)}, </span>
                <span>Running: {timer.isRunning ? 'Yes' : 'No'}, </span>
                <span>Overrun: {timer.isOverrun ? 'Yes' : 'No'}</span>
              </div>
              <div>
                {' '}
                {/* Button row container */}
                <button
                  style={buttonStyleSmall}
                  onClick={() => handleRemoveTimer(timer.id)}
                >
                  Remove
                </button>
                <button
                  style={buttonStyleSmall}
                  onClick={() => handleMoveTimerUp(timer.id, index)}
                >
                  Up
                </button>
                <button
                  style={buttonStyleSmall}
                  onClick={() => handleMoveTimerDown(timer.id, index)}
                >
                  Down
                </button>
                {!timer.isRunning && (
                  <button
                    style={buttonStyleSmall}
                    onClick={() => handleStartTimer(timer.id)}
                  >
                    Start
                  </button>
                )}
                {timer.isRunning && (
                  <button
                    style={buttonStyleSmall}
                    onClick={() => handleStopTimer(timer.id)}
                  >
                    Stop
                  </button>
                )}
                <button
                  style={buttonStyleSmall}
                  onClick={() => handleResetTimer(timer.id)}
                >
                  Reset
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Reusable button styles (you can adjust these as desired)
const buttonStyle = {
  padding: '8px 15px',
  margin: '5px',
  cursor: 'pointer',
  borderRadius: '5px',
  border: '1px solid #ccc',
  backgroundColor: '#f0f0f0',
};

const buttonStyleSmall = {
  ...buttonStyle, // Inherit from buttonStyle
  padding: '5px 10px',
  fontSize: '0.9em',
};

export default TimerTestPage;
