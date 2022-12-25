import { useEffect, useRef } from "react";

interface Crop {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

function ProfileAvatar({ src, crop }: { src: string; crop: Crop }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      context.translate(60, 60);

      const image = new Image();
      image.src = src;

      image.onload = () => {
        context.drawImage(image, 0, 0);
      };

      const data = context.getImageData(
        crop.x || 0,
        crop.y || 0,
        crop.w || 120,
        crop.h || 120
      );

      canvas.width = crop.w || 120;
      canvas.height = crop.h || 120;

      context.putImageData(data, 0, 0);
    }
  }, []);

  return <canvas id="profilePic" ref={canvasRef} width={120} height={120} />;
}

export default ProfileAvatar;
