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

  const handleUpdateTimer = (timerId: string | number, value: string) => {
    const timerToUpdate = timerSequence.find((timer) => timer.id === timerId);
    if (timerToUpdate) {
      timerToUpdate.expectedTime = parseInt(value);
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
          starts the next one down.
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
        onUpdateTimer={handleUpdateTimer}
      />
    </div>
  );
};

export default TimerTestPage;
