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
  formatTime,
} from '../logic/timer';

const TimerTestPage: React.FC = () => {
  const [timerSequence, setTimerSequence] = useState<Timer[]>([]);
  const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(
    null,
  );

  const partialUpdateSequence = (
    updatedTimer: Timer,
    currentSequence: Timer[],
  ) => {
    const updatedSequence = currentSequence.map(
      (timer) => (timer.id === updatedTimer.id ? updatedTimer : timer), // Update the specific timer in the sequence
    );
    return updatedSequence;
  };

  const updateSequence = (updatedTimer: Timer) => {
    const updatedSequence = timerSequence.map(
      (timer) => (timer.id === updatedTimer.id ? updatedTimer : timer), // Update the specific timer in the sequence
    );
    setTimerSequence(updatedSequence);
  };

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

  // Removing the running timer stops it and clears the running timer
  const handleRemoveTimer = (timerId: string | number) => {
    if (timerId == currentTimerIndex) {
      if (timerSequence[timerId].isRunning) {
        stopTimer(timerSequence[timerId]);
      }
      setCurrentTimerIndex(null);
    }
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
      if (currentIndex == currentTimerIndex) {
        setCurrentTimerIndex(newPosition);
      }
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
      if (currentIndex == currentTimerIndex) {
        setCurrentTimerIndex(newPosition);
      }
    }
  };

  // Starting a timer stops the running timer
  const handleStartTimer = (timerId: string | number) => {
    if (currentTimerIndex && timerSequence[currentTimerIndex].isRunning) {
      stopTimer(timerSequence[currentTimerIndex]);
    }
    const timerIndexToStart = timerSequence.findIndex(
      (timer) => timer.id === timerId,
    );
    if (timerIndexToStart >= 0) {
      const updatedTimer = startTimer(timerSequence[timerIndexToStart]); // Call startTimer logic
      setCurrentTimerIndex(timerIndexToStart);
      updateSequence(updatedTimer);
    }
  };

  // Stopping a timer starts the next timer in the sequence
  const handleNextTimer = (timerId: string | number) => {
    const timerIndexToStop = timerSequence.findIndex(
      (timer) => timer.id === timerId,
    );
    let updatedSequence = timerSequence;
    if (timerIndexToStop >= 0 && timerSequence[timerIndexToStop].isRunning) {
      const stoppedTimer = stopTimer(timerSequence[timerIndexToStop]);
      updatedSequence = partialUpdateSequence(stoppedTimer, updatedSequence);
      if (timerIndexToStop == currentTimerIndex) {
        const timerIndexToStart = timerIndexToStop + 1;
        if (timerIndexToStart <= timerSequence.length - 1) {
          const startedTimer = startTimer(timerSequence[timerIndexToStart]);
          setCurrentTimerIndex(timerIndexToStart);
          updatedSequence = partialUpdateSequence(
            startedTimer,
            updatedSequence,
          );
        } else {
          setCurrentTimerIndex(null);
        }
      }
    }
    setTimerSequence(updatedSequence);
  };

  const handleMasterResetTimer = () => {
    let updatedSequence = timerSequence;

    timerSequence.map((timer) => {
      const changedTimer = resetTimer(timer);
      updatedSequence = partialUpdateSequence(changedTimer, updatedSequence);
    });
    setTimerSequence(updatedSequence);
    setCurrentTimerIndex(null);
  };

  // Pause stops / starts the current timer
  const handleMasterPause = () => {
    if (currentTimerIndex != null) {
      if (timerSequence[currentTimerIndex].isRunning) {
        const updatedTimer = stopTimer(timerSequence[currentTimerIndex]);
        updateSequence(updatedTimer);
      } else {
        const updatedTimer = startTimer(timerSequence[currentTimerIndex]);
        updateSequence(updatedTimer);
      }
    } else {
      if (timerSequence.length > 0) {
        // Start the first timer
        setCurrentTimerIndex(0);
        const updatedTimer = startTimer(timerSequence[0]);
        updateSequence(updatedTimer);
      }
    }
  };

  const isMasterControlDisabled = () => {
    return timerSequence.length == 0;
  };

  const isAnyTimerRunning = () => {
    return (
      currentTimerIndex != null && timerSequence[currentTimerIndex].isRunning
    );
  };

  const masterControlText = () => {
    if (currentTimerIndex != null) {
      if (timerSequence[currentTimerIndex].isRunning) {
        return 'Pause Running Timer';
      } else {
        return 'Start Current Timer.';
      }
    }
    if (timerSequence.length > 0) {
      return 'Start First Timer';
    } else {
      return '(add a timer first)';
    }
  };

  const getListItemStyle = (timer: Timer, index: number) => {
    let baseStyle = listItemStyle; // Start with the default list item style

    if (index == currentTimerIndex) {
      baseStyle = {
        ...baseStyle,
        border: '3px solid black',
        backgroundImage:
          'repeated-linear-gradient(-45deg,transparent,transparent 20px,black 20px,black 40px)',
      };
      if (timer.isOverrun) {
        baseStyle = { ...baseStyle, backgroundColor: 'lightcoral' }; // Apply red background if overrun
      } else {
        baseStyle = { ...baseStyle, backgroundColor: 'lightgreen' }; // Apply green background if running
      }
    } else {
      if (timer.isOverrun) {
        baseStyle = { ...baseStyle, backgroundColor: '#ffdddd' }; // Apply red background if overrun
      } else {
        // If there's a running timer fade those before it (or if there's total elapsed time
        // and no timer as we're probably at the end)
        if (
          (currentTimerIndex && index < currentTimerIndex) ||
          (currentTimerIndex == null && totalRunTime())
        ) {
          if (timer.elapsedTime) {
            baseStyle = { ...baseStyle, backgroundColor: '#ddffdd' };
          } else {
            baseStyle = { ...baseStyle, backgroundColor: '#f9f9f9' };
          }
        }
      }
    }

    return baseStyle;
  };

  const totalTargetTime = () => {
    if (timerSequence.length) {
      return timerSequence
        .map((timer) => timer.expectedTime)
        .reduce((p, n) => p + n);
    }
    return 0;
  };

  const totalRunTime = () => {
    if (timerSequence.length) {
      return timerSequence
        .map((timer) => timer.elapsedTime)
        .reduce((p, n) => p + n);
    }
    return 0;
  };

  const totalOverTime = () => {
    if (timerSequence.length) {
      return timerSequence
        .map((timer) =>
          timer.elapsedTime > timer.expectedTime
            ? timer.elapsedTime - timer.expectedTime
            : 0,
        )
        .reduce((p, n) => p + n);
    }
    return 0;
  };

  // Default list item style (slightly modified to be a base for dynamic styles)
  const listItemStyle = {
    border: '1px solid #eee',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#bbbbbb', // Default background color
    backgroundImage: '',
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
        Current Running Timer: {currentTimerIndex}
      </div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        {' '}
        {/* Master controls container styling */}
        Current Elapsed Time: {formatTime(totalRunTime())} -- Current Over Time:{' '}
        {formatTime(totalOverTime())} -- Total Target Time:{' '}
        {formatTime(totalTargetTime())}
      </div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          style={buttonStyle}
          onClick={handleMasterPause}
          disabled={isMasterControlDisabled()}
        >
          {masterControlText()}
        </button>
        <button style={buttonStyle} onClick={handleMasterResetTimer}>
          Reset All
        </button>
      </div>
      <div>
        <h2 style={{ marginBottom: '10px' }}>Timer Sequence</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {' '}
          {/* Unordered list styling */}
          {timerSequence.map((timer, index) => (
            <li key={timer.id} style={getListItemStyle(timer, index)}>
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
                    disabled={isAnyTimerRunning()}
                  >
                    Start
                  </button>
                )}
                {timer.isRunning && (
                  <button
                    style={buttonStyleSmall}
                    onClick={() => handleNextTimer(timer.id)}
                  >
                    Next
                  </button>
                )}
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
