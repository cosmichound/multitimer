// src/components/TimerDisplay.tsx
import React, { useState } from 'react';
import { Timer } from '../logic/timer'; // Adjust path if needed
import { formatTime } from '../logic/timer'; // Adjust path if needed
import styles from './TimerDisplay.module.css'; // Import CSS Module (convention: import as 'styles')
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TimerDisplayProps {
  timer: Timer;
  onRemove: (timerId: string | number) => void;
  onStart: (timerId: string | number) => void;
  onNext: (timerId: string | number) => void;
  onPause: (timerId: string | number) => void;
  updateTimerInSequence: (timer: Timer) => void;
  index: number; // Add index as a prop - needed for move up/down
  isCurrent: boolean;
  hasFinished: boolean;
}

const getListItemStyle = (timer: Timer, isCurrent: boolean) => {
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
  onStart,
  onNext,
  onPause,
  updateTimerInSequence,
  isCurrent,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: timer.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <li key={timer.id} className={getListItemStyle(timer, isCurrent)}>
        <div {...listeners} className={styles.draggableHandle}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#888">
            <circle cx="5" cy="5" r="1.5" />
            <circle cx="15" cy="5" r="1.5" />
            <circle cx="5" cy="10" r="1.5" />
            <circle cx="15" cy="10" r="1.5" />
            <circle cx="5" cy="15" r="1.5" />
            <circle cx="15" cy="15" r="1.5" />
          </svg>
        </div>
        <div className={styles.timerContainer}>
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
                  onChange={(e) =>
                    handleUpdateTimerValue(timer, e.target.value)
                  }
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
          {/* Action row container */}
          <div className={styles.buttonsColumn}>
            <div
              className={styles.activeIcon}
              onClick={() => onRemove(timer.id)}
            >
              <svg
                className={styles.removeIcon}
                width="24"
                height="24"
                fill="none"
                stroke="#000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 4 L21 21 M21 4 L4 21" strokeWidth="3" />
              </svg>
            </div>
            {
              !timer.isRunning && (
                <div
                  className={styles.activeIcon}
                  onClick={() => onStart(timer.id)}
                >
                  <svg
                    className={styles.playIcon}
                    width="24"
                    height="24"
                    fill="#000"
                  >
                    <polygon points="2,4 20,12 2,21" />
                  </svg>
                </div>
              ) //<!-- disabled={isAnyTimerRunning()} -->
            }
            {timer.isRunning && (
              <div
                className={styles.activeIcon}
                onClick={() => {
                  console.log('START');
                  onPause(timer.id);
                }}
              >
                <svg
                  className={styles.pauseIcon}
                  width="24"
                  height="24"
                  fill="#000"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              </div>
            )}{' '}
            <div className={styles.activeIcon} onClick={() => onNext(timer.id)}>
              <svg
                className={
                  timer.isRunning
                    ? styles.nextIconRunning
                    : styles.nextIconPaused
                }
                width="24"
                height="24"
                fill="#000"
              >
                <polygon points="2,4 20,12 2,21" />
                <rect x="21" y="4" width="4" height="17" />
              </svg>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};

export default TimerDisplay;
