interface QRCodeDisplayProps {
  qrCodeUri: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({ qrCodeUri, size = 128, className = '' }: QRCodeDisplayProps) {
  // 使用第三方在线 QR 码生成服务
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrCodeUri)}`;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {qrCodeUri ? (
        <img
          src={qrCodeImageUrl}
          alt="Google Authenticator QR Code"
          className="border-2 border-gray-200 rounded-lg"
          width={size}
          height={size}
          onError={(e) => {
            // 如果在线服务失败，显示备用内容
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <p class="text-xs text-gray-500 text-center">请手动输入密钥</p>
                </div>
              `;
            }
          }}
        />
      ) : (
        <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-xs text-gray-500">加载中...</p>
        </div>
      )}
    </div>
  );
}
