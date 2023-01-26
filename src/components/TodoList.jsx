import '../styles/todos.css'

export const TodoList = ({ todos, isEditMode, currTodo, removeTodo, setInputEditTodo, updateEditModeOn, editTodo, updateTodoChanges }) => {

    function updateIsCompleted(ev, todo) {
        try {
            updateTodoChanges({ 'id': todo.id, 'completed': ev.target.checked })
        } catch (err) {
            console.log('error update todo:', err)
        }
    }

    return (
        <div className='todo-container'>
            {
                todos.slice(0).reverse().map((todo, index) => (
                    <div key={todo.id ? todo.id : index} className={todo.completed ? 'todo todo-completed' : 'todo'}>
                        <div className={isEditMode && todo.id === currTodo.id ? 'flex-end' : 'flex'}>
                            {todo.id !== currTodo.id &&
                                <p className='todoName'>{todo.name}</p>
                            }
                            <button className='buttonDelete' onClick={() => removeTodo(todo.id)}>X</button>
                        </div>
                        {todo.id !== currTodo.id &&
                            <p className='todoDescription'>{todo.description}</p>
                        }
                        {todo.id !== currTodo.id &&
                            <p className='todoDescription'>{todo.city}</p>
                        }
                        {todo.weather &&
                            <p className='todoDescription'>The current temperature: {todo.weather}</p>
                        }
                        {todo.id === currTodo.id && isEditMode && <input
                            onChange={event => setInputEditTodo('name', event.target.value)}
                            className='input todo-input'
                            value={currTodo.name}
                            placeholder="Name"
                        />}
                        {todo.id === currTodo.id && isEditMode &&
                            <input
                                onChange={event => setInputEditTodo('description', event.target.value)}
                                className='input todo-input'
                                value={currTodo.description}
                                placeholder="Description"
                            />
                        }
                        {todo.id === currTodo.id && isEditMode &&
                            <input
                                onChange={event => setInputEditTodo('city', event.target.value)}
                                className='input todo-input'
                                value={currTodo.city}
                                placeholder="city"
                            />
                        }
                        <hr />
                        <div className='actions'>
                            <input className='checkbox' type='checkbox' onChange={(ev) => updateIsCompleted(ev, todo)} checked={todo.completed} />
                            <button className='buttonTodoAction' onClick={() => todo.id !== currTodo.id ? updateEditModeOn(true, todo) : editTodo(todo)}>{todo.id === currTodo.id ? 'Update' : 'Edit'}</button>
                            {isEditMode && todo.id === currTodo.id &&
                                <button className='buttonTodoAction' onClick={() => updateEditModeOn(false, todo)}>Cancle</button>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
