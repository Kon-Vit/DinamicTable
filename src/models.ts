import { JsonObject, JsonProperty } from 'json2typescript';

// Модель для элементов catalog
@JsonObject('CatalogItem')
export class CatalogItem {
  @JsonProperty('fio_id', Object, true)
  fio_id?: { fio: string; fio_key: number };

  @JsonProperty('razn_t_t_id', Object, true)
  razn_t_t_id?: { razn_t_t_key: number; t_t: string };

  @JsonProperty('razn_shabl_pl_id', Object, true)
  razn_shabl_pl_id?: { razn_shabl_pl_key: number; shabl_name: string };

  @JsonProperty('razn_nak_id', Object, true)
  razn_nak_id?: { name_ak: string; razn_nak_key: number };

  @JsonProperty('vid_perev', Object, true)
  vid_perev?: { vid_soobsh: string };

  @JsonProperty('vid_soob', Object, true)
  vid_soob?: { vid_perev: string };
}

// Модель для данных таблицы
@JsonObject('DataSourceModel')
export class DataSourceModel {
  @JsonProperty('date_p_tahografa', String)
  date_p_tahografa?: string;

  @JsonProperty('del', Boolean)
  del?: boolean;

  @JsonProperty('enable_find_fine', Boolean)
  enable_find_fine?: boolean;

  @JsonProperty('fines_problem', String, true)
  fines_problem?: string;

  @JsonProperty('fio_id', Number, true)
  fio_id?: number;

  @JsonProperty('from_1c_id', Number, true)
  from_1c_id?: number;

  @JsonProperty('gps_id', Number, true)
  gps_id?: number;

  @JsonProperty('gps_probeg', Number, true)
  gps_probeg?: number;

  @JsonProperty('grafik', String, true)
  grafik?: string;

  @JsonProperty('hh_to1', Number, true)
  hh_to1?: number;

  @JsonProperty('hh_to2', Number, true)
  hh_to2?: number;

  @JsonProperty('info', String)
  info?: string;

  @JsonProperty('inv_no', String, true)
  inv_no?: string;

  @JsonProperty('key', Number)
  key?: number;

  @JsonProperty('key_tip', Number)
  key_tip?: number;

  @JsonProperty('konserv_do', String, true)
  konserv_do?: string;

  @JsonProperty('konserv_ot', String, true)
  konserv_ot?: string;

  @JsonProperty('last_date', String, true)
  last_date?: string;

  @JsonProperty('mam', String)
  mam?: string;

  @JsonProperty('mk', String, true)
  mk?: string;

  @JsonProperty('name_ak', String)
  name_ak?: string;

  @JsonProperty('nomer', String)
  nomer?: string;

  @JsonProperty('norm_zapr', Number, true)
  norm_zapr?: number;

  @JsonProperty('period_to', Number)
  period_to?: number;

  @JsonProperty('period_to2', Number)
  period_to2?: number;

  @JsonProperty('period_to2_h', Number, true)
  period_to2_h?: number;

  @JsonProperty('period_to_h', Number, true)
  period_to_h?: number;

  @JsonProperty('pprobeg', Number, true)
  pprobeg?: number;

  @JsonProperty('pprobeg_agr', Number, true)
  pprobeg_agr?: number;

  @JsonProperty('pprobeg_to1', Number, true)
  pprobeg_to1?: number;

  @JsonProperty('pprobeg_to1_agr', Number, true)
  pprobeg_to1_agr?: number;

  @JsonProperty('pprobeg_to1_h_dv', Number, true)
  pprobeg_to1_h_dv?: number;

  @JsonProperty('pprobeg_to2', Number, true)
  pprobeg_to2?: number;

  @JsonProperty('pprobeg_to2_agr', Number, true)
  pprobeg_to2_agr?: number;

  @JsonProperty('pprobeg_to2_h_dv', Number, true)
  pprobeg_to2_h_dv?: number;

  @JsonProperty('predupr', Number)
  predupr?: number;

  @JsonProperty('rare_use', Boolean)
  rare_use?: boolean;

  @JsonProperty('razn_nak_id', Number, true)
  razn_nak_id?: number;

  @JsonProperty('razn_od_id_pricep', Number, true)
  razn_od_id_pricep?: number;

  @JsonProperty('razn_shabl_pl_id', Number, true)
  razn_shabl_pl_id?: number;

  @JsonProperty('razn_t_t_id', Number, true)
  razn_t_t_id?: number;

  @JsonProperty('req_name', String, true)
  req_name?: string;

  @JsonProperty('serija', String, true)
  serija?: string;

  @JsonProperty('spid_to1', Number, true)
  spid_to1?: number;

  @JsonProperty('spid_to2', Number, true)
  spid_to2?: number;

  @JsonProperty('tek_spid_pos', Number, true)
  tek_spid_pos?: number;

  @JsonProperty('tek_timer_dvig_pos', Number, true)
  tek_timer_dvig_pos?: number;

  @JsonProperty('tek_timer_pos', Number, true)
  tek_timer_pos?: number;

  @JsonProperty('vid_perev', Number, true)
  vid_perev?: number;

  @JsonProperty('vid_soob', Number, true)
  vid_soob?: number;

  @JsonProperty('vin', String, true)
  vin?: string;

  @JsonProperty('wait_4_cancellation', Number)
  wait_4_cancellation?: number;

  @JsonProperty('wait_4_cancellation_date', String, true)
  wait_4_cancellation_date?: string;
}

// Модель для колонок
@JsonObject('ColumnModel')
export class ColumnModel {
  @JsonProperty('dataIndex', String)
  dataIndex?: string;

  @JsonProperty('data_type', String)
  data_type?: string;

  @JsonProperty('key', String)
  key?: string;

  @JsonProperty('not_null', Boolean)
  not_null?: boolean;

  @JsonProperty('title', String)
  title?: string;

  @JsonProperty('width', Number)
  width?: number;

  @JsonProperty('render', Function, true)
  render?: (text: any, record: DataSourceModel) => React.ReactNode = () => null;
}

// Модель для всего ответа
@JsonObject('ApiResponse')
export class ApiResponse {
  @JsonProperty('catalog', [CatalogItem])
  catalog?: CatalogItem[];

  @JsonProperty('columns', [ColumnModel])
  columns?: ColumnModel[];

  @JsonProperty('dataSource', [DataSourceModel])
  dataSource?: DataSourceModel[];

  @JsonProperty('grants', Object)
  grants?: { [key: string]: boolean };

  @JsonProperty('key_list', Object)
  key_list?: { primary_key: string };

  @JsonProperty('operation', String)
  operation?: string;
}