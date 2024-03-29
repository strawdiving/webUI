
/**
 * localStorage
 */
export const setStore = (name, content) =>{
    if (!name) return
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
}

/**
 * get localStorage item 
 */
export const getStore = (name) =>{
    if (!name) return
    return window.localStorage.getItem(name)
}

/**
 * remove localStorage item 
 */
export const removeStore = (name) => {
    if (!name) return
    window.localStorage.removeItem(name)
}