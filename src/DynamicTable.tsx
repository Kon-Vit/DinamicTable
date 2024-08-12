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
  [key: string]: any; // Позволяет индексацию
}

// interface DataRow {
//   [key: string]: any;
// }

interface DynamicTableProps {
  data: Item[];
  onSave: (updatedData: Item[]) => void;
  visibleFields: { [key: string]: number };
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, onSave, visibleFields }) => {
  const [editableData, setEditableData] = useState<Item[]>(data);

  useEffect(() => {
    setEditableData(data);
  }, [data]);

  const handleChange = (rowIndex: number, colKey: string, value: string) => {
    const updatedData = [...editableData];
    updatedData[rowIndex][colKey] = value;
    setEditableData(updatedData);
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
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {editableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header} style={{ border: 'none', padding: '8px', backgroundColor: '#f9f9f9', wordBreak: 'break-word', whiteSpace: 'normal' }}>
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
                      overflow: 'hidden',
                    }}
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