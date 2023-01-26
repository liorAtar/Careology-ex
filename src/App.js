import React, { useEffect, useState } from 'react'
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify'
import { createTodo, updateTodo, deleteTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'
import awsExports from "./aws-exports"

import axios from 'axios'

import { AppHeader } from './components/AppHeader'
import { CreateTodo } from './components/CreateTodo'
import { TodoList } from './components/TodoList'

Amplify.configure(awsExports);
const apiKey = process.env.REACT_APP_API_KEY
const initialState = { name: '', description: '', city: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [currTodo, setCurrTodo] = useState(initialState)

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  function setInputEditTodo(key, value) {
    setCurrTodo({ ...currTodo, [key]: value })
  }

  async function fetchTodos() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      const filteredTodos = todos.filter(todo => todo.owner === user.username)
      filteredTodos.map(async todo => {
        if (todo.city !== '') {
          const res = await fetchWeather(todo.city)
          const all = [...todos]
          all.find(t => {
            if (t.id === todo.id) {
              todo.weather = res
            }
          })
          setTodos([...all])
        }
      })
      setTodos(filteredTodos)
    } catch (err) { console.log('error fetching todos', err) }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const user = await Auth.currentAuthenticatedUser();
      formState.owner = user.username
      formState.completed = false
      const todo = { ...formState }
      setFormState(initialState)
      const res = await API.graphql(graphqlOperation(createTodo, { input: todo }))
      if (todo.city !== '') {
        const weatherRes = await fetchWeather(todo.city)
        todo.weather = weatherRes
      }
      console.log('todo', todo)
      todo.id = res.data.createTodo.id
      setTodos(prev => [...prev, todo])
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async function fetchWeather(city) {
    try {
      const weather = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
      return weather.data.main.temp
    }
    catch (err) { console.log('error fetching todos', err) }
  }

  async function editTodo(todo) {
    try {
      setIsEditMode(false)
      if (!currTodo.name || !currTodo.description) return
      updateTodosState(todo.id, currTodo)
      setCurrTodo(initialState)
      await API.graphql(graphqlOperation(updateTodo, { input: { ...currTodo } }))
    } catch (err) {
      console.log('error update todo:', err)
    }
  }

  async function updateTodosState(id, todo) {
    let allTodos = [...todos];
    let idx = allTodos.findIndex(t => t.id === id)
    allTodos[idx].name = todo.name
    allTodos[idx].description = todo.description
    if (todo.city !== allTodos[idx].city) {
      allTodos[idx].city = todo.city
      const weatherRes = await fetchWeather(todo.city)
      allTodos.find(t => {
        if (t.id === todo.id) {
          t.weather = weatherRes
        }
      })
    }
    setTodos([...allTodos])
  }

  async function updateTodoChanges(todo) {
    try {
      await API.graphql(graphqlOperation(updateTodo, { input: todo }))
      const all = [...todos]
      all.find(t => {
        if (t.id === todo.id) {
          t.completed = todo.completed
        }
      })
      setTodos([...all])
    } catch (err) {
      console.log('error update todo changes:', err)
    }
  }

  async function removeTodo(todoId) {
    try {
      const todoToSend = {}
      todoToSend.id = todoId
      await API.graphql(graphqlOperation(deleteTodo, { input: todoToSend }))
      let allTodos = [...todos];
      let idx = allTodos.findIndex(t => t.id === todoId)
      allTodos.splice(idx, 1)
      setTodos([...allTodos])
    } catch (err) {
      console.log('error delete todo:', err)
    }
  }

  function updateEditModeOn(isOn, todo) {
    if (isOn) {
      setCurrTodo({ ...currTodo, 'name': todo.name, 'description': todo.description, 'id': todo.id, 'city': todo.city })
      setIsEditMode(true)
    } else {
      setCurrTodo({ ...currTodo, 'name': '', 'description': '', 'id': '', 'city': '' })
      setIsEditMode(false)
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <section className='main-app'>
      <AppHeader signOut={signOut} />
      <div className='container'>
        <CreateTodo setInput={setInput} formState={formState} addTodo={addTodo} />
        <TodoList todos={todos} isEditMode={isEditMode} currTodo={currTodo} removeTodo={removeTodo} setInputEditTodo={setInputEditTodo}
          updateEditModeOn={updateEditModeOn} editTodo={editTodo} updateTodoChanges={updateTodoChanges} />
      </div>
    </section>
  )
}
export default withAuthenticator(App)