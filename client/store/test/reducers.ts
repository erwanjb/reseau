interface Auth {
    test: string
}
const initialState: Auth = { test: '' }

const testReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return {...state};
    }
}

export default testReducer;