"use client";

import React, { useState } from "react";
import Price, { Data } from "../Price";

interface Props {}

const LandingPrice: React.FC<Props> = () => {
  const [data, setData] = useState<Data>({
    rooms: 0,
    period: 3,
    extras: [],
  });

  return (
    <div className="flex justify-center w-full">
      <Price data={data} setData={setData} />
    </div>
  );
};

export default LandingPrice;
