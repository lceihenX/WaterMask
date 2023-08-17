// 加密png
export const handleConbinatePngCanvasData = (imageData, attachData, colorPosition = 'R') => {
  let bit, offset;
  switch (colorPosition) {
    case 'R':
      bit = 0;
      offset = 3;
      break;
    case 'G':
      bit = 1;
      offset = 2;
      break;
    case 'B':
      bit = 2;
      offset = 1;
      break;
  }

  for (var i = 0; i < imageData.length; i++) {
    if (i % 4 == bit) {
      if (attachData[i + offset] === 0 && imageData[i] % 2 === 1) {
        if (imageData[i] === 255) {
          imageData[i]--;
        } else {
          imageData[i]++;
        }
      } else if (attachData[i + offset] !== 0 && imageData[i] % 2 === 0) {
        imageData[i]++;
      }
    }
  }
};
// 加密jpeg
export const handleConbinateJpgCanvasData = (imageData, attachData, colorPosition = 'R') => {
  let bit;
  switch (colorPosition) {
    case 'R':
      bit = 0;
      break;
    case 'G':
      bit = 1;
      break;
    case 'B':
      bit = 2;
      break;
  }

  for (var i = 0; i < imageData.length; i++) {
    if (i % 3 == bit) {
      if (imageData[i] % 2 === 1) {
        if (imageData[i] === 255) {
          imageData[i]--;
        } else {
          imageData[i]++;
        }
      } else if (imageData[i] % 2 === 0) {
        imageData[i]++;
      }
    }
  }
};

// 解析png
export const handleReTransformPngData = (data) => {
  for (var i = 0; i < data.length; i++) {
    if (i % 4 == 0) {
      if (data[i] % 2 == 0) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 1;
      } else {
        data[i] = 0;
      }
    } else if (i % 4 == 3) {
      continue;
    }
  }
};

// 解密jpg
export const handleReTransformJpgData = (data) => {
  for (var i = 0; i < data.length; i++) {
    if (i % 3 == 0) {
      if (data[i] % 2 == 0) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      } else {
        data[i] = 0;
      }
    }
  }
};
