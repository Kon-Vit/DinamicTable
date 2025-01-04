export interface Fio {
  fio_key: number;
  fio: string;
}

export interface RaznNak {
  razn_nak_key: number;
  name_ak: string;
}

export interface RaznShablPl {
  razn_shabl_pl_key: number;
  shabl_name: string;
}

export interface RaznTT {
  razn_t_t_key: number;
  t_t: string;
}

export interface VidPerev {
  vid_soobsh: string;
}

export interface VidSoob {
  vid_perev: string;
}

export interface Catalog {
  key_list: string[]; 
  [key: string]: any;
  fio_id: Fio[];
  razn_nak_id: RaznNak[];
  razn_od_id_pricep: any[];  // Если структура не определена, оставляем any
  razn_shabl_pl_id: RaznShablPl[];
  razn_t_t_id: RaznTT[];
  vid_perev: VidPerev[];
  vid_soob: VidSoob[];
}

export interface ColumnModel {
  title: string; // Заголовок колонки
  dataIndex: string; // Уникальный индекс данных
  key: string; // Уникальный ключ колонки
  render?: (text: any, record: DataSourceModel, index: number) => React.ReactNode; // Кастомный рендер
  data_type?: string; // Тип данных (например, "boolean", "string")
  not_null?: boolean; // Является ли поле обязательным
}

export interface DataSourceModel {
  [key: string]: any; // Динамическая структура
}


export interface ApiResponse {
  catalog: Catalog;
  columns: ColumnModel[];
  dataSource: DataSourceModel[];
  grants: {
    delete: boolean;
    insert: boolean;
    select: boolean;
    update: boolean;
  };
  key_list: {
    primary_key: string;
  };
  operation: string;
}