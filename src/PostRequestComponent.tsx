import React, { useState } from 'react';
import axios from 'axios';
import DynamicTable from './DynamicTable';

const PostRequestComponent: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<any[]>([]);

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

      if (!response.data || !response.data.dataSource) {
        throw new Error('Неверный формат ответа от сервера');
      }

      const { dataSource, columns: responseColumns } = response.data;

      // Проверка на существование и тип функции render
      const processedColumns = responseColumns.map((column: any) => {
        if (typeof column.render !== 'function') {
          // Устанавливаем render только если оно отсутствует или не является функцией
          return {
            ...column,
            render: (text: any) => text,
          };
        }
        return column;
      });

      setColumns(processedColumns); // Устанавливаем колонки из ответа сервера
      setData(dataSource); // Устанавливаем данные
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при отправке запроса');
      setData([]);
      console.error(err);
    }
  };

  const handleSave = async (updatedData: any[]) => {
    console.log('Сохранение данных:', updatedData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleSubmit}>Отправить POST запрос</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data.length > 0 && columns.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9' }}>
          <h3>Ответ от сервера:</h3>
          <DynamicTable 
            data={data} 
            onSave={handleSave} 
            columns={columns} // Передаем колонки в таблицу
          />
        </div>
      )}
    </div>
  );
};

export default PostRequestComponent;