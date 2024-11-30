import React, { useState } from 'react';
import axios from 'axios';
import type { ApiResponse, ColumnModel, DataSourceModel, Catalog } from './models';
import DynamicTable from './DynamicTable';
import TableWithInfo from './TableWithInfo';
import { Button, message } from 'antd';

const PostRequestComponent: React.FC = () => {
  const [columns, setColumns] = useState<ColumnModel[]>([]);
  const [data, setData] = useState<DataSourceModel[]>([]);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  // Функция для загрузки данных с сервера
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      const requestData = {
        operation: 'razn_od',
        params: [1, null, null],
      };

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

      if (!apiResponse.columns || !apiResponse.dataSource || !apiResponse.catalog) {
        throw new Error('Некорректный ответ сервера');
      }

      setColumns(apiResponse.columns);
      setData(apiResponse.dataSource);
      setCatalog(apiResponse.catalog);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  // Функция для сохранения данных
  const saveData = async () => {
    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      const saveRequestData = {
        operation: 'save_razn_od',
        params: data,
      };

      await axios.post(
        'http://87.103.198.92:5544/save_data',
        saveRequestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        }
      );

      message.success('Данные успешно сохранены!');
    } catch (err) {
      message.error('Ошибка при сохранении данных.');
    }
  };

  // Добавление новой строки
  const handleAddRow = () => {
    const newRow: DataSourceModel = {
      key: Date.now().toString(),
      fio_id: null,
      razn_t_t_id: null,
      razn_shabl_pl_id: null,
      razn_nak_id: null,
      fio: '',
      razn_t_t_name: '',
      razn_shabl_pl_name: '',
      razn_nak_name: '',
      info: 'Новая строка', // Дополнительное поле для информации
    };
    setData([newRow, ...data]);
  };

  // Удаление строки
  const handleDeleteRow = () => {
    if (!selectedRowKey) {
      message.warning('Выберите строку для удаления!');
      return;
    }
    setData(data.filter((item) => item.key !== selectedRowKey));
    setSelectedRowKey(null);
  };

  // Обновление данных
  const handleDataChange = (updatedData: DataSourceModel[]) => {
    setData(updatedData);
  };

  return (
    <div>
      {/* Кнопки управления */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0' }}>
        <Button onClick={fetchData} loading={loading} style={{ marginRight: 10 }}>
          Загрузить данные
        </Button>
        <Button onClick={saveData} disabled={!data.length} style={{ marginRight: 10 }}>
          Сохранить
        </Button>
        <Button
          onClick={handleAddRow}
          type="primary"
          disabled={!columns.length || !catalog}
          style={{ marginRight: 10 }}
        >
          Добавить строку
        </Button>
        <Button danger onClick={handleDeleteRow} disabled={!selectedRowKey || !data.length}>
          Удалить строку
        </Button>
      </div>

      {/* Отображение ошибки */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Основная таблица с дополнительной информацией */}
      {catalog && columns.length > 0 && (
        <TableWithInfo
          data={data}
          columns={columns}
          catalog={catalog}
          onDataChange={handleDataChange}
          onRowSelect={(key) => setSelectedRowKey(key)}
          selectedRowKey={selectedRowKey}
        />
      )}
    </div>
  );
};

export default PostRequestComponent;