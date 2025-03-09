// src/components/TimerSequenceDisplay.tsx
import React from 'react';
import { Timer } from '../logic/timer'; // Adjust path if needed
import TimerDisplay from './TimerDisplay'; // Adjust path if needed
import styles from './BaseStyles.module.css'; // Import CSS Module (convention: import as 'styles')

interface TimerSequenceDisplayProps {
  timerSequence: Timer[];
  currentTimerIndex: number | null;
  onRemove: (timerId: string | number) => void;
  onMoveUp: (timerId: string | number, currentIndex: number) => void;
  onMoveDown: (timerId: string | number, currentIndex: number) => void;
  onStart: (timerId: string | number) => void;
  onNext: (timerId: string | number) => void;
  updateTimerInSequence: (timer: Timer) => void;
}

const TimerSequenceDisplay: React.FC<TimerSequenceDisplayProps> = ({
  timerSequence,
  currentTimerIndex,
  onRemove,
  onMoveUp,
  onMoveDown,
  onStart,
  onNext,
  updateTimerInSequence,
}) => {
  return (
    <div>
      <hr />
      <ul className={styles.list}>
        {' '}
        {/* Unordered list styling */}
        {timerSequence.map((timer, index) => (
          <TimerDisplay
            key={timer.id}
            timer={timer}
            index={index}
            onRemove={onRemove}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onStart={onStart}
            onNext={onNext}
            updateTimerInSequence={updateTimerInSequence}
            isCurrent={index == currentTimerIndex}
            hasFinished={
              (currentTimerIndex && index < currentTimerIndex) ||
              (currentTimerIndex == null && timerSequence.length)
                ? true
                : false
            }
          />
        ))}
      </ul>
    </div>
  );
};
export default TimerSequenceDisplay;
