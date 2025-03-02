// src/components/TimerDisplay.tsx
import React from 'react';
import { Timer } from '../logic/timer'; // Adjust path if needed
import { formatTime } from '../logic/timer'; // Adjust path if needed
import styles from './TimerDisplay.module.css'; // Import CSS Module (convention: import as 'styles')

interface TimerDisplayProps {
  timer: Timer;
  onRemove: (timerId: string | number) => void;
  onMoveUp: (timerId: string | number, currentIndex: number) => void;
  onMoveDown: (timerId: string | number, currentIndex: number) => void;
  onStart: (timerId: string | number) => void;
  onNext: (timerId: string | number) => void;
  onUpdateTimer: (timerId: string | number, value: string) => void;
  index: number; // Add index as a prop - needed for move up/down
  isCurrent: boolean;
  hasFinished: boolean;
}

const getListItemStyle = (
  timer: Timer,
  isCurrent: boolean,
  hasFinished: boolean,
) => {
  const classes = [styles.listItem]; // Start with the base listItem class

  if (isCurrent) {
    classes.push(styles.currentTimer);
    if (timer.isOverrun) {
      classes.push(styles.overrunningTimer);
    } else {
      classes.push(styles.runningTimer);
    }
  } else {
    if (timer.isOverrun) {
      classes.push(styles.overrunTimer);
    } else {
      if (hasFinished) {
        if (timer.elapsedTime) {
          classes.push(styles.finishedTimerWithTime);
        } else {
          classes.push(styles.finishedTimer);
        }
      }
    }
  }

  return classes.join(' '); // Join class names into a single string
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timer,
  onRemove,
  onMoveUp,
  onMoveDown,
  onStart,
  onNext,
  onUpdateTimer,
  index,
  isCurrent,
  hasFinished,
}) => {
  return (
    <li
      key={timer.id}
      className={getListItemStyle(timer, isCurrent, hasFinished)}
    >
      {/* List item styling */}
      <div style={{ marginBottom: '5px' }}>
        {' '}
        {/* Timer info line container */}
        <span>Timer ID: {timer.id}, </span>
        <span>
          Expected Time (seconds):{' '}
          <input
            type="number"
            value={timer.expectedTime}
            onChange={(e) => onUpdateTimer(timer.id, e.target.value)}
          ></input>
        </span>
        <span>Elapsed Time: {formatTime(timer.elapsedTime)}, </span>
        <span>Running: {timer.isRunning ? 'Yes' : 'No'}, </span>
        <span>Overrun: {timer.isOverrun ? 'Yes' : 'No'}</span>
      </div>
      <div>
        {' '}
        {/* Button row container */}
        <button
          className={styles.buttonStyleSmall}
          onClick={() => onRemove(timer.id)}
        >
          Remove
        </button>
        <button
          className={styles.buttonStyleSmall}
          onClick={() => onMoveUp(timer.id, index)}
        >
          Up
        </button>
        <button
          className={styles.buttonStyleSmall}
          onClick={() => onMoveDown(timer.id, index)}
        >
          Down
        </button>
        {
          !timer.isRunning && (
            <button
              className={styles.buttonStyleSmall}
              onClick={() => onStart(timer.id)}
            >
              Start
            </button>
          ) //<!-- disabled={isAnyTimerRunning()} -->
        }
        {timer.isRunning && (
          <button
            className={styles.buttonStyleSmall}
            onClick={() => onNext(timer.id)}
          >
            Next
          </button>
        )}
      </div>
    </li>
  );
};

export default TimerDisplay;
