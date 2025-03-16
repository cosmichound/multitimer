import styles from './BaseStyles.module.css'; // Import CSS Module (convention: import as 'styles')

interface StatusPanelProps {
  totalRunTime: number;
  totalOverTime: number;
  totalTargetTime: number;
}
import { formatTime } from '@/logic/timer';
const StatusPanel: React.FC<StatusPanelProps> = ({
  totalRunTime,
  totalOverTime,
  totalTargetTime,
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.timerContainer}>
        <div className={styles.timeBox}>
          <div className={styles.timeTitle}>Current Elapsed Time</div>
          <div className={styles.timeDisplay}>{formatTime(totalRunTime)}</div>
        </div>
        <div className={styles.timeBox}>
          <div className={styles.timeTitle}>Total Over Time</div>
          <div className={styles.timeDisplay}>{formatTime(totalOverTime)}</div>
        </div>
        <div className={styles.timeBox}>
          <div className={styles.timeTitle}>Total Target Time</div>
          <div className={styles.timeDisplay}>
            {formatTime(totalTargetTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
