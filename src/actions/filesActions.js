import axios from 'axios';
const mimeDb = require('mime-db');

// Запрос на получение файлов пользователя
export const getFiles = (token) => async (dispatch) => {
    try {
        dispatch({ type: 'GET_FILES_REQUEST' });
        const response = await axios.get('https://js-test.kitactive.ru/api/media', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({ type: 'GET_FILES_SUCCESS', payload: { files: response.data.files } });
    } catch (error) {
        dispatch({ type: 'GET_FILES_FAILURE', payload: { error: error.message } });
    }
};

// Запрос на загрузку файла
export const uploadFile = (files, token) => async (dispatch) => {
    try {
        dispatch({ type: 'UPLOAD_FILE_REQUEST' });
        const response = await axios.post('https://js-test.kitactive.ru/api/media/upload', { files: files }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch({ type: 'UPLOAD_FILE_SUCCESS', payload: { file: response.data } });
    } catch (error) {
        dispatch({ type: 'UPLOAD_FILE_FAILURE', payload: { error: error.message } });
    }
};

// Запрос на удаление файла
export const deleteFile = (fileId, token) => async (dispatch) => {
    try {
        dispatch({ type: 'DELETE_FILE_REQUEST' });
        await axios.delete(`https://js-test.kitactive.ru/api/media/${fileId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({ type: 'DELETE_FILE_SUCCESS', payload: { fileId } });
    } catch (error) {
        dispatch({ type: 'DELETE_FILE_FAILURE', payload: { error: error.message } });
    }
};

// Запрос на скачивание файла
export const handleDownload = async (fileId, fileName, mimeType, token) => {
    try {
        const response = await axios.get(`https://js-test.kitactive.ru/api/media/${fileId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob' // Указываем тип ответа как blob
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const a = fileName + '.' + mimeDb[mimeType].extensions[0]; // Переводим полученный с сервера MIME
        link.setAttribute('download', a);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        throw new Error('Error downloading file.');
    }
};
