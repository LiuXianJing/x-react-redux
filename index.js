import { createContext, useContext, useEffect, useState, } from 'react'
const Context = createContext()

export const Provider = (props) => {

    const { store, children } = props

    return <Context.Provider value={{store}}>
        {children}
    </Context.Provider>
}

export const connect = (mapStateToProps, mapDispatchToProps) => {

    if(!mapStateToProps) {
        mapStateToProps = () => {
            return {}
        }
    }

    if(!mapDispatchToProps) {
        mapDispatchToProps = (dispatch) => {
            return { dispatch }
        }
    }

    return (Component) => {
        return (props) => {

            const { store } = useContext(Context)
            const { getState, dispatch, subscribe } = store
            
            const [ _, forceUpdate ] = useState(0)
            useEffect(() => {
                let unsubscribe = subscribe(() => {
                    forceUpdate(+new Date())
                })
                return () => {
                    unsubscribe()
                }
            }, [])

            let state = getState()
            let newState = mapStateToProps(state)

            let dispatchProps = {}
            if(typeof mapDispatchToProps === 'function') {
                dispatchProps = mapDispatchToProps(dispatch)
            }

            return <Component
            {...props}
            {...newState}
            {...dispatchProps}
            />
        }
    }
}