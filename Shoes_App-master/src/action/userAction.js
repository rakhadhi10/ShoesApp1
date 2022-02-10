export const LOG_IN = (data) => {
    return {
        type: 'LOG_IN',
        payload: data
    }
}

export const LOG_OUT = () => {
    return {
        type: 'LOG_OUT'
    }
}