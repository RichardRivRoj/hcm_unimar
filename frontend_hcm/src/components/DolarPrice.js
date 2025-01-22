'use client'

import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const DollarPrice = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.style.animation = 'marquee 20s linear infinite';
    }
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
      <div className="overflow-hidden bg-[#d0e0fc] text-[#0b3d91]">
        <div
          ref={scrollRef}
          className="whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-[#0b3d91]" />
          " El valor del dólar, según el BCV, para el día de hoy "
          <span>11-01-2025 es </span>
          <strong id="dollar-bcv-price">53.88</strong>
          {'\u00A0Bs'}
        </div>
      </div>
    </>
  );
};

export default DollarPrice;