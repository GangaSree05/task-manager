import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from './Loader';
import { ChevronRight } from 'lucide-react';

const NEXT  = { 'Planned': 'In Progress', 'In Progress': 'Complete', 'Complete': null };
const BADGE = {
  'Planned':     { cls: 'badge badge-planned',    label: 'Planned' },
  'In Progress': { cls: 'badge badge-inprogress', label: 'In Progress' },
  'Complete':    { cls: 'badge badge-complete',   label: 'Complete' },
};

const TaskCard = ({ task, onUpdate }) => {
  const [busy, setBusy] = useState(false);
  const next = NEXT[task.status];

  const advance = async () => {
    if (!next) return;
    setBusy(true);
    try {
      const { data } = await api.patch(`/tasks/${task._id}`, { status: next });
      onUpdate(data);
      toast.success(`Moved to "${next}" ✓`);
    } catch {
      toast.error('Update failed');
    } finally {
      setBusy(false);
    }
  };

  const date = new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="task-card">
      <div className="tc-top">
        <span className={BADGE[task.status].cls}>{BADGE[task.status].label}</span>
        <span className="tc-date">{date}</span>
      </div>
      <p className="tc-title">{task.title}</p>
      {task.description && <p className="tc-desc">{task.description}</p>}
      {next && (
        <button
          id={`advance-${task._id}`}
          className="btn-advance"
          onClick={advance}
          disabled={busy}
          aria-label={`Move to ${next}`}
        >
          {busy ? <Loader size="sm" /> : <>{next} <ChevronRight size={12} /></>}
        </button>
      )}
    </div>
  );
};

export default TaskCard;
