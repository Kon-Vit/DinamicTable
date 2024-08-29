import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import DynamicTable from './DynamicTable';
import { ColumnModel } from './models';

const PostRequestComponent: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnModel[]>([]);

  const handleSubmit = async (): Promise<void> => {
    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      const requestData = {
        operation: "razn_od",
        params: [1, null, null],
      };

      const response = await axios.post<any>(
        'http://87.103.198.92:5544/read_data',
        requestData,
        {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}` },
        }
      );

      if (!response.data || !response.data.dataSource || !response.data.columns) {
        throw new Error('Неверный формат ответа от сервера');
      }

      // Устанавливаем колонки и данные напрямую без излишней обработки
      const responseColumns = response.data.columns.map((column: any) => ({
        title: column.title,
        dataIndex: column.dataIndex,
        key: column.key || column.dataIndex,
      }));

      setColumns(responseColumns);
      setData(response.data.dataSource);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при отправке запроса');
      setData([]);
      setColumns([]);
      console.error(err);
    }
  };

  const handleSave = (updatedData: any[]) => {
    console.log('Сохраненные данные:', updatedData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button onClick={handleSubmit}>Отправить POST запрос</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data.length > 0 && columns.length > 0 ? (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9' }}>
          <h3>Ответ от сервера:</h3>
          <DynamicTable 
            data={data} 
            onSave={handleSave} 
            columns={columns}
          />
        </div>
      ) : (
        <p>Нет данных для отображения</p>
      )}
    </div>
  );
};

export default PostRequestComponent;