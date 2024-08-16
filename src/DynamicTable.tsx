import React, { useState, useEffect } from 'react';

interface Item {
  mam: string;
  nomer: string;
  razn_od_id_pricep: number;
  fio_id: number;
  req_name: string;
  tip: string;
  grafik: string;
  mk: string;
  tip_pl: string;
  norm_zapr: number;
  nak: string;
  del: boolean;
  vid_perev: string;
  vid_soob: string;
  rare_use: boolean;
  enable_find_fine: boolean;
  from_1c_id: number;
  [key: string]: any;
}

interface DynamicTableProps {
  data: Item[];
  onSave: (updatedData: Item[]) => void;
  visibleFields: { [key: string]: number };
  fieldDescriptions: { [key: string]: string };
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, onSave, visibleFields, fieldDescriptions }) => {
  const [editableData, setEditableData] = useState<Item[]>(data);
  const [originalData, setOriginalData] = useState<Item[]>(data);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  useEffect(() => {
    setEditableData(data);
    setOriginalData(data);
  }, [data]);

  const handleChange = (rowIndex: number, colKey: string, value: string | boolean) => {
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
    const newItem: Item = {
      mam: '',
      nomer: '',
      razn_od_id_pricep: 0,
      fio_id: 0,
      req_name: '',
      tip: '',
      grafik: '',
      mk: '',
      tip_pl: '',
      norm_zapr: 0,
      nak: '',
      del: false,
      vid_perev: '',
      vid_soob: '',
      rare_use: false,
      enable_find_fine: false,
      from_1c_id: 0,
    };
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

  const headers = Object.keys(data[0]);

  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={{ border: 'none', padding: '8px', backgroundColor: '#f9f9f9', width: `${visibleFields[header] || 100}px` }}>
                {fieldDescriptions[header] || header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
  {editableData.map((row, rowIndex) => (
    <tr 
      key={rowIndex} 
      onClick={() => setSelectedRowIndex(rowIndex)} // Это устанавливает выбранную строку
      style={{ 
        cursor: 'pointer', 
        backgroundColor: selectedRowIndex === rowIndex ? '#add8e6' : 'transparent' // Подсветка
      }}
    >
      {headers.map((header) => (
        <td key={header} style={{ border: 'none', padding: '8px' }}>
          {typeof row[header] === 'boolean' ? (
            <input
              type="checkbox"
              checked={row[header] === true}
              onChange={(e) => handleChange(rowIndex, header, e.target.checked)}
              style={{
                cursor: 'pointer',
              }}
            />
          ) : (
            <input
              type="text"
              value={row[header] !== null ? row[header] : ''}
              onChange={(e) => handleChange(rowIndex, header, e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                width: '100%',
                padding: '5px',
                outline: 'none',
              }}
            />
          )}
        </td>
      ))}
    </tr>
  ))}
</tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleAdd} style={{ marginRight: '10px' }}>Добавить</button>
        <button onClick={handleDelete} style={{ marginRight: '10px' }}>Удалить</button>
        <button onClick={handleReset}>Сброс</button>
      </div>
      <button onClick={handleSave} style={{ marginTop: '10px' }}>
        Сохранить изменения
      </button>
    </>
  );
};

export default DynamicTable;