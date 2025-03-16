// src/components/TimerSequenceDisplay.tsx
import React from 'react';
import { Timer } from '../logic/timer'; // Adjust path if needed
import TimerDisplay from './TimerDisplay'; // Adjust path if needed
import styles from './BaseStyles.module.css'; // Import CSS Module (convention: import as 'styles')
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface TimerSequenceDisplayProps {
  timerSequence: Timer[];
  currentTimerIndex: number | null;
  onRemove: (timerId: string | number) => void;
  onPause: (timerId: string | number) => void;
  swapTimers: (firstId: string | number, secondId: string | number) => void;
  onStart: (timerId: string | number) => void;
  onNext: (timerId: string | number) => void;
  updateTimerInSequence: (timer: Timer) => void;
}

const TimerSequenceDisplay: React.FC<TimerSequenceDisplayProps> = ({
  timerSequence,
  currentTimerIndex,
  onRemove,
  onPause,
  swapTimers,
  onStart,
  onNext,
  updateTimerInSequence,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over != null) {
      if (active.id !== over.id) {
        swapTimers(active.id, over.id);
      }
    }
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <hr />
        <ul className={styles.list}>
          {' '}
          {/* Unordered list styling */}
          <SortableContext
            items={timerSequence}
            strategy={verticalListSortingStrategy}
          >
            {timerSequence.map((timer, index) => (
              <TimerDisplay
                key={timer.id}
                timer={timer}
                index={index}
                onRemove={onRemove}
                onStart={onStart}
                onPause={onPause}
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
          </SortableContext>
        </ul>
      </DndContext>
    </div>
  );
};
export default TimerSequenceDisplay;
