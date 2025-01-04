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
  const [changedRows, setChangedRows] = useState<Set<string>>(new Set());

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
    setChangedRows((prev) => new Set(prev).add(newRow.key));
  };

  console.log('Изменённые строки (ключи):', Array.from(changedRows));

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
        setChangedRows(new Set());
      } else {
        throw new Error('Не удалось сохранить изменения.');
      }
    } catch (err) {
      console.error(err);
      message.error('Ошибка при сохранении изменений.');
    }
  };

  const handleDeleteRow = async () => {
    if (!selectedRowKey) {
      message.warning('Выберите строку для удаления!');
      return;
    }

    const rowToDelete = data.find((item) => item.key === selectedRowKey);
    if (!rowToDelete) {
      message.error('Выбранная строка не найдена.');
      return;
    }

    if (!catalog) {
      message.error('Каталог не найден.');
      return;
    }

    const primaryKey = rowToDelete[catalog.key_list[0]];

    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      const deleteRequestData = {
        operation: 'razn_od',
        params: { [catalog.key_list[0]]: primaryKey },
      };

      const response = await axios.delete('http://87.103.198.92:5544/delete_data', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        data: deleteRequestData,
      });

      if (response.status === 200) {
        const updatedData = data.filter((item) => item.key !== selectedRowKey);
        setData(updatedData);
        message.success('Строка успешно удалена.');
      } else {
        throw new Error('Ошибка удаления.');
      }
    } catch (err) {
      console.error(err);
      message.error('Не удалось удалить строку.');
    } finally {
      setSelectedRowKey(null);
    }
  };

  const handleRowDoubleClick = (key: string | null) => {
    if (key) {
      setSelectedRowKey(key);
      message.info(`Строка с ключом ${key} выделена.`);
    }
  };

  const handleDataChange = (updatedData: DataSourceModel[]) => {
    const updatedKeys = new Set(changedRows);

    updatedData.forEach((row, index) => {
      const originalRow = data[index];
      if (JSON.stringify(row) !== JSON.stringify(originalRow) && row.key) {
        updatedKeys.add(row.key);
      }
    });

    setChangedRows(updatedKeys);
    setData(updatedData);
  };

  return (
    <div>
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
        <Button
          danger
          onClick={handleDeleteRow}
          disabled={!selectedRowKey || !data.some((row) => row.razn_od_key === selectedRowKey)}
        >
          Удалить строку
        </Button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {catalog && columns.length > 0 && (
        <TableWithInfo
          data={data}
          columns={columns}
          catalog={catalog}
          onDataChange={handleDataChange}
          onRowSelect={(key) => setSelectedRowKey(key)}
          selectedRowKey={selectedRowKey}
          onRowDoubleClick={handleRowDoubleClick}
        />
      )}
    </div>
  );
};

export default PostRequestComponent;