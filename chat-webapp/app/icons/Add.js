import * as React from "react";

const Add = (props) => {
  const { fill } = props;
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        // eslint-disable-next-line max-len
        d="M9.99349 3.40991C10.4077 3.40991 10.7435 3.7457 10.7435 4.15991V9.24325H15.8268C16.241 9.24325 16.5768 9.57903 16.5768 9.99325C16.5768 10.4075 16.241 10.7432 15.8268 10.7432H10.7435V15.8266C10.7435 16.2408 10.4077 16.5766 9.99349 16.5766C9.57928 16.5766 9.24349 16.2408 9.24349 15.8266V10.7432H4.16016C3.74594 10.7432 3.41016 10.4075 3.41016 9.99325C3.41016 9.57903 3.74594 9.24325 4.16016 9.24325H9.24349V4.15991C9.24349 3.7457 9.57928 3.40991 9.99349 3.40991Z"
        fill={fill || "#ffffff"}
      />
    </svg>
  );
};

export default Add;
