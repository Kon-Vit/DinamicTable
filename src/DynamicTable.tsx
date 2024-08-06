import React, { useState } from 'react';

interface DataRow {
  [key: string]: any;
}

interface DynamicTableProps {
  data: DataRow[];
  onSave: (updatedData: DataRow[]) => void; // Функция для сохранения данных
  visibleFields: string[]; // Новый пропс для указания видимых полей
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, onSave, visibleFields }) => {
  const [editableData, setEditableData] = useState<DataRow[]>(data);

  const handleChange = (rowIndex: number, colKey: string, value: string) => {
    const updatedData = [...editableData];
    updatedData[rowIndex][colKey] = value; // Обновляем значение в редактируемом состоянии
    setEditableData(updatedData);
  };

  const handleSave = () => {
    onSave(editableData); // Вызываем функцию для сохранения обновленных данных
  };

  if (!data || data.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  // Используем visibleFields напрямую, без фильтрации
  const headers = visibleFields; // Все указанные поля в visibleFields

  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={{ border: 'none', padding: '8px' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {editableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header} style={{ border: 'none', padding: '8px' }}>
                  <input
                    type="text"
                    value={row[header] !== null ? row[header] : ''}
                    onChange={(e) => handleChange(rowIndex, header, e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none' }} // убираем бордер у input
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} style={{ marginTop: '10px' }}>
        Сохранить изменения
      </button>
    </>
  );
};

export default DynamicTable;