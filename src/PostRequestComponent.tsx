import React, { useState } from 'react';
import axios from 'axios';
import type { ApiResponse, ColumnModel, DataSourceModel, Catalog } from './models';
import DynamicTable from './DynamicTable';
import { message } from 'antd'; // Используем Ant Design для уведомлений

const PostRequestComponent: React.FC = () => {
  const [columns, setColumns] = useState<ColumnModel[]>([]); // Колонки для таблицы
  const [data, setData] = useState<DataSourceModel[]>([]); // Данные для таблицы
  const [catalog, setCatalog] = useState<Catalog | null>(null); // Справочник
  const [loading, setLoading] = useState(false); // Индикатор загрузки
  const [error, setError] = useState<string | null>(null); // Ошибка

  // Функция для получения данных
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Авторизация
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      // Тело запроса
      const requestData = {
        operation: 'razn_od',
        params: [1, null, null],
      };

      // Отправка запроса на сервер
      const response = await axios.post<ApiResponse>(
        'http://87.103.198.92:5544/read_data',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        }
      );

      const apiResponse = response.data;

      // Проверка наличия необходимых данных в ответе
      if (!apiResponse.columns || !apiResponse.dataSource || !apiResponse.catalog) {
        throw new Error('Некорректный ответ сервера');
      }

      // Обновление состояния с полученными данными
      setColumns(apiResponse.columns);
      setData(apiResponse.dataSource);
      setCatalog(apiResponse.catalog);
    } catch (err) {
      console.error(err);

      // Установка сообщения об ошибке
      setError(
        err instanceof Error
          ? err.message
          : 'Произошла неизвестная ошибка при загрузке данных'
      );
    } finally {
      setLoading(false); // Завершение загрузки
    }
  };

  // Функция для сохранения данных
  const saveData = async (payload: DataSourceModel[]) => {
    try {
      const response = await axios.put(
        'http://87.103.198.92:5544/write_data',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa('sirius220@yandex.ru:qwe')}`,
          },
        }
      );

      console.log('Ответ сервера:', response);

      if (response.status === 200) {
        message.success('Данные успешно сохранены!');
        setData(payload); // Обновляем данные в состоянии
      } else {
        throw new Error(`Сервер вернул статус ${response.status}`);
      }
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      if (axios.isAxiosError(error)) {
        console.error('Ответ сервера:', error.response?.data);
      }
      message.error('Не удалось сохранить данные. Попробуйте снова.');
    }
  };
 
  return (
    <div>
      {/* Кнопка для загрузки данных */}
      <button onClick={fetchData} disabled={loading} style={{ marginBottom: '20px' }}>
        {loading ? 'Загрузка...' : 'Загрузить данные'}
      </button>

      {/* Сообщение об ошибке */}
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {/* Рендеринг таблицы только при наличии данных */}
      {catalog && columns.length > 0 && data.length > 0 && (
        <DynamicTable
          data={data}
          columns={columns}
          catalog={catalog}
          onSave={(updatedData) => {
            saveData(updatedData); // Сохраняем данные через saveData
          }}
        />
      )}
    </div>
  );
};

export default PostRequestComponent;