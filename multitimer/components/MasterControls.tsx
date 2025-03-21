import styles from './BaseStyles.module.css'; // Import CSS Module (convention: import as 'styles')

interface MasterControlsProps {
  onMasterStartPause: () => void;
  onMasterNext: () => void;
  onMasterReset: () => void;
  onDeleteAll: () => void;
  numTimers: number;
  isStarted: boolean;
  isRunning: boolean;
}

const masterControlText = (
  numTimers: number,
  isStarted: boolean,
  isRunning: boolean,
) => {
  if (isStarted) {
    if (isRunning) {
      return 'Pause Running Timer';
    } else {
      return 'Start Current Timer';
    }
  }
  if (numTimers > 0) {
    return 'Start First Timer';
  } else {
    return '(add a timer first)';
  }
};

const MasterControls: React.FC<MasterControlsProps> = ({
  onMasterStartPause,
  onMasterNext,
  onMasterReset,
  onDeleteAll,
  numTimers,
  isStarted,
  isRunning,
}) => {
  return (
    <div>
      <div className={styles.section}>
        <button
          className={styles.buttonStyle}
          onClick={onMasterStartPause}
          disabled={numTimers == 0}
        >
          {masterControlText(numTimers, isStarted, isRunning)}
        </button>
        <button
          className={styles.buttonStyle}
          onClick={onMasterNext}
          disabled={!isRunning}
        >
          Next Timer
        </button>
      </div>
      <div className={styles.section}>
        <button className={styles.buttonStyle} onClick={onMasterReset}>
          Reset All
        </button>
        <button className={styles.buttonStyle} onClick={onDeleteAll}>
          Delete All
        </button>
      </div>
    </div>
  );
};
export default MasterControls;
