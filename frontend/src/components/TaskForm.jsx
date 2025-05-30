
import React, { useState } from 'react';
import './TaskForm.css';

export default function TaskForm({ onTaskCreated }) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [status, setStatus] = useState('To Do');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!title || !dueDate || !priority || !status) {
            setError('All fields are required.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, dueDate, priority, status })
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Failed to add task.');
                setLoading(false);
                return;
            }
            setTitle('');
            setDueDate('');
            setPriority('Medium');
            setStatus('To Do');
            setLoading(false);
            if (onTaskCreated) onTaskCreated();
        } catch (err) {
            setError('Failed to add task.');
            setLoading(false);
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>Add New Task</h2>
            {error && <div className="error-message">{error}</div>}
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Due Date:</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            <div>
                <label>Priority:</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div>
                <label>Status:</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Task'}</button>
        </form>
    );
}