import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from './Loader';
import { Plus } from 'lucide-react';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/tasks', { title: title.trim(), description: description.trim() });
      onTaskCreated(data);
      setTitle(''); setDescription('');
      toast.success('Task created!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} id="create-task-form">
      <div className="form-header">
        <h2 className="form-title">New Task</h2>
        <p className="form-subtitle">Add it to your board</p>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            id="task-title" type="text" className="form-input"
            placeholder="What needs to be done?"
            value={title} onChange={(e) => setTitle(e.target.value)}
            maxLength={200} disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-description" className="form-label">
            Description <span className="optional">(optional)</span>
          </label>
          <textarea
            id="task-description" className="form-textarea"
            placeholder="Add more details..."
            value={description} onChange={(e) => setDescription(e.target.value)}
            maxLength={1000} rows={3} disabled={loading}
          />
        </div>
        <button id="submit-task-btn" type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <Loader size="sm" /> : <><Plus size={16} /> Add Task</>}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
