const RequestIcon = ({ fill }: { fill: string; }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="5" width="30" height="30" rx="5" fill={fill} />
      <path
        d="M9.6875 20H30.3125M9.6875 24.6875H30.3125M9.6875 29.375H30.3125M12.0312 10.625H27.9688C29.2632 10.625 30.3125 11.6743 30.3125 12.9688C30.3125 14.2632 29.2632 15.3125 27.9688 15.3125H12.0312C10.7368 15.3125 9.6875 14.2632 9.6875 12.9688C9.6875 11.6743 10.7368 10.625 12.0312 10.625Z"
        stroke="#FDFFF1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RequestIcon;
