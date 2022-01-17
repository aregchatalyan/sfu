import React from "react";
import style from "./style.module.scss";
import { CustomButtonWithIcon } from "../Button/CustomButtonWithIcon";

const AnswerInput = ({ name, value, changeContext, index, canBeDelete }) => {
  return (
    <div className={style.answerInputWrapper}>
      <input
        {...{ value }}
        onChange={({ target: { value } }) => {
          changeContext((state) => {
            const versions = state[name];
            versions[index].text = value;
            return { ...state, [name]: versions };
          });
        }}
        className={style.answerInput}
      />
      {canBeDelete && (
        <CustomButtonWithIcon
          iconName="delete_version"
          width={24}
          height={24}
          className={style.deleteBtn}
          onClick={() =>
            changeContext((state) => {
              const versions = [...state[name]];
              versions.splice(index, 1);
              return { ...state, versions };
            })
          }
        />
      )}
    </div>
  );
};

export default AnswerInput;