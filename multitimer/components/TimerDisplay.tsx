// src/components/TimerDisplay.tsx
import React, { use, useState } from 'react';
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
  updateTimerInSequence: (timer: Timer) => void;
  index: number; // Add index as a prop - needed for move up/down
  isCurrent: boolean;
  hasFinished: boolean;
}

const getListItemStyle = (
  timer: Timer,
  isCurrent: boolean,
  hasFinished: boolean,
) => {
  const classes = [styles.baseTimer]; // Start with the base listItem class

  if (isCurrent) {
    classes.push(styles.currentTimer);
  }

  if (timer.elapsedTime || timer.isRunning) {
    if (timer.isOverrun) {
      classes.push(styles.overrun);
    } else {
      classes.push(styles.run);
    }
  } else {
    classes.push(styles.waiting);
  }

  if (timer.isRunning) {
    classes.push(styles.running);
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
  updateTimerInSequence,
  index,
  isCurrent,
  hasFinished,
}) => {
  const [isEditModeValue, setEditModeValue] = useState(false);
  const [isEditModeName, setEditModeName] = useState(false);

  const handleUpdateTimerValue = (timerToUpdate: Timer, value: string) => {
    if (timerToUpdate) {
      timerToUpdate.expectedTime = parseInt(value);
      updateTimerInSequence(timerToUpdate);
    }
  };

  const handleNameChange = (timerToUpdate: Timer, value: string) => {
    if (timerToUpdate) {
      timerToUpdate.name = value;
      updateTimerInSequence(timerToUpdate);
    }
  };

  const handleEditClick = () => {};

  return (
    <li
      key={timer.id}
      className={getListItemStyle(timer, isCurrent, hasFinished)}
    >
      {/* Elapsed Time */}
      <div className={styles.elapsedTimeColumn}>
        <div className={styles.timeTitle}>Current Time</div>
        <div className={styles.timeDisplay}>
          {formatTime(timer.elapsedTime)}{' '}
        </div>
      </div>
      {/*
        <span>Running: {timer.isRunning ? 'Yes' : 'No'}, </span>
        <span>Overrun: {timer.isOverrun ? 'Yes' : 'No'}</span>
         Buttons 
        */}

      {/* Expected Time */}
      <div className={styles.expectedTimeColumn}>
        <div className={styles.timeTitle}>Expected Time</div>
        <div>
          {isEditModeValue ? (
            <input
              autoFocus
              type="number"
              value={timer.expectedTime}
              onBlur={() => {
                setEditModeValue(false);
              }}
              onChange={(e) => handleUpdateTimerValue(timer, e.target.value)}
            />
          ) : (
            <span
              className={styles.timeDisplay}
              onClick={() => {
                setEditModeValue(true);
              }}
            >
              {formatTime(timer.expectedTime)}{' '}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <div className={styles.nameColumn}>
        {isEditModeName ? (
          <input
            autoFocus
            type="text"
            value={timer.name}
            onChange={(e) => handleNameChange(timer, e.target.value)}
            onBlur={() => {
              setEditModeName(false);
            }}
          />
        ) : (
          <h3
            onClick={() => {
              setEditModeName(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            {timer.name}
          </h3>
        )}
      </div>
      {/* Button row container */}
      <div className={styles.buttonsColumn}>
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
        <button
          className={styles.buttonStyleSmall}
          onClick={() => onRemove(timer.id)}
        >
          Remove
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
