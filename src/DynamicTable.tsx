import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Checkbox } from 'antd';
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

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

  const handleEdit = (rowIndex: number, colKey: string, value: any) => {
    const updatedData = [...editedData];
    updatedData[rowIndex][colKey] = value;

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

  const handleSave = () => {
    onSave(editedData);
  };

  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

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
        className="ant-select-no-border" // Добавляем класс для удаления бордера
      >
        {options.map((item: any) => (
          <Option
            key={
              item.key ||
              item.fio_key ||
              item.razn_t_t_key ||
              item.razn_shabl_pl_key ||
              item.razn_nak_key
            }
            value={
              item.key ||
              item.fio_key ||
              item.razn_t_t_key ||
              item.razn_shabl_pl_key ||
              item.razn_nak_key
            }
          >
            {item.name ||
              item.fio ||
              item.t_t ||
              item.shabl_name ||
              item.name_ak ||
              ''}
          </Option>
        ))}
      </Select>
    );
  };

  const renderCheckbox = (
    record: DataSourceModel,
    dataIndex: string,
    rowIndex: number
  ) => {
    return (
      <Checkbox
        checked={record[dataIndex]}
        onChange={(e) => handleEdit(rowIndex, dataIndex, e.target.checked)}
      />
    );
  };

  const antColumns = columns.map((column) => {
    return {
      title: column.title || column.key,
      dataIndex: column.dataIndex,
      key: column.key,
      render: (text: any, record: DataSourceModel, index: number) => {
        if (column.data_type === 'boolean') {
          return renderCheckbox(record, column.dataIndex, index);
        }

        switch (column.dataIndex) {
          case 'fio_id':
            return (
              renderSelect(
                'fio_id',
                record,
                column.dataIndex,
                index,
                'Выберите водителя'
              ) || <span>{record.fio}</span>
            );

          case 'razn_t_t_id':
            return (
              renderSelect(
                'razn_t_t_id',
                record,
                column.dataIndex,
                index,
                'Выберите тип автомобиля'
              ) || <span>{record.razn_t_t_name}</span>
            );

          case 'razn_shabl_pl_id':
            return (
              renderSelect(
                'razn_shabl_pl_id',
                record,
                column.dataIndex,
                index,
                'Выберите тип листа'
              ) || <span>{record.razn_shabl_pl_name}</span>
            );

          case 'razn_nak_id':
            return (
              renderSelect(
                'razn_nak_id',
                record,
                column.dataIndex,
                index,
                'Выберите автоколонну'
              ) || <span>{record.razn_nak_name}</span>
            );

          default:
            return (
              <Input
                value={record[column.dataIndex]}
                onChange={(e) =>
                  handleEdit(index, column.dataIndex, e.target.value)
                }
                placeholder={`Введите ${column.title}`}
                className="input-no-border"
              />
            );
        }
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
        bordered={false} // Убираем бордеры таблицы
      />
      <Button onClick={handleSave} style={{ marginTop: 10 }}>
        Сохранить
      </Button>
    </div>
  );
};

export default DynamicTable;