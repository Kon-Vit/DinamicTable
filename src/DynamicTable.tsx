import React, { useEffect, useState } from 'react';
import { Input, Select, Checkbox } from 'antd';
import { VariableSizeList as List } from 'react-window';
import { ColumnModel, DataSourceModel, Catalog } from './models';
import './App.css';

const { Option } = Select;

type CatalogItem = {
  key?: number;
  fio_key?: number;
  name?: string;
  fio?: string;
  t_t?: string;
  shabl_name?: string;
  name_ak?: string;
};

export interface DynamicTableProps {
  data: DataSourceModel[];
  columns: ColumnModel[];
  catalog: Catalog;
  onDataChange: (updatedData: DataSourceModel[]) => void;
  onRowSelect: (selectedKey: string | null) => void;
  selectedRowKey: string | null;
  onRowHover: (info: string | null) => void;
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
    const initializedData = data.map(item => ({
      ...item,
      fio: getCatalogValue('fio_id', item.fio_id),
      razn_t_t_name: getCatalogValue('razn_t_t_id', item.razn_t_t_id),
      razn_shabl_pl_name: getCatalogValue('razn_shabl_pl_id', item.razn_shabl_pl_id),
      razn_nak_name: getCatalogValue('razn_nak_id', item.razn_nak_id),
    }));
    setEditedData(initializedData);
  }, [data, catalog]);

  const getCatalogValue = (catalogKey: keyof Catalog, value: number | null | undefined): string => {
  if (!value) return '';
  const catalogList: CatalogItem[] = catalog[catalogKey] || [];
  const matchedItem = catalogList.find((item: CatalogItem) => item.key === value || item.fio_key === value);
  return matchedItem?.name || matchedItem?.fio || matchedItem?.t_t || matchedItem?.shabl_name || matchedItem?.name_ak || '';
};


  const handleEdit = (rowIndex: number, colKey: string, value: any) => {
    const updatedData = [...editedData];
    updatedData[rowIndex][colKey] = value;
    updatedData[rowIndex].isEdited = true;

    if (colKey === 'fio_id') updatedData[rowIndex].fio = getCatalogValue('fio_id', value);
    if (colKey === 'razn_t_t_id') updatedData[rowIndex].razn_t_t_name = getCatalogValue('razn_t_t_id', value);
    if (colKey === 'razn_shabl_pl_id') updatedData[rowIndex].razn_shabl_pl_name = getCatalogValue('razn_shabl_pl_id', value);
    if (colKey === 'razn_nak_id') updatedData[rowIndex].razn_nak_name = getCatalogValue('razn_nak_id', value);

    setEditedData(updatedData);
    onDataChange(updatedData);
  };

  const handleRowClick = (record: DataSourceModel) => {
    if (record.key !== undefined && record.key !== null) onRowSelect(String(record.key));
  };

  const handleRowDoubleClick = (record: DataSourceModel) => {
    if (record.key !== undefined && record.key !== null) onRowDoubleClick(String(record.key));
  };

  const getRowClassName = (record: DataSourceModel) => {
    const baseClass = record.del ? 'deleted-row' : '';
    return record.key === selectedRowKey ? `${baseClass} selected-row` : baseClass;
  };

  const renderSelect = (
    catalogKey: keyof Catalog,
    record: DataSourceModel,
    dataIndex: string,
    rowIndex: number,
    placeholder: string
  ) => {
    const options = [{ key: null, name: 'Не определено' }, ...(catalog[catalogKey] || [])];
    return (
      <Select
        value={record[dataIndex]}
        onChange={value => handleEdit(rowIndex, dataIndex, value)}
        style={{ width: '100%' }}
        placeholder={placeholder}
      >
        {options.map(item => (
          <Option
            key={item.key || item.fio_key}
            value={item.key || item.fio_key}
          >
            {item.name || item.fio}
          </Option>
        ))}
      </Select>
    );
  };

  const renderCheckbox = (record: DataSourceModel, dataIndex: string, rowIndex: number) => (
    <Checkbox
      checked={record[dataIndex]}
      onChange={e => handleEdit(rowIndex, dataIndex, e.target.checked)}
    />
  );

  const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: DataSourceModel[] }) => {
    const record = data[index];
    return (
      <div
        style={style}
        className={`ant-table-row ${getRowClassName(record)}`}
        onClick={() => handleRowClick(record)}
        onDoubleClick={() => handleRowDoubleClick(record)}
      >
      {columns.map((column, colIndex) => (
  <div
    key={colIndex}
    className="ant-table-cell"
    style={{ display: 'inline-block', width: column.width || 200 }}
  >
    {typeof column.render === 'function'
      ? column.render(record[column.dataIndex], record, index)
      : record[column.dataIndex] || ''}
  </div>
))}
      </div>
    );
  };

  return (
    <div className="dynamic-table-container">
       <div className="table-header" style={{ display: 'flex' }}>
  {columns.map((column) => (
    <div key={column.key || column.dataIndex} style={{ width: column.width || 200, padding: '8px', fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
      {column.title}
    </div>
  ))}
</div>  

      <List
        height={400}
        itemCount={editedData.length}
        itemSize={() => 40}
        itemData={editedData}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

export default DynamicTable;
