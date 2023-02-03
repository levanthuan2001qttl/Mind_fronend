export const initialState = null

// state save info user
export const reducer = (state, action ) => {
    
    let newState
    switch(action.type){
        case "USER": 
            newState = action.payload
            break
        case "CLEAR":
            newState = null
            break    
        case "UPDATE":
            newState = {
                ...state,
                following: action.payload.following,
                followers: action.payload.followers
            }   
            break 
        case "UPLOADAVATART":
            newState = {
                ...state,
                pic: action.payload
            }   
            break 
        default:
            throw new Error('Invalid action')    
    }
    return newState
}