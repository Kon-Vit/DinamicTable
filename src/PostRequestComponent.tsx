import React, { useState } from 'react';
import axios from 'axios';
import { ApiResponse, ColumnModel, DataSourceModel } from './models';
import DynamicTable from './DynamicTable';

const PostRequestComponent: React.FC = () => {
  const [columns, setColumns] = useState<ColumnModel[]>([]);
  const [data, setData] = useState<DataSourceModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      const requestData = {
        operation: "razn_od",
        params: [1, null, null],
      };

      const response = await axios.post<ApiResponse>('http://87.103.198.92:5544/read_data', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`,
        },
      });

      const apiResponse = response.data;

      console.log('API Response:', apiResponse);

      // Проверка наличия необходимых данных в ответе API
      if (!apiResponse.columns || !apiResponse.dataSource) {
        throw new Error('Необходимые данные отсутствуют в ответе API');
      }

      // Установка данных в состояние
      setColumns(apiResponse.columns || []);
      setData(apiResponse.dataSource || []);
      setError(null);
    } catch (err) {
      console.error('Ошибка при отправке запроса:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при отправке запроса');
    }
  };

  const handleFetchClick = () => {
    fetchData();
  };

  const handleSave = (updatedData: DataSourceModel[]) => {
    console.log('Updated Data:', updatedData);
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleFetchClick}>Запросить данные</button>
      <DynamicTable data={data} columns={columns} onSave={handleSave} />
    </div>
  );
};

export default PostRequestComponent;