import React, { useState } from 'react';
import { Table, Button, Select, Checkbox, Input } from 'antd';
import { ColumnModel, DataSourceModel, Catalog } from './models';
import './App.css'; // Подключаем глобальный файл стилей

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
  const [editedData, setEditedData] = useState<DataSourceModel[]>(data);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Обновление значения ячейки
  const handleEdit = (rowIndex: number, colKey: string, value: any) => {
    const updatedData = [...editedData];
    (updatedData[rowIndex] as any)[colKey] = value;
    setEditedData(updatedData);
  };

  // Сохранение изменений
  const handleSave = () => {
    onSave(editedData);
  };

  // Пагинация
  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  // Функция для получения текста из catalog
  const getCatalogValue = (
    catalogKey: keyof Catalog,
    itemKey: string,
    valueKey: string,
    value: any
  ): string => {
    const catalogItems = catalog[catalogKey] || [];
    const foundItem = catalogItems.find((item: any) => item[itemKey] === value);
    return foundItem ? foundItem[valueKey] : value;
  };

  // Генерация колонок таблицы
  const antColumns = columns.map((column) => {
    return {
      title: column.title || column.key,
      dataIndex: column.dataIndex,
      key: column.key,
      render: (text: any, record: DataSourceModel, index: number) => {
        // Поле с типом данных boolean — рендерим Checkbox
        if (column.data_type === 'boolean') {
          return (
            <Checkbox
              checked={!!record[column.dataIndex]}
              onChange={(e) =>
                handleEdit(index, column.dataIndex, e.target.checked)
              }
            />
          );
        }

        // Поля, которые используют значения из catalog
        if (column.dataIndex === 'razn_t_t_id') {
          return getCatalogValue(
            'razn_t_t_id',
            'razn_t_t_key',
            't_t',
            record.razn_t_t_id
          );
        }
        if (column.dataIndex === 'razn_shabl_pl_id') {
          return getCatalogValue(
            'razn_shabl_pl_id',
            'razn_shabl_pl_key',
            'shabl_name',
            record.razn_shabl_pl_id
          );
        }
        if (column.dataIndex === 'razn_nak_id') {
          return getCatalogValue(
            'razn_nak_id',
            'razn_nak_key',
            'name_ak',
            record.razn_nak_id
          );
        }

        // Поле "fio_id" — рендерим Select, отображая сразу "fio" вместо "fio_key"
        if (column.dataIndex === 'fio_id') {
          const selectedFio =
            catalog.fio_id.find((fio) => fio.fio_key === record.fio_id)?.fio ||
            '';

          return (
            <Select
              value={selectedFio} // Отображается значение "fio"
              onChange={(value) => {
                const selectedKey = catalog.fio_id.find(
                  (fio) => fio.fio === value
                )?.fio_key;
                handleEdit(index, 'fio_id', selectedKey); // Сохраняем "fio_key" в данных
              }}
              style={{ width: '100%' }}
            >
              {catalog.fio_id.map((fio) => (
                <Select.Option key={fio.fio_key} value={fio.fio}>
                  {fio.fio}
                </Select.Option>
              ))}
            </Select>
          );
        }

        // Поле "вид перевозок" — Input с редактированием
        if (column.dataIndex === 'vid_perev') {
          return (
            <Input
              value={record.vid_perev}
              onChange={(e) => handleEdit(index, 'vid_perev', e.target.value)}
              placeholder="Введите вид перевозок"
              className="input-no-border" // Без бордера
            />
          );
        }

        // Поле "вид сообщений" — Input с редактированием
        if (column.dataIndex === 'vid_soob') {
          return (
            <Input
              value={record.vid_soob}
              onChange={(e) => handleEdit(index, 'vid_soob', e.target.value)}
              placeholder="Введите вид сообщений"
              className="input-no-border" // Без бордера
            />
          );
        }

        // Поле с "text" — рендерим Input для редактирования текста
        if (column.data_type === 'text') {
          return (
            <Input
              value={record[column.dataIndex]} // Текущее значение из данных
              onChange={(e) =>
                handleEdit(index, column.dataIndex, e.target.value) // Обновление значения
              }
              placeholder="Введите текст"
              className="input-no-border" // Применяем глобальный класс
            />
          );
        }

        // Остальные типы данных — отображаем текст
        return (
          <div>
            {column.render
              ? typeof column.render === 'function'
                ? column.render(text, record, index)
                : text
              : typeof text === 'boolean'
              ? text.toString()
              : text ?? ''} {/* Отображаем пустую строку для null/undefined */}
          </div>
        );
      },
    };
  });

  return (
    <div>
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
      />
      <Button onClick={handleSave} style={{ marginTop: 10 }}>
        Save
      </Button>
    </div>
  );
};

export default DynamicTable;