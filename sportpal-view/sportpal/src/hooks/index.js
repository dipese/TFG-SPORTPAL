/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react'

import API from '../api'

export function useUser (email = null) {
    const [data, setData] = useState([])
    const userEmail = email === null ? localStorage.getItem('user') : email
    
    useEffect (() => {
        if (userEmail){
            API.instance ()
                .findUser (userEmail)
                .then(user => {
                    setData(user)
                })
                .catch (error => {
                    console.error ('Error econtrando usuario:', error)
                    setData(null)
                })
        } else {
            setData (null)
        }
    }, [userEmail])

    const create = (user) => {
        API.instance ().createUser (user).then(user => setData(user))
    }

    
    return {
        user: data,
        create
    }
}