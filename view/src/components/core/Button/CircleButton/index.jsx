import React from "react";
import Icon from "../../Icon";

import style from "./style.module.scss";
export { CircleButtonWithHover } from "./CircleButtonWithHover";
export { CircleButtonWhithStates } from "./CircleButtonWhithStates";
export { CircleButtonCustom } from "./CircleButtonCustom";

const CircleButton = ({ onClick, state, iconName }) => (
  <button
    onClick={onClick}
    className={state ? style.circleButtonActive : style.circleButton}
  >
    <Icon name={iconName} width={24} height={24} />
  </button>
);
export default CircleButton;