import React, { useState } from "react";
import { DynamicTableProps } from "./DynamicTable";
import DynamicTable from "./DynamicTable";
import { DataSourceModel, ColumnModel, Catalog } from "./models";
import "./App.css";

interface TableWithInfoProps {
  data: DataSourceModel[];
  columns: ColumnModel[];
  catalog: Catalog;
  onDataChange: (updatedData: DataSourceModel[]) => void;
  onRowSelect: (selectedKey: string | null) => void;
  selectedRowKey: string | null;
  onRowDoubleClick: (key: string | null) => void;
}

const TableWithInfo: React.FC<TableWithInfoProps> = ({
  data,
  columns,
  catalog,
  onDataChange,
  onRowSelect,
  selectedRowKey,
  onRowDoubleClick,
}) => {
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  // Удаляем HTML-теги и ограничиваем длину текста
  const sanitizeText = (text: string | null): string => {
    if (!text) return "Информация отсутствует";
    const plainText = text.replace(/<\/?[^>]+(>|$)/g, ""); // Удаляем HTML-теги
    return plainText.length > 500 ? plainText.slice(0, 500) + "..." : plainText; // Ограничение длины
  };

  // Функция для обновления информации при наведении
  const handleRowHover = (info: string | null) => {
    setHoveredInfo(sanitizeText(info));
  };

  return (
    <div className="table-with-info-container">
      <DynamicTable
        data={data}
        columns={columns}
        catalog={catalog}
        onDataChange={onDataChange}
        onRowSelect={onRowSelect}
        selectedRowKey={selectedRowKey}
        onRowHover={handleRowHover} // Передаем обработчик для наведения
        onRowDoubleClick={onRowDoubleClick}
      />

      {/* Фрейм с информацией */}
      <div className="info-frame">
        <p style={{ margin: 0 }}>
          {hoveredInfo || "Наведите на строку для получения информации"}
        </p>
      </div>
    </div>
  );
};

export default TableWithInfo;