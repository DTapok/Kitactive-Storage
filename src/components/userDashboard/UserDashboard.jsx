import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFiles, deleteFile, uploadFile, handleDownload } from '../../actions/filesActions.js';
import { FileIcon } from 'react-file-icon';
import axios from 'axios';
import "./userDashboard.css"
const mimeDb = require('mime-db');

const UserDashboard = () => {

    const dispatch = useDispatch();
    const { files, loading, error } = useSelector(state => state.files);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [downloadError, setDownloadError] = useState(null);
    const token = useSelector(state => state.auth.token);
    const fileInputRef = useRef(null);
    const [imageSrcDict, setImageSrcDict] = useState({});

    useEffect(() => {
        dispatch(getFiles(token));
    }, [dispatch, token]);

    useEffect(() => {
        const renderFilePreview = async (file) => {
            try {
                // Получаем данные изображения с сервера
                const response = await axios.get(`https://js-test.kitactive.ru/api/media/${file.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    responseType: 'blob' // Указываем тип ответа как blob
                });

                const reader = new FileReader();
                reader.readAsDataURL(response.data); // конвертирует Blob в base64 и вызывает onload

                reader.onload = function () {
                    setImageSrcDict(prevState => ({
                        ...prevState,
                        [file.id]: reader.result // Обновляем словарь, добавляя новый ключ и значение
                    }));
                };
            } catch (error) {
                console.error('Ошибка при загрузке изображения:', error);
                // Возвращаем JSX с ошибкой
                return <p>Ошибка при загрузке изображения</p>;
            }
        };

        files.forEach(file => {
            if (file.mimeType.substring(0, file.mimeType.indexOf("/")) === "image") {
                renderFilePreview(file)
            }
        });
    }, [files, token])

    const handleDelete = async (fileId) => {
        await dispatch(deleteFile(fileId, token));
        // После удаления файла обновляем список файлов
        dispatch(getFiles(token));
    };

    const handleDownloadFile = async (fileId, fileName, mimeType) => {
        try {
            await handleDownload(fileId, fileName, mimeType, token);
        } catch (error) {
            setDownloadError('Error downloading file.');
        }
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        if (selected.length > 20) {
            alert('Максимальное количество файлов - 20');
            fileInputRef.current.value = ''; // Сброс значения input
            return;
        }
        if (selected.length + files.length > 20) {
            alert('Вы не можете превысить свой лимит в 20 загруженных файлов на сервер');
            fileInputRef.current.value = ''; // Сброс значения input
            return;
        }
        let totalSize = 0;
        selected.forEach(file => {
            totalSize += file.size;
        });
        if (totalSize > 1048576) {
            alert('Максимальный размер файлов - 1 МБ');
            fileInputRef.current.value = ''; // Сброс значения input
            return;
        }
        setSelectedFiles(Array.from(fileInputRef.current.files));
    };

    const handleUpload = async () => {
        try {
            let totalSize = 0;
            selectedFiles.forEach(file => {
                totalSize += file.size;
            });
            if (totalSize === 0) {
                alert('Нельзя отправлять пустые файлы');
                fileInputRef.current.value = ''; // Сброс значения input
                return;
            } else {
                await dispatch(uploadFile(selectedFiles, token));
                // После успешной загрузки обновляем список файлов
                dispatch(getFiles(token));
                setSelectedFiles([]); // Очищаем выбранные файлы
                fileInputRef.current.value = ''; // Сброс значения input
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    const openFileInput = () => {
        fileInputRef.current.click();
    };

    const nameАbbreviation = (name) => {
        if (name.length > 15) {
            return name.slice(0, 12) + '...';
        }
        return name
    }

    return (
        <div className='dashboard'>
            <h2>Мои файлы {files.length}/20</h2>
            <div className='dashboard_input'>
                <input className='dashboard_input__input' type="file" ref={fileInputRef} onChange={handleFileChange} multiple />
                <div className="custom-file-input" onClick={openFileInput}>
                    {selectedFiles.length < 1 ?
                        <p>Выбрать файлы</p> :
                        <span className="custom-file-input-text">{selectedFiles.map(file => (<span key={file.id}>{file.name}</span>))}</span>}
                </div>
                <button className='form__btn' onClick={handleUpload}>Загрузить</button>
            </div>

            {error && <p className='message'>Произошла ошибка: {error}</p>}
            {loading ? <p className='message'>Loading...</p> :
                <div className='table'>
                    <div className='table__header'>
                        <p></p>
                        <p>Имя файла</p>
                        <p>Тип</p>
                        <p>Сохранён</p>
                    </div>
                    <ul className='files'>
                        {files && files.map(file => (
                            <li className='files__file' key={file.id}>
                                {
                                    file.id in imageSrcDict
                                        ? <img className='files__file__img' src={imageSrcDict[file.id]} alt="" /> :
                                        <div className='files__file__icon'>
                                            <FileIcon
                                                color="#1A754C"
                                                labelColor="#1A754C"
                                                labelUppercase
                                                glyphColor="rgba(255,255,255,0.4)"
                                                extension={mimeDb[file.mimeType].extensions[0]} />
                                        </div>
                                }

                                <p>{nameАbbreviation(file.name)}</p>
                                <p className='file_type'>{mimeDb[file.mimeType].extensions[0]}</p>
                                <p className='file_date'>{new Date(file.createdAt).toISOString().slice(0, 10)}</p>
                                <button className='form__btn' onClick={() => handleDownloadFile(file.id, file.name, file.mimeType)}>Скачать</button>
                                <button className='form__btn' onClick={() => handleDelete(file.id)}>Удалить</button>
                            </li>
                        ))}
                    </ul>
                </div>
            }

            <p className='message'>{downloadError}</p>
        </div>
    );
};

export default UserDashboard;
