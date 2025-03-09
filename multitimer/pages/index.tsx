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
} from '../logic/timer';
import TimerSequenceDisplay from '../components/TimerSequenceDisplay';
import MasterControls from '../components/MasterControls';
import StatusPanel from '../components/StatusPanel';

const TimerTestPage: React.FC = () => {
  const [timerSequence, setTimerSequence] = useState<Timer[]>([]);
  const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(
    null,
  );

  const updateTimerInSequence = (updatedTimer: Timer) => {
    setTimerSequence((sequence) => {
      const updatedSequence = sequence.map(
        (timer) => (timer.id === updatedTimer.id ? updatedTimer : timer), // Update the specific timer in the sequence
      );
      return updatedSequence;
    });
  };

  const handleAddTimer = () => {
    const newTimer: Timer = {
      id: `timer-${Date.now()}`, // Simple unique ID using timestamp
      expectedTime: 5, // Default expected time (you can make this configurable later)
      elapsedTime: 0,
      isRunning: false,
      isOverrun: false,
      name: 'unnamed timer',
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
    if (
      currentTimerIndex !== null &&
      timerSequence[currentTimerIndex].isRunning
    ) {
      const updatedTimer = stopTimer(timerSequence[currentTimerIndex]);
      updateTimerInSequence(updatedTimer);
    }
    const timerIndexToStart = timerSequence.findIndex(
      (timer) => timer.id === timerId,
    );
    if (timerIndexToStart >= 0) {
      const updatedTimer = startTimer(timerSequence[timerIndexToStart]); // Call startTimer logic
      setCurrentTimerIndex(timerIndexToStart);
      updateTimerInSequence(updatedTimer);
    }
  };

  // Stopping a timer starts the next timer in the sequence
  const handleNextTimer = (timerId: string | number) => {
    const timerIndexToStop = timerSequence.findIndex(
      (timer) => timer.id === timerId,
    );
    if (timerIndexToStop >= 0 && timerSequence[timerIndexToStop].isRunning) {
      const stoppedTimer = stopTimer(timerSequence[timerIndexToStop]);
      updateTimerInSequence(stoppedTimer);
      if (timerIndexToStop == currentTimerIndex) {
        const timerIndexToStart = timerIndexToStop + 1;
        if (timerIndexToStart <= timerSequence.length - 1) {
          const startedTimer = startTimer(timerSequence[timerIndexToStart]);
          setCurrentTimerIndex(timerIndexToStart);
          updateTimerInSequence(startedTimer);
        } else {
          setCurrentTimerIndex(null);
        }
      }
    }
  };

  const handleMasterNextTimer = () => {
    if (currentTimerIndex != null) {
      handleNextTimer(timerSequence[currentTimerIndex].id);
    }
  };

  const handleDeleteAll = () => {
    setTimerSequence([]);
    setCurrentTimerIndex(null);
  };

  const handleMasterResetTimer = () => {
    timerSequence.map((timer) => {
      const changedTimer = resetTimer(timer);
      updateTimerInSequence(changedTimer);
    });
    setCurrentTimerIndex(null);
  };

  // Pause stops / starts the current timer
  const handleMasterPause = () => {
    if (currentTimerIndex != null) {
      if (timerSequence[currentTimerIndex].isRunning) {
        const updatedTimer = stopTimer(timerSequence[currentTimerIndex]);
        updateTimerInSequence(updatedTimer);
      } else {
        const updatedTimer = startTimer(timerSequence[currentTimerIndex]);
        updateTimerInSequence(updatedTimer);
      }
    } else {
      if (timerSequence.length > 0) {
        // Start the first timer
        setCurrentTimerIndex(0);
        const updatedTimer = startTimer(timerSequence[0]);
        updateTimerInSequence(updatedTimer);
      }
    }
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Multitimer</h1>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        {' '}
        <em>
          Only one timer is running at a time. Add new timers at the bottom.
          Pressing next (on the timer or at the top) stops the current timer and
          starts the next one down. Click the expected time or the name to edit
          them.
        </em>
      </div>
      <StatusPanel
        totalRunTime={totalRunTime()}
        totalOverTime={totalOverTime()}
        totalTargetTime={totalTargetTime()}
      />
      <MasterControls
        onMasterStartPause={handleMasterPause}
        onMasterNext={handleMasterNextTimer}
        onMasterReset={handleMasterResetTimer}
        onDeleteAll={handleDeleteAll}
        onMasterAdd={handleAddTimer}
        numTimers={timerSequence.length}
        isStarted={currentTimerIndex != null}
        isRunning={
          currentTimerIndex != null &&
          timerSequence[currentTimerIndex].isRunning
        }
      />
      <TimerSequenceDisplay
        timerSequence={timerSequence}
        currentTimerIndex={currentTimerIndex}
        onRemove={handleRemoveTimer}
        onMoveUp={handleMoveTimerUp}
        onMoveDown={handleMoveTimerDown}
        onStart={handleStartTimer}
        onNext={handleNextTimer}
        updateTimerInSequence={updateTimerInSequence}
      />
    </div>
  );
};

export default TimerTestPage;
