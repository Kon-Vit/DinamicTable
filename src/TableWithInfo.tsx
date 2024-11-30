import React, { useState } from 'react';
import { DynamicTableProps } from './DynamicTable';
import DynamicTable from './DynamicTable';
import { DataSourceModel, ColumnModel, Catalog } from './models';

interface TableWithInfoProps {
  data: DataSourceModel[];
  columns: ColumnModel[];
  catalog: Catalog;
  onDataChange: (updatedData: DataSourceModel[]) => void;
  onRowSelect: (selectedKey: string | null) => void;
  selectedRowKey: string | null;
}

const TableWithInfo: React.FC<TableWithInfoProps> = ({
  data,
  columns,
  catalog,
  onDataChange,
  onRowSelect,
  selectedRowKey,
}) => {
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  // Функция для обновления информации при наведении
  const handleRowHover = (info: string | null) => {
    setHoveredInfo(info || "Информация отсутствует"); // Если данных нет, показываем дефолтное сообщение
  };

  return (
    <div style={{ position: 'relative', minHeight: '200px' }}>
      <DynamicTable
        data={data}
        columns={columns}
        catalog={catalog}
        onDataChange={onDataChange}
        onRowSelect={onRowSelect}
        selectedRowKey={selectedRowKey}
        onRowHover={handleRowHover} // Передаем обработчик для наведения
      />

      {/* Фрейм всегда отображается */}
      <div
        style={{
          position: 'absolute',
          background: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          top: '10px', // Установите фиксированное положение
          left: '10px',
          zIndex: 1000,
          width: '300px', // Задаем ширину фрейма
        }}
      >
        {hoveredInfo || "Наведите на строку для получения информации"}
      </div>
    </div>
  );
};

export default TableWithInfo;