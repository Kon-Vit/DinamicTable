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
  const [changedRows, setChangedRows] = useState<Set<string>>(new Set()); // Для отслеживания изменённых строк

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

  // Функция для добавления новой строки
  const handleAddRow = () => {
    const newRow: DataSourceModel = {
      key: Date.now().toString(),
      fio_id: '', 
      razn_t_t_id: null,
      razn_shabl_pl_id: '',
      razn_nak_id: '',
      fio: '',
      razn_t_t_name: '',
      razn_shabl_pl_name: '',
      razn_nak_name: '',
      info: '',
      mam: null,
    };
    setData([newRow, ...data]);
    setChangedRows((prev) => new Set(prev).add(newRow.key)); // Добавляем новую строку в изменённые
  };

  console.log('Изменённые строки (ключи):', Array.from(changedRows));

  // Функция для сохранения данных
  const saveData = async () => {
    try {
      if (changedRows.size === 0) {
        message.warning('Нет изменений для сохранения!');
        return;
      }
  
      const validChangedRows = Array.from(changedRows).filter((key) => key !== undefined);
  
      const changedData = data.filter((row) => validChangedRows.includes(row.key));
  
      const saveRequestData = {
        operation: 'razn_od',
        params: changedData.map((item) => ({
          ...item,
          fio_id: item.fio_id || null,
          razn_t_t_id: item.razn_t_t_id || null,
        })),
      };
  
      console.log('Отправляем изменения:', JSON.stringify(saveRequestData, null, 2));
  
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);
  
      const response = await axios.put(
        'http://87.103.198.92:5544/write_data',
        saveRequestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        message.success('Изменения успешно сохранены!');
        setChangedRows(new Set()); // Очищаем список изменённых строк
      } else {
        throw new Error('Не удалось сохранить изменения.');
      }
    } catch (err) {
      console.error(err);
      message.error('Ошибка при сохранении изменений.');
    }
  };

  // Функция для удаления строки
  const handleDeleteRow = () => {
    if (!selectedRowKey) {
      message.warning('Выберите строку для удаления!');
      return;
    }
    setData(data.filter((item) => item.key !== selectedRowKey));
    setChangedRows((prev) => {
      const updated = new Set(prev);
      updated.delete(selectedRowKey); // Удаляем из изменённых, если строка была изменена
      return updated;
    });
    setSelectedRowKey(null);
  };

  // Обновление данных (с отслеживанием изменений)
  const handleDataChange = (updatedData: DataSourceModel[]) => {
    const updatedKeys = new Set(changedRows);
  
    updatedData.forEach((row, index) => {
      const originalRow = data[index];
      if (JSON.stringify(row) !== JSON.stringify(originalRow) && row.key) {
        updatedKeys.add(row.key); // Добавляем только существующие ключи
      }
    });
  
    setChangedRows(updatedKeys);
    setData(updatedData);
  };

  return (
    <div>
      {/* Кнопки управления */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0' }}>
        <Button onClick={fetchData} loading={loading} style={{ marginRight: 10 }}>
          Загрузить данные
        </Button>
        <Button onClick={saveData} disabled={!changedRows.size} style={{ marginRight: 10 }}>
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
          onDataChange={handleDataChange} // Отслеживаем изменения
          onRowSelect={(key) => setSelectedRowKey(key)}
          selectedRowKey={selectedRowKey}
        />
      )}
    </div>
  );
};

export default PostRequestComponent;