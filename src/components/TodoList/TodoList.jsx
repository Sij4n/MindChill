import React, { useState } from 'react';
import './TodoList.css';
import useStoredState from '../../useStoredState';
import { Plus, Trash2, Target } from 'lucide-react';

const STORAGE_KEY = 'mindchill-todos';

function TodoList({ onFocusTask }) {
    const [todos, setTodos] = useStoredState(STORAGE_KEY, [], v => Array.isArray(v) && v.every(t => t && typeof t.text === 'string' && typeof t.completed === 'boolean' && (typeof t.id === 'number' || typeof t.id === 'string')));
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');

    const addTodo = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newTodo = {
            id: Date.now(),
            text: inputValue.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const completedCount = todos.filter(todo => todo.completed).length;
    const totalCount = todos.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="todo-list glass-card">
            <div className="todo-header">
                <h2>Your little list.</h2>
                <div className="todo-stats">
                    <span>{completedCount}/{totalCount}</span>
                </div>
            </div>

            {/* Progress Bar */}
            {totalCount > 0 && (
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Add Todo Form */}
            <form className="add-todo-form" onSubmit={addTodo}>
                <input
                    type="text"
                    className="todo-input" aria-label="New task" maxLength={300}
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="add-btn" aria-label="Add task" disabled={!inputValue.trim()}>
                    <Plus size={20} />
                </button>
            </form>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {['all', 'active', 'completed'].map((f) => (
                    <button
                        key={f}
                        aria-pressed={filter === f}
                        className={`filter-tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Todo Items */}
            <ul className="todo-items">
                {filteredTodos.length === 0 ? (
                    <li className="empty-state">
                        {filter === 'all'
                            ? 'A little intention goes a long way. Add your first task.'
                            : filter === 'active'
                                ? 'All clear. Take a moment for yourself.'
                                : 'Your small wins will appear here.'}
                    </li>
                ) : (
                    filteredTodos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`todo-item ${todo.completed ? 'completed' : ''}`}
                        >
                            <button
                                className="checkbox" role="checkbox" aria-checked={todo.completed}
                                onClick={() => toggleTodo(todo.id)}
                                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                                {todo.completed && <span className="checkmark">✓</span>}
                            </button>
                            <span className="todo-text">{todo.text}</span>
                            {onFocusTask && !todo.completed && <button className="task-focus-btn" aria-label={`Focus on ${todo.text}`} title="Use as your session intention" onClick={() => onFocusTask(todo.text)}><Target size={17} /></button>}
                            <button
                                className="delete-btn"
                                onClick={() => deleteTodo(todo.id)}
                                aria-label="Delete task"
                            >
                                <Trash2 size={18} />
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* Footer Actions */}
            {completedCount > 0 && (
                <button className="clear-btn" onClick={clearCompleted}>
                    Clear completed ({completedCount})
                </button>
            )}
        </div>
    );
}

export default TodoList;
