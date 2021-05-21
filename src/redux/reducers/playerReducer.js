export const playerReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TO_PLAYER':
            return [
                ...state,
                action.payload
            ]
            
        default:
            return state;
    }
}