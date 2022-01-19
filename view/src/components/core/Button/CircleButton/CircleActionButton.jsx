import React, { useState } from "react";
import style from "./style.module.scss";

export const CircleActionButton = ({ onClick }) => {
  const [isClicked, setisClicked] = useState(false);

  const handleClick = () => {
    let timeout;
    if (!isClicked) {
      setisClicked(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setisClicked(false), 7000);
      onClick();
    }
  };

  return (
    <button
      className={style.circleActionButton}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className={isClicked ? style.svgWrapperActive : style.svgWrapper}
      >
        <path
          className={style.svgBackground}
          d="M18 0.5
          a 17.5 17.5 0 0 1 0 35
          a 17.5 17.5 0 0 1 0 -35"
        />
        <path
          className={style.svgCircle}
          strokeDasharray="0, 110"
          d="M18 0.5
          a 17.5 17.5 0 0 1 0 35
          a 17.5 17.5 0 0 1 0 -35"
        />
        <svg
          width="16"
          height="22"
          viewBox="0 0 18 24"
          fill="none"
          x="9"
          y="6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={style.svgHand}
            d="M17.3056 6.07229C17.3062 5.48042 17.0762 4.92382 16.6579 4.50512C16.2397 4.08642 15.6834 3.85579 15.0915 3.85579C14.8099 3.85579 14.5404 3.90948 14.2922 4.00622L14.2944 2.80038C14.2959 2.20798 14.0662 1.65077 13.6478 1.23137C13.2294 0.81201 12.6727 0.580996 12.0803 0.580996H12.0477C11.6037 0.580996 11.19 0.713105 10.8429 0.939409C10.7707 0.837443 10.69 0.740469 10.6 0.650277C10.1816 0.23092 9.62491 0 9.03256 0H8.99239C7.98045 0 7.12553 0.682633 6.86235 1.61135C6.59107 1.49252 6.29176 1.42612 5.9771 1.42612H5.95144C4.73057 1.42612 3.73733 2.41936 3.73733 3.64022V8.10889C3.48479 8.00928 3.21007 7.95389 2.92254 7.95389C1.69419 7.95389 0.694824 8.95321 0.694824 10.1816V15.6997C0.694824 20.2765 4.41836 24 8.99517 24C11.2144 24 13.3001 23.1352 14.8683 21.565C16.4364 19.9948 17.2984 17.9079 17.2955 15.6886L17.2924 13.3309L17.3056 6.07229ZM15.8825 15.6905C15.885 17.5319 15.1697 19.2636 13.8685 20.5665C12.5673 21.8695 10.8365 22.587 8.99512 22.587C5.1974 22.587 2.10775 19.4973 2.10775 15.6997V10.1816C2.10775 9.7323 2.47328 9.36682 2.92254 9.36682C3.37181 9.36682 3.73733 9.7323 3.73733 10.1816V13.8934C3.73733 14.2836 4.05364 14.5999 4.44379 14.5999C5.69833 14.5999 6.71899 15.6205 6.71899 16.8751V18.0312C6.71899 18.4214 7.03529 18.7377 7.42545 18.7377C7.81561 18.7377 8.13191 18.4214 8.13191 18.0312V16.8751C8.13191 15.083 6.84714 13.5853 5.15026 13.2549V3.64022C5.15026 3.19845 5.50966 2.83904 5.95144 2.83904H5.9771C6.41883 2.83904 6.77819 3.1984 6.77828 3.64008V10.1569C6.77828 10.547 7.09459 10.8633 7.48475 10.8633C7.8749 10.8633 8.19121 10.547 8.19121 10.1569C8.19121 9.11047 8.19121 3.0938 8.19121 2.21406C8.19121 1.77228 8.55061 1.41288 8.99239 1.41288H9.03256C9.2469 1.41288 9.44834 1.49643 9.59971 1.64818C9.75108 1.79988 9.83421 2.00151 9.83374 2.21604C9.82903 4.5793 9.82206 7.81439 9.81806 10.1621C9.8173 10.5522 10.133 10.8691 10.5231 10.8699H10.5245C10.9141 10.8699 11.2302 10.5545 11.231 10.1648C11.234 8.57605 11.2424 4.31395 11.2465 2.79317C11.2475 2.35243 11.6069 1.99383 12.0477 1.99383H12.0803C12.2947 1.99383 12.4961 2.07738 12.6475 2.22918C12.7989 2.38093 12.882 2.5826 12.8815 2.79727C12.877 5.0945 12.8696 8.72728 12.866 11.0047C12.8653 11.3948 13.181 11.7118 13.5712 11.7125H13.5725C13.9621 11.7124 14.2782 11.3971 14.279 11.0073C14.2799 10.6569 14.2869 6.21698 14.2904 6.06561C14.2926 5.62609 14.652 5.26853 15.0915 5.26853C15.3057 5.26853 15.507 5.35194 15.6583 5.5035C15.8097 5.65501 15.8929 5.8564 15.8927 6.07003L15.8795 13.3304L15.8825 15.6905Z"
          />
        </svg>
      </svg>
    </button>
  );
};
