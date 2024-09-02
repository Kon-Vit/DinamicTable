import React from 'react';
import { Table, Button } from 'antd';
import { ColumnModel, DataSourceModel } from './models';

interface DynamicTableProps {
  data: DataSourceModel[];
  columns: ColumnModel[];
  onSave: (data: DataSourceModel[]) => void;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, columns, onSave }) => {
  const handleSave = () => {
    onSave(data);
  };

  const antColumns = columns.map(column => ({
    title: column.title || column.key,
    dataIndex: column.dataIndex,
    key: column.key,
    render: column.render
      ? (text: any, record: any) => {
          return typeof column.render === 'function'
            ? column.render(text, record)
            : text;
        }
      : (text: any) => text,
  }));

  return (
    <div>
      <Table
        dataSource={data}
        columns={antColumns}
        rowKey={(record: any) => record.key || record.id}
      />
      <Button onClick={handleSave} style={{ marginTop: 10 }}>Save</Button>
    </div>
  );
};

export default DynamicTable;