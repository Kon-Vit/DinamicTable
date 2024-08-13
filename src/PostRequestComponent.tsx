import React, { useState } from 'react';
import axios from 'axios';
import DynamicTable from './DynamicTable';

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
  [key: string]: any; // Позволяет добавлять дополнительные поля
}

interface FieldInfo {
  field_name: string;
  field_descr: string;
}

const PostRequestComponent: React.FC = () => {
  const [data, setData] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visibleFields, setVisibleFields] = useState<{ [key: string]: number }>({});
  const [fieldDescriptions, setFieldDescriptions] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (): Promise<void> => {
    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      const requestData = {
        operation: "razn_od",
        params: [1, null, null],
      };

      const response = await axios.post<any>(
        'http://87.103.198.92:5544/read_data',
        requestData,
        {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}` },
        }
      );

      // Проверка наличия данных
      if (!response.data || !response.data.data) {
        throw new Error('Неверный формат ответа от сервера');
      }

      const { data: responseData, visible_fields, fields_list } = response.data;

      const extractedData: Item[] = responseData.map((item: Item) => ({
        mam: item.mam,
        nomer: item.nomer,
        razn_od_id_pricep: item.razn_od_id_pricep,
        fio_id: item.fio_id,
        req_name: item.req_name,
        tip: item.tip,
        grafik: item.grafik,
        mk: item.mk,
        tip_pl: item.tip_pl,
        norm_zapr: item.norm_zapr,
        nak: item.nak,
        del: item.del,
        vid_perev: item.vid_perev,
        vid_soob: item.vid_soob,
        rare_use: item.rare_use,
        enable_find_fine: item.enable_find_fine,
        from_1c_id: item.from_1c_id,
      }));

      const columnWidths = visible_fields[0].reduce((acc: { [key: string]: number }, field: { [key: string]: number }) => {
        const key = Object.keys(field)[0];
        acc[key] = field[key];
        return acc;
      }, {});

      const descriptions = Object.entries(fields_list).reduce((acc: { [key: string]: string }, [fieldName, fieldInfo]) => {
        const info = fieldInfo as FieldInfo; // Приведение типа
        acc[fieldName] = info.field_descr;
        return acc;
      }, {});

      setVisibleFields(columnWidths);
      setFieldDescriptions(descriptions);
      setData(extractedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при отправке запроса');
      setData(null);
      console.error(err);
    }
  };

  const handleSave = async (updatedData: Item[]) => {
    // Логика сохранения обновленных данных
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleSubmit}>Отправить POST запрос</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9' }}>
          <h3>Ответ от сервера:</h3>
          <DynamicTable data={data} onSave={handleSave} visibleFields={visibleFields} fieldDescriptions={fieldDescriptions} />
        </div>
      )}
    </div>
  );
};

export default PostRequestComponent;