import {
  Timer,
  startTimer,
  stopTimer,
  resetTimer,
  updateTimer,
  calculateIsOverrun,
  addTimerToSequence,
  removeTimerFromSequence,
  moveTimerInSequence,
  reorderTimersInSequence,
  getNextTimer,
  formatTime,
} from './timer'; // Adjust path if necessary

describe('timerLogic', () => {
  describe('startTimer', () => {
    it('should set isRunning to true', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      };
      const startedTimer = startTimer(initialTimer);
      expect(startedTimer.isRunning).toBe(true);
    });

    it('should not modify other timer properties', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 10,
        isRunning: false,
        isOverrun: true,
      };
      const startedTimer = startTimer(initialTimer);
      expect(startedTimer.expectedTime).toBe(initialTimer.expectedTime);
      expect(startedTimer.elapsedTime).toBe(initialTimer.elapsedTime);
      expect(startedTimer.isOverrun).toBe(initialTimer.isOverrun);
      expect(startedTimer.id).toBe(initialTimer.id);
    });
  });

  describe('stopTimer', () => {
    it('should set isRunning to false', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 15,
        isRunning: true, // Initially running
        isOverrun: false,
      };
      const stoppedTimer = stopTimer(initialTimer);
      expect(stoppedTimer.isRunning).toBe(false);
    });

    it('should not modify other timer properties', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 15,
        isRunning: true,
        isOverrun: true,
      };
      const stoppedTimer = stopTimer(initialTimer);
      expect(stoppedTimer.expectedTime).toBe(initialTimer.expectedTime);
      expect(stoppedTimer.elapsedTime).toBe(initialTimer.elapsedTime);
      expect(stoppedTimer.isOverrun).toBe(initialTimer.isOverrun);
      expect(stoppedTimer.id).toBe(initialTimer.id);
    });
  });

  describe('resetTimer', () => {
    it('should set isRunning to false, elapsedTime to 0, and isOverrun to false', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 70, // Already overrun and some elapsed time
        isRunning: true,
        isOverrun: true,
      };
      const resetTimerResult = resetTimer(initialTimer);
      expect(resetTimerResult.isRunning).toBe(false);
      expect(resetTimerResult.elapsedTime).toBe(0);
      expect(resetTimerResult.isOverrun).toBe(false);
    });

    it('should not modify other timer properties', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 70,
        isRunning: true,
        isOverrun: true,
        name: 'Test Timer', // Example name
      };
      const resetTimerResult = resetTimer(initialTimer);
      expect(resetTimerResult.expectedTime).toBe(initialTimer.expectedTime);
      expect(resetTimerResult.id).toBe(initialTimer.id);
      expect(resetTimerResult.name).toBe(initialTimer.name); // Check name is preserved
    });
  });

  describe('updateTimer', () => {
    it('should increment elapsedTime by deltaTime if running', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 10,
        isRunning: true,
        isOverrun: false,
      };
      const deltaTime = 5;
      const updatedTimer = updateTimer(initialTimer, deltaTime);
      expect(updatedTimer.elapsedTime).toBe(15); // 10 + 5 = 15
    });

    it('should not increment elapsedTime if not running', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 10,
        isRunning: false, // Not running
        isOverrun: false,
      };
      const deltaTime = 5;
      const updatedTimer = updateTimer(initialTimer, deltaTime);
      expect(updatedTimer.elapsedTime).toBe(10); // Should remain unchanged
    });

    it('should update isOverrun to true if elapsedTime exceeds expectedTime', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 55,
        isRunning: true,
        isOverrun: false,
      };
      const deltaTime = 10; // Will push elapsedTime over expectedTime
      const updatedTimer = updateTimer(initialTimer, deltaTime);
      expect(updatedTimer.isOverrun).toBe(true);
    });

    it('should update isOverrun to false if elapsedTime is still within expectedTime', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 50,
        isRunning: true,
        isOverrun: true, // Initially overrun (for test setup)
      };
      const deltaTime = 5; // Will keep elapsedTime within expectedTime
      const updatedTimer = updateTimer(initialTimer, deltaTime);
      expect(updatedTimer.isOverrun).toBe(false); // Should become false
    });

    it('should not modify other timer properties except elapsedTime and isOverrun', () => {
      const initialTimer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 10,
        isRunning: true,
        isOverrun: false,
        name: 'Test Timer',
      };
      const deltaTime = 5;
      const updatedTimer = updateTimer(initialTimer, deltaTime);
      expect(updatedTimer.expectedTime).toBe(initialTimer.expectedTime);
      expect(updatedTimer.isRunning).toBe(initialTimer.isRunning); // isRunning should not change during update
      expect(updatedTimer.id).toBe(initialTimer.id);
      expect(updatedTimer.name).toBe(initialTimer.name);
    });
  });

  describe('calculateIsOverrun', () => {
    it('should return true if elapsedTime is greater than expectedTime', () => {
      const timer: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 70, // Overrun
        isRunning: false,
        isOverrun: false, // Initial value doesn't matter for this test
      };
      expect(calculateIsOverrun(timer)).toBe(true);
    });

    it('should return false if elapsedTime is less than or equal to expectedTime', () => {
      const timer1: Timer = {
        id: 'timer1',
        expectedTime: 60,
        elapsedTime: 50, // Not overrun
        isRunning: false,
        isOverrun: false,
      };
      expect(calculateIsOverrun(timer1)).toBe(false);

      const timer2: Timer = {
        id: 'timer2',
        expectedTime: 60,
        elapsedTime: 60, // Exactly at expected time (not overrun)
        isRunning: false,
        isOverrun: false,
      };
      expect(calculateIsOverrun(timer2)).toBe(false);
    });
  });
});

// ... (previous describe('timerLogic', ...) block with tests for timer functions)

describe('timerSequenceManagement', () => {
  describe('addTimerToSequence', () => {
    const initialSequence: Timer[] = [
      {
        id: 'timer1',
        expectedTime: 30,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
      {
        id: 'timer2',
        expectedTime: 60,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
    ];
    const newTimer: Timer = {
      id: 'timer3',
      expectedTime: 45,
      elapsedTime: 0,
      isRunning: false,
      isOverrun: false,
    };

    it('should add a timer to the end of the sequence if no position is provided', () => {
      const updatedSequence = addTimerToSequence(initialSequence, newTimer);
      expect(updatedSequence.length).toBe(3);
      expect(updatedSequence[2]).toBe(newTimer); // Added at the end (index 2)
    });

    it('should add a timer at the specified position', () => {
      const updatedSequence = addTimerToSequence(initialSequence, newTimer, 1); // Insert at index 1
      expect(updatedSequence.length).toBe(3);
      expect(updatedSequence[1]).toBe(newTimer);
      expect(updatedSequence[2]).toBe(initialSequence[1]); // Original timer2 shifted to index 2
    });

    it('should add a timer to the beginning if position is 0', () => {
      const updatedSequence = addTimerToSequence(initialSequence, newTimer, 0);
      expect(updatedSequence.length).toBe(3);
      expect(updatedSequence[0]).toBe(newTimer);
      expect(updatedSequence[1]).toBe(initialSequence[0]); // Original timer1 shifted to index 1
    });

    it('should add a timer to the end if position is greater than or equal to sequence length', () => {
      const updatedSequence = addTimerToSequence(initialSequence, newTimer, 5); // Position out of bounds
      expect(updatedSequence.length).toBe(3);
      expect(updatedSequence[2]).toBe(newTimer); // Added at the end
    });

    it('should add a timer to the beginning if position is negative', () => {
      const updatedSequence = addTimerToSequence(initialSequence, newTimer, -1); // Negative position
      expect(updatedSequence.length).toBe(3);
      expect(updatedSequence[0]).toBe(newTimer); // Added at the beginning
    });

    it('should return a new array instance (immutability)', () => {
      const updatedSequence = addTimerToSequence(initialSequence, newTimer);
      expect(updatedSequence).not.toBe(initialSequence); // Not the same array instance
    });
  });

  describe('removeTimerFromSequence', () => {
    const initialSequence: Timer[] = [
      {
        id: 'timer1',
        expectedTime: 30,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
      {
        id: 'timer2',
        expectedTime: 60,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
      {
        id: 'timer3',
        expectedTime: 45,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
    ];

    it('should remove a timer with the given ID', () => {
      const updatedSequence = removeTimerFromSequence(
        initialSequence,
        'timer2',
      );
      expect(updatedSequence.length).toBe(2);
      expect(
        updatedSequence.find((timer) => timer.id === 'timer2'),
      ).toBeUndefined(); // timer2 is removed
      expect(updatedSequence[0]).toBe(initialSequence[0]); // timer1 is still there
      expect(updatedSequence[1]).toBe(initialSequence[2]); // timer3 is still there (shifted index)
    });

    it('should return the original sequence if timerId is not found', () => {
      const updatedSequence = removeTimerFromSequence(
        initialSequence,
        'timer4',
      ); // ID not in sequence
      expect(updatedSequence).toEqual(initialSequence); // Should return the same array instance (or at least be deeply equal if we were not checking instance identity)
    });

    it('should return a new array instance (immutability)', () => {
      const updatedSequence = removeTimerFromSequence(
        initialSequence,
        'timer2',
      );
      expect(updatedSequence).not.toBe(initialSequence);
    });
  });

  describe('moveTimerInSequence', () => {
    const initialSequence: Timer[] = [
      {
        id: 'timer1',
        expectedTime: 30,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
      {
        id: 'timer2',
        expectedTime: 60,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
      {
        id: 'timer3',
        expectedTime: 45,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
    ];

    it('should move a timer to a new valid position', () => {
      const updatedSequence = moveTimerInSequence(initialSequence, 'timer2', 0); // Move timer2 to the beginning
      expect(updatedSequence[0]).toBe(initialSequence[1]); // timer2 is now first
      expect(updatedSequence[1]).toBe(initialSequence[0]); // timer1 shifted to index 1
      expect(updatedSequence[2]).toBe(initialSequence[2]); // timer3 remains at index 2
    });

    it('should return the original sequence if timerId is not found', () => {
      const updatedSequence = moveTimerInSequence(initialSequence, 'timer4', 1); // timer4 not found
      expect(updatedSequence).toBe(initialSequence);
    });

    it('should return the original sequence if newPosition is invalid (out of bounds)', () => {
      const updatedSequence1 = moveTimerInSequence(
        initialSequence,
        'timer2',
        -1,
      ); // Negative position
      const updatedSequence2 = moveTimerInSequence(
        initialSequence,
        'timer2',
        3,
      ); // Position >= sequence length
      expect(updatedSequence1).toBe(initialSequence);
      expect(updatedSequence2).toBe(initialSequence);
    });

    it('should return the original sequence if timer is already at newPosition', () => {
      const updatedSequence = moveTimerInSequence(initialSequence, 'timer2', 1); // timer2 is already at index 1
      expect(updatedSequence).toBe(initialSequence);
    });

    it('should return a new array instance (immutability)', () => {
      const updatedSequence = moveTimerInSequence(initialSequence, 'timer2', 0);
      expect(updatedSequence).not.toBe(initialSequence);
    });
  });

  describe('reorderTimersInSequence', () => {
    const initialSequence: Timer[] = [
      {
        id: 'timer1',
        expectedTime: 30,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
      {
        id: 'timer2',
        expectedTime: 60,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
      {
        id: 'timer3',
        expectedTime: 45,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
    ];
    const timerIdsInNewOrder = ['timer3', 'timer1', 'timer2']; // New order of IDs

    it('should reorder timers according to the provided order of IDs', () => {
      const updatedSequence = reorderTimersInSequence(
        initialSequence,
        timerIdsInNewOrder,
      );
      expect(updatedSequence[0]).toBe(initialSequence[2]); // timer3 (original index 2) is now first
      expect(updatedSequence[1]).toBe(initialSequence[0]); // timer1 (original index 0) is now second
      expect(updatedSequence[2]).toBe(initialSequence[1]); // timer2 (original index 1) is now third
    });

    it('should return the original sequence if timerIdsInNewOrder has incorrect length', () => {
      const invalidOrder = ['timer3', 'timer1']; // Missing timer2 ID
      const updatedSequence = reorderTimersInSequence(
        initialSequence,
        invalidOrder,
      );
      expect(updatedSequence).toBe(initialSequence);
    });

    it('should return the original sequence if timerIdsInNewOrder contains invalid timer IDs', () => {
      const invalidOrder = ['timer3', 'timer1', 'timer4']; // timer4 is not in original sequence
      const updatedSequence = reorderTimersInSequence(
        initialSequence,
        invalidOrder,
      );
      expect(updatedSequence).toBe(initialSequence);
    });

    it('should return a new array instance (immutability)', () => {
      const updatedSequence = reorderTimersInSequence(
        initialSequence,
        timerIdsInNewOrder,
      );
      expect(updatedSequence).not.toBe(initialSequence);
    });
  });

  describe('getNextTimer', () => {
    const sequence: Timer[] = [
      {
        id: 'timer1',
        expectedTime: 30,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
      {
        id: 'timer2',
        expectedTime: 60,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
      {
        id: 'timer3',
        expectedTime: 45,
        elapsedTime: 0,
        isRunning: false,
        isOverrun: false,
      },
    ];

    it('should return the first timer if sequence is not empty and no currentTimerId is provided', () => {
      const nextTimer = getNextTimer(sequence);
      expect(nextTimer).toBe(sequence[0]); // First timer is timer1
    });

    it('should return undefined if sequence is empty', () => {
      const nextTimer = getNextTimer([]);
      expect(nextTimer).toBeUndefined();
    });

    it('should return the next timer in the sequence given a currentTimerId', () => {
      const nextTimer = getNextTimer(sequence, 'timer1');
      expect(nextTimer).toBe(sequence[1]); // Next timer after timer1 is timer2
    });

    it('should return undefined if currentTimerId is the last timer in the sequence', () => {
      const nextTimer = getNextTimer(sequence, 'timer3'); // timer3 is the last
      expect(nextTimer).toBeUndefined();
    });

    it('should return the first timer if currentTimerId is not found in the sequence', () => {
      const nextTimer = getNextTimer(sequence, 'timer4'); // timer4 is not in sequence
      expect(nextTimer).toBe(sequence[0]); // Should default to the first timer (timer1)
    });
  });

  describe('formatTime', () => {
    it('should format 0 seconds as "00:00"', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('should format seconds less than a minute correctly (e.g., 30 seconds)', () => {
      expect(formatTime(30)).toBe('00:30');
    });

    it('should format seconds equal to one minute as "01:00"', () => {
      expect(formatTime(60)).toBe('01:00');
    });

    it('should format seconds more than one minute correctly (e.g., 90 seconds)', () => {
      expect(formatTime(90)).toBe('01:30');
    });

    it('should format seconds with minutes and seconds having single digits correctly (e.g., 65 seconds)', () => {
      expect(formatTime(65)).toBe('01:05');
    });

    it('should format seconds with minutes having double digits correctly (e.g., 660 seconds - 11 minutes)', () => {
      expect(formatTime(660)).toBe('11:00');
    });

    it('should format seconds close to an hour correctly (e.g., 3599 seconds - 59 minutes 59 seconds)', () => {
      expect(formatTime(3599)).toBe('59:59');
    });

    // You can add more test cases, for example, for larger numbers of seconds if you expect to handle hours, etc.
    // For now, MM:SS format is generally for minutes and seconds, so these tests are a good starting point.
  });
});
