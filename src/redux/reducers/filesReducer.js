const initialState = {
    files: [],
    loading: false,
    error: null
};

const filesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_FILES_REQUEST':
        case 'UPLOAD_FILE_REQUEST':
        case 'DELETE_FILE_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'GET_FILES_SUCCESS':
            return {
                ...state,
                files: action.payload.files,
                loading: false,
                error: null
            };
        case 'UPLOAD_FILE_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null
            };
        case 'DELETE_FILE_SUCCESS':
            return {
                ...state,
                files: state.files.filter(file => file.id !== action.payload.fileId),
                loading: false,
                error: null
            };
        case 'GET_FILES_FAILURE':
        case 'UPLOAD_FILE_FAILURE':
        case 'DELETE_FILE_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        default:
            return state;
    }
};

export default filesReducer;
