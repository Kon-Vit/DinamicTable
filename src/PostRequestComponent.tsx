
import React, { useState } from 'react';
import axios from 'axios';
import type { ApiResponse, ColumnModel, DataSourceModel, Catalog } from './models';
import DynamicTable from './DynamicTable';
import { Button, message } from 'antd';



const PostRequestComponent: React.FC = () => {
  const [columns, setColumns] = useState<ColumnModel[]>([]);
  const [data, setData] = useState<DataSourceModel[]>([]);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [changedRows, setChangedRows] = useState<Set<string>>(new Set());
  


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);
  
      const requestData = {
        operation: 'razn_od',
        params: [1, null, null],
      };
  
      const response = await axios.post<ApiResponse>(
        'http://87.103.198.92:5544/read_data',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        }
      );
  
      const apiResponse = response.data;
  
      console.log('Полный ответ от сервера:', apiResponse);
  
      // Убедитесь, что catalog и key_list существуют
      if (!apiResponse.catalog || !apiResponse.key_list || !apiResponse.key_list.primary_key) {
        throw new Error('Некорректный ответ от сервера: отсутствует key_list или primary_key');
      }
  
      const primaryKeyField = apiResponse.key_list.primary_key; // Извлекаем имя первичного ключа
  
      // Проверка, что в dataSource есть значение для этого ключа
      const dataWithKey = apiResponse.dataSource.map((item) => ({
        key: item[primaryKeyField], // Используем ключ из поля primary_key
        ...item,                    // Копируем остальные данные
      }));
  
      setColumns(apiResponse.columns);
      setData(dataWithKey);
  
      const keyList = [primaryKeyField]; // Преобразуем имя ключа в массив
      setCatalog({ ...apiResponse.catalog, key_list: keyList });
  
    } catch (err) {
      console.error(err);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  // 
  
  const [changedRowMap, setChangedRowMap] = useState<Map<string, DataSourceModel>>(new Map());

const handleAddRow = () => {
  const newRow: DataSourceModel = {
    key: Date.now().toString(),
    fio_id: '',
    razn_t_t_id: null,
    razn_shabl_pl_id: '',
    razn_nak_id: '',
    fio: '',
    razn_t_t_name: '',
    razn_shabl_pl_name: '',
    razn_nak_name: '',
    info: '',
    mam: null,
  };
  setData([newRow, ...data]);
  setChangedRowMap((prev) => new Map(prev).set(newRow.key, newRow)); // Добавляем новую строку
};

console.log('Изменённые строки (ключи):', Array.from(changedRowMap.keys()));

// const saveData = async () => {
//   try {
//     if (changedRowMap.size === 0) {
//       message.warning('Нет изменений для сохранения!');
//       return;
//     }

//     const changedData = Array.from(changedRowMap.values()); // Извлекаем измененные строки

//     const saveRequestData = {
//       operation: 'razn_od',
//       params: changedData.map((item) => ({
//         ...item,
//         fio_id: item.fio_id || null,
//         razn_t_t_id: item.razn_t_t_id || null,
//       })),
//     };

//     console.log('Отправляем изменения:', JSON.stringify(saveRequestData, null, 2));



    const requiredColumns = columns.map((col) => col.key); // Список всех колонок
    // const saveData = async () => {
    //   if (changedRowMap.size === 0) {
    //     message.warning('Нет изменений для сохранения!');
    //     return;
    //   }
    
    //   const changedData = Array.from(changedRowMap.values());
    
    //   const saveRequestData = {
    //     operation: 'razn_od',
    //     params: changedData,
    //   };
    
    //   try {
    //     const username = 'sirius220@yandex.ru';
    //     const password = 'qwe';
    //     const token = btoa(`${username}:${password}`);
    
    //     const response = await axios.put('http://87.103.198.92:5544/write_data', saveRequestData, {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Basic ${token}`,
    //       },
    //     });
    
    //     if (response.status === 200) {
    //       message.success('Изменения успешно сохранены!');
    //       setChangedRowMap(new Map());
    //     } else {
    //       throw new Error('Не удалось сохранить изменения.');
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     message.error('Ошибка при сохранении изменений.');
    //   }
    // };

    const saveData = async () => {
      if (changedRowMap.size === 0) {
        message.warning('Нет изменений для сохранения!');
        return;
      }
    
      // const changedData = Array.from(changedRowMap.entries()).map(([key, row]) => {
      //   const requiredRowData: Partial<DataSourceModel> = {
      //     key,  // Убедитесь, что первичный ключ всегда включен
      //     ...row,
      //   };
    
      //   // Гарантируем, что важные поля, такие как razn_t_t_id, не будут отправлены как null
      //   if (requiredRowData.razn_t_t_id === null) {
      //     requiredRowData.razn_t_t_id = '';  // Можно задать значение по умолчанию, если требуется
      //   }
      //   return requiredRowData;
      // });

      const changedData = Array.from(changedRowMap.values()); // Используем только измененные строки
    
      const saveRequestData = {
        operation: 'razn_od',
        params: changedData,
      };
    
      try {
        const username = 'sirius220@yandex.ru';
        const password = 'qwe';
        const token = btoa(`${username}:${password}`);
    
        console.log('Данные для сохранения:', JSON.stringify(saveRequestData, null, 2));
    
        const response = await axios.put('http://87.103.198.92:5544/write_data', saveRequestData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        });
    
        if (response.status === 200) {
          message.success('Изменения успешно сохранены!');
          setChangedRowMap(new Map());
        } else {
          throw new Error('Не удалось сохранить изменения.');
        }
      } catch (err) {
        console.error('Ошибка при сохранении данных:', err);
        message.error('Ошибка при сохранении изменений.');
      }
    };
    

  const handleDeleteRow = async () => {
    if (!selectedRowKey) {
      message.warning('Выберите строку для удаления!');
      return;
    }

    console.log('catalog:', catalog);  // Проверяем, что содержит переменная catalog
    if (!catalog) {
      message.error('Каталог не загружен.');
      return;
    }
    
    console.log('catalog.key_list:', catalog.key_list);  // Проверяем key_list после проверки catalog
    if (!Array.isArray(catalog.key_list) || catalog.key_list.length === 0) {
      message.error('Каталог не содержит ключей.');
      return;
    }
  
    if (!catalog || !Array.isArray(catalog.key_list) || catalog.key_list.length === 0) {
      message.error('Каталог не загружен или не содержит ключей.');
      return;
    }
  
    // Если key_list — это массив строк, то просто берем первое значение.
    const primaryKeyField = catalog.key_list[0]; // Берем первый элемент массива как имя поля ключа
    const rowToDelete = data.find((item) => Number(item.key) === Number(selectedRowKey));
  
    if (!rowToDelete) {
      message.error('Выбранная строка не найдена.');
      return;
    }
  
    const primaryKey = rowToDelete[primaryKeyField]; // Используем динамическое имя поля
    if (primaryKey === undefined) {
      message.error('Первичный ключ не найден.');
      return;
    }
  
    try {
      const username = 'sirius220@yandex.ru';
      const password = 'qwe';
      const token = btoa(`${username}:${password}`);
  
      const deleteRequestData = {
        operation: 'razn_od',
        params: { [primaryKeyField]: primaryKey }, // Динамическое использование имени поля
      };
  
      const response = await axios.delete('http://87.103.198.92:5544/delete_data', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        data: deleteRequestData,
      });
  
      if (response.status === 200) {
        const updatedData = data.filter((item) => item.key !== selectedRowKey);
        setData(updatedData);
        message.success('Строка успешно удалена.');
      } else {
        throw new Error('Ошибка удаления.');
      }
    } catch (err) {
      console.error(err);
      message.error('Не удалось удалить строку.');
    } finally {
      setSelectedRowKey(null);
    }
  };

  const handleRowDoubleClick = (key: string | number | null) => {
    if (key !== null) {
      const keyAsString = String(key);  // Преобразование для согласованности
      setSelectedRowKey(keyAsString);
      message.info(`Строка с ключом ${keyAsString} выделена.`);
    }
  };

  

// const handleDataChange = (updatedData: DataSourceModel[]) => {
//   const updatedMap = new Map(changedRowMap);

//   updatedData.forEach((row) => {
//     const originalRow = data.find((originalRow) => originalRow.key === row.key);
//     if (originalRow) {
//       const updatedFields = Object.keys(row).reduce((acc, key) => {
//         if (row[key] !== originalRow[key]) {
//           acc[key] = row[key];
//         }
//         return acc;
//       }, {} as Record<string, any>);

//       if (Object.keys(updatedFields).length > 0) {
//         updatedMap.set(row.key, { ...originalRow, ...updatedFields });
//       }
//     }
//   });

const handleDataChange = (updatedData: DataSourceModel[]) => {
  const updatedMap = new Map(changedRowMap);

  updatedData.forEach((row) => {
    const originalRow = data.find((originalRow) => originalRow.key === row.key);
    if (!originalRow || JSON.stringify(row) !== JSON.stringify(originalRow)) {
      updatedMap.set(row.key, row); // Обновляем измененные строки
    }
  });

  setChangedRowMap(updatedMap); // Обновляем только измененные строки
  setData(updatedData); // Обновляем отображаемые данные
};



  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0' }}>
        <Button onClick={fetchData} loading={loading} style={{ marginRight: 10 }}>
          Загрузить данные
        </Button>
        {/* <Button onClick={saveData} disabled={!changedRows.size} style={{ marginRight: 10 }}> */}
        <Button onClick={saveData} disabled={changedRowMap.size === 0} style={{ marginRight: 10 }}>
          Сохранить
        </Button>
        <Button
          onClick={handleAddRow}
          type="primary"
          disabled={!columns.length || !catalog}
          style={{ marginRight: 10 }}
        >
          Добавить строку
        </Button>
        <Button
          danger
          onClick={handleDeleteRow}
          disabled={!selectedRowKey || !data.some((row) => String(row.key) === String(selectedRowKey))}
        >
          Удалить строку
        </Button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {catalog && columns.length > 0 && (
      <DynamicTable
      data={data}
      columns={columns}
      catalog={catalog}
      onDataChange={handleDataChange}
      onRowSelect={(key) => setSelectedRowKey(key)}
      selectedRowKey={selectedRowKey}
      onRowDoubleClick={handleRowDoubleClick}
      onRowHover={() => {}}
    />
      )}
    </div>
 
  );
};

export default PostRequestComponent;   