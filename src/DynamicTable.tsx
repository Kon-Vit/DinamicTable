import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Checkbox } from 'antd';
import { ColumnModel, DataSourceModel, Catalog } from './models';
import './App.css';

const { Option } = Select;

export interface DynamicTableProps {
  data: DataSourceModel[];
  columns: ColumnModel[];
  catalog: Catalog;
  onDataChange: (updatedData: DataSourceModel[]) => void;
  onRowSelect: (selectedKey: string | null) => void;  // Убрана инициализация
  selectedRowKey: string | null;
  onRowHover: (info: string | null) => void;  // Это обязательное свойство
  onRowDoubleClick: (key: string | null) => void;
}



const DynamicTable: React.FC<DynamicTableProps> = ({
  data,
  columns,
  catalog,
  onDataChange,
  onRowSelect,
  selectedRowKey,
  onRowHover,
  onRowDoubleClick,
  
}) => {
  const [editedData, setEditedData] = useState<DataSourceModel[]>([]);

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

    updatedData[rowIndex].isEdited = true; 
  
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
    onDataChange(updatedData);
  };

  const handleRowClick = (record: DataSourceModel) => {
    if (record.key !== undefined && record.key !== null) {
      const keyAsString = String(record.key);
      onRowSelect(keyAsString);
    } else {
      console.warn('Попытка выделить строку без ключа.');
    }
  };
  
  const handleRowDoubleClick = (record: DataSourceModel) => {
    if (record.key !== undefined && record.key !== null) {
      const keyAsString = String(record.key);
      onRowDoubleClick(keyAsString);
    } else {
      console.warn('Попытка двойного клика на строке без ключа.');
    }
  };
  
  const getRowClassName = (record: DataSourceModel) => {
    const baseClass = record.del ? 'deleted-row' : ''; // Если запись помечена как del = true
    return record.key === selectedRowKey ? `${baseClass} selected-row` : baseClass;
  };


  const getCatalogValue = (
    catalogKey: keyof Catalog,
    value: number | null | undefined
  ): string => {
    if (!value) return ''; // Если значение равно null/undefined, возвращаем пустую строку
    const catalogList = catalog[catalogKey] || [];
    const matchedItem = catalogList.find(
      (item: any) => item.key === value || item.fio_key === value
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
    // Получаем список опций и добавляем "Не определено" вручную
    const options = [{ key: null, name: 'Не определено' }, ...(catalog[catalogKey] || [])];
  
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

 

  const antColumns = columns.map((column) => ({
    title: column.title || column.key,
    dataIndex: column.dataIndex,
    key: column.key,
    render: (text: any, record: DataSourceModel, index: number) => {
      // Условие для вывода выпадающего списка
      if (record.razn_t_t_name === 'Прицеп' || column.title === 'Прицеп') {
        return renderSelect(
          'razn_t_t_id',
          record,
          column.dataIndex,
          index,
          'Выберите прицеп'
        );
      }

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
    ) || <span>{record.fio || 'Не определено'}</span>
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
              placeholder={``}
              className="input-no-border"
             
            />
          );
      }
    },
  }));

  return (
    <div className="dynamic-table-container">
      <Table
        dataSource={editedData}
        columns={antColumns}
        rowKey="key"
        bordered={false}
        scroll={{ y: 400 }}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          onMouseEnter: () => onRowHover(record.info),
          onMouseLeave: () => onRowHover(null),
          onDoubleClick: () => handleRowDoubleClick(record),
        })}
        rowClassName={getRowClassName}
      />
    </div>
  );
};

export default DynamicTable;