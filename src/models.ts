import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('ColumnModel')
export class ColumnModel {
  @JsonProperty('key', String, true)
  key: string = '';

  @JsonProperty('title', String, true)
  title: string = '';

  @JsonProperty('dataIndex', String, true)
  dataIndex: string = '';
}

@JsonObject('DataSourceModel')
export class DataSourceModel {
  @JsonProperty('id', Number, true)
  id: number | undefined = undefined;

  @JsonProperty('name', String, true)
  name: string = '';

  @JsonProperty('value', Number, true)
  value: number = 0;

  @JsonProperty('key', String, true) // Если нужно поддерживать строку или число, поменяйте тип на string | number
  key: string | number = '';
}