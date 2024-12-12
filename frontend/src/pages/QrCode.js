import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
const qrCode = "00020126580014br.gov.bcb.pix0136c70f3156-10f2-4ac8-8382-5ef82d51a0cf5204000053039865802BR5911";
const QrCode = ({ qrCode }) => {
  return (
    <div className='qrcode' style={{ width: 50, height: 50 }}>
    <QRCodeCanvas
      value={qrCode}
      fgColor="#000000"
      bgColor="#FFFFFF"
      level="H"
  />
</div>
  );
};

export default QrCode;