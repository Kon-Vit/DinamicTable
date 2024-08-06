import React, { useState } from 'react';
import axios from 'axios';
import DynamicTable from './DynamicTable';

// Определяем видимые поля
const columnsToShow = [
  "mam",
  "nomer",
  "razn_od_id_pricep",
  "fio_id",
  "req_name",
  "tip",
  "grafik",
  "tip_pl",
  "norm_zapr",
  "nak",
  "del",
  "vid_perev",
  "vid_soob",
  "rare_use",
  "enable_find_fine",
  "from_1c_id"
];

const PostRequestComponent: React.FC = () => {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      const requestData = {
        operation: "razn_od",
        params: [1, null, null]
      };

      const response = await axios.post<any>(
        'http://87.103.198.92:5544/read_data',
        requestData,
        {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}` }
        }
      );

      setData(response.data.data);
      setError(null);
    } catch (err) {
      setError('Произошла ошибка при отправке запроса');
      setData(null);
      console.error(err);
    }
  };

  const handleSave = async (updatedData: any[]) => {
    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);

      const requestData = {
        operation: "update_data", // Здесь указываем нужную операцию
        params: updatedData
      };

      await axios.post<any>(
        'http://87.103.198.92:5544/update_data', // Убедитесь, что URL правильный
        requestData,
        {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}` }
        }
      );

      alert('Данные успешно обновлены!');
    } catch (err) {
      setError('Произошла ошибка при обновлении данных');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleSubmit}>Отправить POST запрос</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #000', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h3>Ответ от сервера:</h3>
          {/* Передаем данные и видимые поля в таблицу */}
          <DynamicTable data={data} onSave={handleSave} visibleFields={columnsToShow} />
        </div>
      )}
    </div>
  );
};

export default PostRequestComponent;