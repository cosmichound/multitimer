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
      {' '}
      Current Elapsed Time: {formatTime(totalRunTime)} -- Current Over Time:{' '}
      {formatTime(totalOverTime)} -- Total Target Time:{' '}
      {formatTime(totalTargetTime)}
    </div>
  );
};

export default StatusPanel;
