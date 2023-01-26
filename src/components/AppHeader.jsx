import React from 'react'
import '../styles/header.css'

export const AppHeader = (props) => {

    return (
        <header className="app-header">
            <button className='logout' onClick={props.signOut}>Log Out</button>
        </header>
    )

}
