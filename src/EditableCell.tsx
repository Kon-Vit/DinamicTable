import React from "react";
import { Input, Checkbox } from "antd";

interface EditableCellProps {
  value: any;
  columnKey: string;
  rowIndex: number;
  onChange: (rowIndex: number, colKey: string, value: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  columnKey,
  rowIndex,
  onChange,
}) => {
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange(rowIndex, columnKey, e.target.value);
  };

  if (typeof value === "boolean") {
    return (
      <Checkbox
        checked={value}
        onChange={(e) => onChange(rowIndex, columnKey, e.target.checked)}
      />
    );
  }

  return (
    <Input
      value={value !== null ? value : ""}
      onChange={handleChange}
      placeholder="Введите значение"
    />
  );
};

export default EditableCell;
