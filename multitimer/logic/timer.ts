export interface Timer {
  id: string | number; // Unique identifier for the timer
  expectedTime: number; // Expected duration of the timer in seconds
  elapsedTime: number; // Time elapsed in seconds (starts at 0)
  isRunning: boolean; // Indicates if the timer is currently running (initially false)
  isOverrun: boolean; // Indicates if the timer has exceeded its expected time (initially false)
  name?: string;      // Optional name or label for the timer (e.g., "Phase 1", "Task A")
}

/**
 * Formats time in seconds into MM:SS format.
 * @param totalSeconds Total seconds to format.
 * @returns Time string in MM:SS format (e.g., "05:30").
 */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minutesString = String(minutes).padStart(2, '0'); // Pad with leading zero if necessary
  const secondsString = String(seconds).padStart(2, '0'); // Pad with leading zero if necessary

  return `${minutesString}:${secondsString}`;
}

export function startTimer(timer: Timer): Timer {
  return { ...timer, isRunning: true };
}

export function stopTimer(timer: Timer): Timer {
  return { ...timer, isRunning: false };
}

export function resetTimer(timer: Timer): Timer {
  return {
    ...timer,
    isRunning: false,
    elapsedTime: 0,
    isOverrun: false, // Reset overrun status as well
  };
}

export function updateTimer(timer: Timer, deltaTime: number): Timer {
  if (!timer.isRunning) {
    return timer; // Do nothing if the timer is not running
  }
  const newElapsedTime = timer.elapsedTime + deltaTime;
  return {
    ...timer,
    elapsedTime: newElapsedTime,
    isOverrun: calculateIsOverrun({ ...timer, elapsedTime: newElapsedTime }), // Recalculate overrun
  };
}

export function calculateIsOverrun(timer: Timer): boolean {
  return timer.elapsedTime > timer.expectedTime;
}


/**
 * Adds a new timer to the sequence.
 * @param sequence The current timer sequence.
 * @param newTimer The timer to add.
 * @param position Optional index to insert the timer at. If not provided, adds to the end.
 * @returns The new timer sequence with the timer added.
 */
export function addTimerToSequence(sequence: Timer[], newTimer: Timer, position?: number): Timer[] {
  if (position === undefined || position >= sequence.length) {
    return [...sequence, newTimer]; // Add to the end if no position or position is out of bounds
  } else if (position <= 0) {
    return [newTimer, ...sequence]; // Add to the beginning if position is 0 or negative
  } else {
    const sequenceCopy = [...sequence]; // Create a copy to avoid modifying original array
    sequenceCopy.splice(position, 0, newTimer); // Insert at the specified position
    return sequenceCopy;
  }
}

/**
 * Removes a timer from the sequence based on its ID.
 * @param sequence The current timer sequence.
 * @param timerId The ID of the timer to remove.
 * @returns The new timer sequence with the timer removed, or the original sequence if the timerId is not found.
 */
export function removeTimerFromSequence(sequence: Timer[], timerId: string | number): Timer[] {
  return sequence.filter(timer => timer.id !== timerId);
}

/**
 * Moves a timer within the sequence to a new position.
 * @param sequence The current timer sequence.
 * @param timerId The ID of the timer to move.
 * @param newPosition The new index to move the timer to (0-based).
 * @returns The new timer sequence with the timer moved, or the original sequence if timerId is not found or newPosition is invalid.
 */
export function moveTimerInSequence(sequence: Timer[], timerId: string | number, newPosition: number): Timer[] {
  const timerIndex = sequence.findIndex(timer => timer.id === timerId);

  if (timerIndex === -1 || newPosition < 0 || newPosition >= sequence.length) {
    return sequence; // Timer not found or invalid newPosition, return original sequence
  }

  if (timerIndex === newPosition) {
    return sequence; // Timer is already at the desired position, return original sequence
  }

  const sequenceCopy = [...sequence];
  const timerToMove = sequenceCopy.splice(timerIndex, 1)[0]; // Remove timer from old position
  sequenceCopy.splice(newPosition, 0, timerToMove);        // Insert timer at new position
  return sequenceCopy;
}

/**
 * Reorders the timers in the sequence based on a provided array of timer IDs in the desired order.
 * @param sequence The current timer sequence.
 * @param timerIdsInNewOrder An array of timer IDs in the desired order. Must contain all timer IDs from the sequence.
 * @returns The reordered timer sequence, or the original sequence if timerIdsInNewOrder is invalid or incomplete.
 */
export function reorderTimersInSequence(sequence: Timer[], timerIdsInNewOrder: (string | number)[]): Timer[] {
  if (timerIdsInNewOrder.length !== sequence.length) {
    return sequence; // Invalid reorder array length, return original sequence
  }

  const reorderedSequence: Timer[] = [];
  for (const timerId of timerIdsInNewOrder) {
    const foundTimer = sequence.find(timer => timer.id === timerId);
    if (!foundTimer) {
      return sequence; // Timer ID not found in original sequence, return original sequence (invalid reorder array)
    }
    reorderedSequence.push(foundTimer);
  }
  return reorderedSequence;
}


/**
 * Gets the next timer in the sequence.
 * @param sequence The timer sequence.
 * @param currentTimerId (Optional) The ID of the currently active timer.
 * @returns The next timer in the sequence, or undefined if there is no next timer or sequence is empty.
 */
export function getNextTimer(sequence: Timer[], currentTimerId?: string | number): Timer | undefined {
  if (sequence.length === 0) {
    return undefined; // Empty sequence, no next timer
  }

  if (currentTimerId === undefined) {
    return sequence[0]; // If no current timer ID provided, return the first timer
  }

  const currentTimerIndex = sequence.findIndex(timer => timer.id === currentTimerId);
  if (currentTimerIndex === -1) {
    return sequence[0]; // Current timer ID not found, return the first timer (or handle differently as needed)
  }

  const nextTimerIndex = currentTimerIndex + 1;
  if (nextTimerIndex < sequence.length) {
    return sequence[nextTimerIndex]; // Return the timer at the next index
  } else {
    return undefined; // No more timers in the sequence
  }
}