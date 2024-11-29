import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Checkbox, message } from 'antd';
import axios from 'axios';
import { ColumnModel, DataSourceModel, Catalog } from './models';
import './App.css';

const { Option } = Select;

interface DynamicTableProps {
  data: DataSourceModel[];
  columns: ColumnModel[];
  catalog: Catalog;
  onSave: (data: DataSourceModel[]) => void;
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  data,
  columns,
  catalog,
  onSave,
}) => {
  const [editedData, setEditedData] = useState<DataSourceModel[]>([]);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRowInfo, setSelectedRowInfo] = useState<DataSourceModel | null>(null); // Состояние для отображения информации о выбранной строке

  // Инициализация данных с соответствующими значениями из каталога
  useEffect(() => {
    const initializedData = data.map((item) => ({
      ...item,
      fio: getCatalogValue('fio_id', item.fio_id),
      razn_t_t_name: getCatalogValue('razn_t_t_id', item.razn_t_t_id),
      razn_shabl_pl_name: getCatalogValue('razn_shabl_pl_id', item.razn_shabl_pl_id),
      razn_nak_name: getCatalogValue('razn_nak_id', item.razn_nak_id),
    }));
    setEditedData(initializedData);
  }, [data, catalog]);

  // Обработка редактирования ячейки таблицы
  const handleEdit = (rowIndex: number, colKey: string, value: any) => {
    const updatedData = [...editedData];
    updatedData[rowIndex][colKey] = value;

    // Обновление соответствующих значений из каталога
    if (colKey === 'fio_id') {
      updatedData[rowIndex].fio = getCatalogValue('fio_id', value);
    }
    if (colKey === 'razn_t_t_id') {
      updatedData[rowIndex].razn_t_t_name = getCatalogValue('razn_t_t_id', value);
    }
    if (colKey === 'razn_shabl_pl_id') {
      updatedData[rowIndex].razn_shabl_pl_name = getCatalogValue('razn_shabl_pl_id', value);
    }
    if (colKey === 'razn_nak_id') {
      updatedData[rowIndex].razn_nak_name = getCatalogValue('razn_nak_id', value);
    }

    setEditedData(updatedData);
  };

  // Сохранение данных на сервере
  const handleSave = async () => {
    try {
      const dataToSave = editedData.map((item) => {
        const cleanedItem: any = { ...item };
        delete cleanedItem.fio;
        delete cleanedItem.razn_t_t_name;
        delete cleanedItem.razn_shabl_pl_name;
        delete cleanedItem.razn_nak_name;

        // Перенос primary_key в razn_od_key
        if ('primary_key' in cleanedItem) {
          cleanedItem.razn_od_key = cleanedItem.primary_key;
          delete cleanedItem.primary_key;
        }

        // Если нет значения razn_od_key, установим null
        if (!cleanedItem.razn_od_key) {
          cleanedItem.razn_od_key = null;
        }

        return cleanedItem;
      });

      const payload = {
        operation: 'razn_od',
        data: dataToSave,
      };

      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      const response = await axios.put(
        'http://87.103.198.92:5544/write_data',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Данные успешно сохранены!');
        onSave(editedData);
      } else {
        throw new Error('Ошибка при сохранении данных');
      }
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      message.error('Не удалось сохранить данные. Попробуйте снова.');
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
    };
    setEditedData([newRow, ...editedData]);
  };

  // Удаление выбранной строки
  const handleDeleteRow = () => {
    if (selectedRowKey === null) {
      message.warning('Выберите строку для удаления!');
      return;
    }

    const updatedData = editedData.filter((item) => item.key !== selectedRowKey);
    setEditedData(updatedData);
    setSelectedRowKey(null); // Сбрасываем выделение
    setSelectedRowInfo(null); // Сбрасываем информацию о строке
  };

  // Обработка клика по строке
  const handleRowClick = (record: DataSourceModel) => {
    setSelectedRowKey(record.key); // Устанавливаем ключ выбранной строки
    setSelectedRowInfo(record); // Обновляем информацию для фрейма
  };

  // Возвращаем CSS класс для выделенной строки
  const getRowClassName = (record: DataSourceModel) => {
    return record.key === selectedRowKey ? 'selected-row' : '';
  };

  // Обработка изменения страницы или размера страницы
  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  // Получение значения из каталога по ключу
  const getCatalogValue = (
    catalogKey: keyof Catalog,
    value: number | null | undefined
  ): string => {
    if (!value) return '';
    const catalogList = catalog[catalogKey] || [];
    const matchedItem = catalogList.find(
      (item: any) => item.key === value || item.razn_nak_key === value
    );
    return (
      matchedItem?.name ||
      matchedItem?.fio ||
      matchedItem?.t_t ||
      matchedItem?.shabl_name ||
      matchedItem?.name_ak ||
      ''
    );
  };

  // Рендеринг выпадающего списка (Select)
  const renderSelect = (
    catalogKey: keyof Catalog,
    record: DataSourceModel,
    dataIndex: string,
    rowIndex: number,
    placeholder: string
  ) => {
    const options = catalog[catalogKey] || [];
    return (
      <Select
        value={record[dataIndex]}
        onChange={(value) => handleEdit(rowIndex, dataIndex, value)}
        style={{ width: '100%', background: 'transparent' }}
        placeholder={placeholder}
        className="ant-select-no-border"
      >
        {options.map((item: any) => (
          <Option
            key={item.key || item.fio_key || item.razn_t_t_key || item.razn_shabl_pl_key || item.razn_nak_key}
            value={item.key || item.fio_key || item.razn_t_t_key || item.razn_shabl_pl_key || item.razn_nak_key}
          >
            {item.name || item.fio || item.t_t || item.shabl_name || item.name_ak || ''}
          </Option>
        ))}
      </Select>
    );
  };

  // Подготовка столбцов для таблицы
  const antColumns = columns.map((column) => ({
    title: column.title || column.key,
    dataIndex: column.dataIndex,
    key: column.key,
    render: (text: any, record: DataSourceModel, index: number) => {
      switch (column.dataIndex) {
        case 'fio_id':
          return renderSelect('fio_id', record, column.dataIndex, index, 'Выберите водителя') || <span>{record.fio}</span>;
        case 'razn_t_t_id':
          return renderSelect('razn_t_t_id', record, column.dataIndex, index, 'Выберите тип автомобиля') || <span>{record.razn_t_t_name}</span>;
        case 'razn_shabl_pl_id':
          return renderSelect('razn_shabl_pl_id', record, column.dataIndex, index, 'Выберите тип листа') || <span>{record.razn_shabl_pl_name}</span>;
        case 'razn_nak_id':
          return renderSelect('razn_nak_id', record, column.dataIndex, index, 'Выберите автоколонну') || <span>{record.razn_nak_name}</span>;
        default:
          return (
            <Input
              value={record[column.dataIndex]}
              onChange={(e) => handleEdit(index, column.dataIndex, e.target.value)}
              placeholder={`Введите ${column.title}`}
              className="input-no-border"
            />
          );
      }
    },
  }));

  return (
    <div>
      <div className="dynamic-table-container">
        <Table
          dataSource={editedData}
          columns={antColumns}
          rowKey={(record: any) => record.key || record.id}
          pagination={{
            current: currentPage,
            pageSize,
            total: editedData.length,
            onChange: handlePaginationChange,
          }}
          bordered={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName={getRowClassName}
        />
      </div>

      {/* Фрейм с дополнительной информацией о выбранной строке */}
      {selectedRowInfo && (
        <div className="info-frame active">
          <h3>Информация о выбранной строке</h3>
          <p><strong>ФИО:</strong> {selectedRowInfo.fio}</p>
          <p><strong>Тип автомобиля:</strong> {selectedRowInfo.razn_t_t_name}</p>
          <p><strong>Тип листа:</strong> {selectedRowInfo.razn_shabl_pl_name}</p>
          <p><strong>Автоколонна:</strong> {selectedRowInfo.razn_nak_name}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <Button onClick={handleSave} style={{ marginRight: 10 }}>Сохранить</Button>
        <Button onClick={handleAddRow} type="primary" style={{ marginRight: 10 }}>Добавить строку</Button>
        <Button danger onClick={handleDeleteRow}>Удалить строку</Button>
      </div>
    </div>
  );
};

export default DynamicTable;