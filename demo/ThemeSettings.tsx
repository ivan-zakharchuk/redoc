import * as React from 'react';
import styled from '../src/styled-components';
import { useState } from 'react';
import { debounce } from './utils';

const Container = styled.div`
  position: absolute;
  background-color: #f9f9f9;
  border: 1px solid gray;
  border-radius: 5px;
  min-width: 180px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  transform: translateY(5px);
  z-index: 1;
  display: none;

  &.active {
    display: block;
  }
`;

const ThemeSettingsWrap = styled.div`
  position: relative;
  display: inline-block;
`;

const Header = styled.div`
  background-color: #cdcbcb;
  padding: 10px;
  border-bottom: 1px solid gray;
  text-align: center;
`;

const Button = styled.button`
  background-color: orange;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border-width: 0;
  color: white;
  font-size: 20px;
  line-height: 18px;
  padding: 0;
  margin: 0 10px;
  outline: none;
`;

const Content = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;

  & > * {
    padding: 5px;
  }
`;


function ThemeSettings({ onChange, value })
{
  const [showPicker, setShowPicker] = useState(false);
  const onChangeDebounce = debounce(onChange, 250)

  return (
    <ThemeSettingsWrap>
      <Button onClick={ () => setShowPicker(!showPicker) }>⚙</Button>
      <Container className={ showPicker ? "active" : '' } >
        <Header>Settings</Header>
        <Content>
          <label>Primary Color:</label>
          <input type="color" value={value} onChange={ ({target: { value }}) => onChangeDebounce(value)}/>
        </Content>
      </Container>
    </ThemeSettingsWrap>
  )
}

export default ThemeSettings;
