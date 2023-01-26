import React from 'react'
import '../styles/createTodo.css'

export const CreateTodo = ({setInput, formState, addTodo}) => {

    return (
        <div className='container create-container'>
            <h2 className='create-title'>Amplify Todos</h2>
            <input
                onChange={event => setInput('name', event.target.value)}
                className='input'
                value={formState.name}
                placeholder="Name"
            />
            <input
                onChange={event => setInput('description', event.target.value)}
                className='input'
                value={formState.description}
                placeholder="Description"
            />
            <input
                onChange={event => setInput('city', event.target.value)}
                className='input'
                value={formState.city}
                placeholder="city"
            />
            <button className='button create-btn' onClick={addTodo}>Create Todo</button>
        </div>
    )

}
