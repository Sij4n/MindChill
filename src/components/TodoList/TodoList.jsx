import React, { useState, useEffect } from 'react';
import './TodoList.css';

const STORAGE_KEY = 'mindchill-todos';

function TodoList() {
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

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
                <h2>✅ To-Do List</h2>
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
                    className="todo-input"
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="add-btn" disabled={!inputValue.trim()}>
                    ➕
                </button>
            </form>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {['all', 'active', 'completed'].map((f) => (
                    <button
                        key={f}
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
                            ? '🎯 Add your first task!'
                            : filter === 'active'
                                ? '🎉 All tasks completed!'
                                : '📝 No completed tasks yet'}
                    </li>
                ) : (
                    filteredTodos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`todo-item ${todo.completed ? 'completed' : ''}`}
                        >
                            <button
                                className="checkbox"
                                onClick={() => toggleTodo(todo.id)}
                                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                                {todo.completed && <span className="checkmark">✓</span>}
                            </button>
                            <span className="todo-text">{todo.text}</span>
                            <button
                                className="delete-btn"
                                onClick={() => deleteTodo(todo.id)}
                                aria-label="Delete task"
                            >
                                🗑️
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* Footer Actions */}
            {completedCount > 0 && (
                <button className="clear-btn" onClick={clearCompleted}>
                    🧹 Clear completed ({completedCount})
                </button>
            )}
        </div>
    );
}

export default TodoList;
