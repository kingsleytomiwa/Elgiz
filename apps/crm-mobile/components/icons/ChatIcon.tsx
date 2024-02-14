"use client";

import { useUnread } from "lib/use-fetch";

const ChatIcon = ({ fill }: { fill: string; }) => {
  const unread = useUnread();

  return (
    <svg
      width="62"
      height="40"
      viewBox="0 0 62 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.48383 23.5045C4.22063 21.7269 3.89183 19.3141 4.62783 17.2445C6.56063 11.8149 13.831 10.1861 18.4518 13.1989C19.387 13.8077 20.247 14.5813 20.8726 15.5365C21.5414 16.5565 20.0438 17.5461 19.375 16.5269C18.8832 15.7726 18.2541 15.1173 17.5206 14.5949C13.7206 11.9053 7.45343 13.0853 5.66703 17.6269C4.97663 19.3821 5.22863 21.4045 6.23103 23.0093C6.54063 23.5029 5.82303 23.9821 5.48383 23.5045Z"
        fill={fill}
      />
      <path
        d="M20.307 28.9593C16.227 30.9065 11.2574 30.7673 7.26696 28.6913C6.58216 28.3353 7.06856 27.3065 7.78136 27.6121C11.4958 29.2049 15.903 29.0969 19.5246 27.3433C20.6246 26.8137 21.4134 28.4329 20.307 28.9593Z"
        fill={fill}
      />
      <path
        d="M4.2516 30.1399C3.5316 30.3927 2.77 30.6943 2.0356 30.9007C1.186 31.1391 0.400401 30.2255 0.708401 29.4031C0.862801 28.9871 1.2684 27.8599 1.418 27.4255C1.6668 26.7055 2.1268 25.5935 2.2916 24.8703C2.4852 24.0231 1.806 23.3303 1.522 22.5783C-0.311599 17.7199 1.9812 12.5847 6.2588 10.0039C11.5076 6.8367 18.7324 7.1191 23.4988 11.0287C24.286 11.6743 24.9893 12.4157 25.5924 13.2359C25.9748 13.7559 25.9124 14.4999 25.4164 14.9111C25.2861 15.0178 25.135 15.096 24.9726 15.1407C24.8103 15.1854 24.6404 15.1955 24.4739 15.1705C24.3073 15.1455 24.1479 15.0858 24.0059 14.9954C23.8638 14.905 23.7423 14.7858 23.6492 14.6455C19.7428 8.7895 10.4396 8.2271 5.2564 12.7599C2.6068 15.0799 1.3836 18.7751 2.6964 22.1151C3.0724 23.0751 3.7508 24.0127 3.4572 25.0855C3.0468 26.5863 2.246 28.3479 1.7772 29.7871C2.4428 29.5391 3.1732 29.2543 3.8404 29.0111C4.6052 28.7319 5.0172 29.8695 4.2516 30.1399Z"
        fill={fill}
      />
      <path
        d="M34.6972 30.2962C30.7412 32.6114 25.0596 31.4722 22.498 27.5514C20.4324 24.3906 21.2348 20.2538 24.0804 17.8578C25.8796 16.3426 28.2212 15.5834 30.5604 15.6418C35.9764 15.777 40.6404 20.6634 38.6124 26.1538C38.4524 26.581 38.1124 26.9962 38.1188 27.4674C38.3156 28.5466 38.9324 29.961 39.2988 31.0026C39.5068 31.5954 38.9588 32.2754 38.3444 32.1146C37.8124 31.9746 37.294 31.6962 36.7828 31.4898C36.2348 31.2682 36.5708 30.4338 37.1172 30.6602C37.538 30.8346 38.0836 31.0986 38.5044 31.2874C38.5044 31.2874 38.5188 31.2778 38.5148 31.2818C38.5108 31.2858 38.5148 31.2818 38.5148 31.2762C38.1732 30.3042 37.6452 28.9602 37.3084 27.9802C37.0476 27.221 37.4684 26.5026 37.7284 25.8098C39.4996 21.145 35.0684 17.3298 30.5332 17.3546C28.6316 17.3634 26.6972 17.9946 25.2364 19.2074C23.0148 21.0554 22.334 24.1946 23.8708 26.6954C25.9684 30.109 30.7076 31.0594 34.2988 29.4954C34.8116 29.273 35.1836 30.0114 34.6972 30.2962Z"
        fill={fill}
      />
      {unread.data && <circle cx="55" cy="20" r="7" fill="#2B3467" />}
    </svg>
  );
};

export default ChatIcon;