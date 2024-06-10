import React, { useState } from "react";
import { Input, Checkbox, Button, Badge } from "antd";
import styled from "styled-components";

const { Search } = Input;

const CheckboxGroup = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ActionButton = styled(Button)`
  color: #1890ff;
`;

const DropdownContainer = styled.div`
  margin-top: 0.2rem;
  width: 200px;
  height: auto;
  max-height: 350px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: absolute;
  background: #fff;
  z-index: 1;
  border-radius: 0.5rem;
  padding: 0.5rem 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const DropdownCheckbox = ({ options, title, onChange }) => {
  const [checkedList, setCheckedList] = useState(options.map(option => option.value));
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  const [dropdownStatus, setDropdownStatus] = useState(false);

  const handleChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
    onChange(list);
  };

  const handleCheckAllChange = (e) => {
    const checked = e.target.checked;
    const newCheckedList = checked ? options.map(option => option.value) : [];
    setCheckedList(newCheckedList);
    setIndeterminate(false);
    setCheckAll(checked);
    onChange(newCheckedList);
  };

  const handleShowDropdown = () => {
    setDropdownStatus(!dropdownStatus);
  };

  return (
    <div>
      <Badge count={checkedList.length}>
        <Button onClick={handleShowDropdown}>{title}</Button>
      </Badge>
      {dropdownStatus && (
        <DropdownContainer>
          <Search
            size="default"
            placeholder={title}
            onSearch={(value) => console.log(value)}
            style={{ width: "100%" }}
          />
          <div style={{ overflow: "auto", height: "auto", maxHeight: "300px" }}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={handleCheckAllChange}
              checked={checkAll}
            >
              Select All
            </Checkbox>
            <CheckboxGroup
              options={options}
              value={checkedList}
              onChange={handleChange}
            />
          </div>
          <ButtonContainer>
            <ActionButton type="link" onClick={handleShowDropdown}>Ok</ActionButton>
            <ActionButton type="link" onClick={handleShowDropdown}>Cancel</ActionButton>
          </ButtonContainer>
        </DropdownContainer>
      )}
    </div>
  );
};

export default DropdownCheckbox;
