const INITIAL_STATE = {
    id : '',
    email : '',
    cart: []
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'LOG_IN' : 
            return {
                ...state, 
                id : action.payload.id,
                email : action.payload.email,
                cart: action.payload.cart
            }
        case 'LOG_OUT' :
            return INITIAL_STATE
        default : 
            return state
    }
}