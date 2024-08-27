import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { ColumnType } from 'antd/es/table';
import EditableCell from './EditableCell';

interface DynamicTableProps {
  data: any[];
  onSave: (updatedData: any[]) => void;
  columns: ColumnType<any>[]; // Теперь получаем готовые колонки
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, onSave, columns }) => {
  const [editableData, setEditableData] = useState<any[]>(data);
  const [originalData, setOriginalData] = useState<any[]>(data);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    setEditableData(data);
    setOriginalData(data);
    setHasChanges(false);
  }, [data]);

  useEffect(() => {
    const isModified = JSON.stringify(editableData) !== JSON.stringify(originalData);
    setHasChanges(isModified);
  }, [editableData, originalData]);

  const handleChange = (rowIndex: number, colKey: string, value: any) => {
    const updatedData = [...editableData];
    updatedData[rowIndex][colKey] = value;
    setEditableData(updatedData);
  };

  const handleDelete = () => {
    if (selectedRowIndex !== null) {
      const updatedData = editableData.filter((_, index) => index !== selectedRowIndex);
      setEditableData(updatedData);
      setSelectedRowIndex(null);
    }
  };

  const handleAdd = () => {
    const newItem = {} as any;

    // Обходим колонки, проверяем тип ключа и задаем значения новому элементу
    columns.forEach((column) => {
      const columnKey = column.key as string; // Приводим ключ колонки к строковому типу
      if (columnKey !== undefined && typeof columnKey === 'string') {
        newItem[columnKey] = typeof editableData[0]?.[columnKey] === 'boolean' ? false : '';
      }
    });

    const updatedData = [...editableData, newItem];
    setEditableData(updatedData);
  };

  const handleReset = () => {
    setEditableData(originalData);
  };

  const handleSave = () => {
    onSave(editableData);
  };

  if (!data || data.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <>
      <Table
        dataSource={editableData}
        columns={columns}
        rowKey={(record) => {
          return (
            record.key ||
            record.id ||
            Math.random().toString(36).substr(2, 9)
          );
        }}
        onRow={(record, rowIndex) => ({
          onClick: () => setSelectedRowIndex(rowIndex !== undefined ? rowIndex : null),
          style: {
            cursor: 'pointer',
            backgroundColor: selectedRowIndex === rowIndex ? '#add8e6' : 'transparent',
          },
        })}
        pagination={false}
      />
      <div style={{ marginTop: '10px' }}>
        <Button onClick={handleAdd} style={{ marginRight: '10px' }}>Добавить</Button>
        <Button onClick={handleDelete} style={{ marginRight: '10px' }}>Удалить</Button>
        <Button onClick={handleReset}>Сброс</Button>
      </div>
      <Button 
        onClick={handleSave} 
        style={{ marginTop: '10px' }} 
        disabled={!hasChanges}
      >
        Сохранить изменения
      </Button>
    </>
  );
};

export default DynamicTable;