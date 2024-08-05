import React, { useState } from 'react';

interface DataRow {
  [key: string]: any;
}

interface DynamicTableProps {
  data: DataRow[];
  onSave: (updatedData: DataRow[]) => void; // Функция для сохранения данных
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, onSave }) => {
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

  const headers = Object.keys(data[0]);

  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={{ border: '1px solid #ccc', padding: '8px' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {editableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header} style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <input
                    type="text"
                    value={row[header] !== null ? row[header] : ''}
                    onChange={(e) => handleChange(rowIndex, header, e.target.value)}
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