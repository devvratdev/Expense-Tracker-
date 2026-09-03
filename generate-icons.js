// Rounded rectangle / circle background
  // Check rounded rect corner
  const cornerR = width * 0.22;
  const qx = Math.max(0, Math.abs(x - cx) - (cx - cornerR));
  const qy = Math.max(0, Math.abs(y - cy) - (cy - cornerR));
  const outsideCorner = Math.sqrt(qx * qx + qy * qy) > cornerR;

  if (outsideCorner) {
    rawData[pxOffset] = 0;
    rawData[pxOffset + 1] = 0;
    rawData[pxOffset + 2] = 0;
    rawData[pxOffset + 3] = 0;
  } else {
    // Draw dollar sign or ring
    const isRing = Math.abs(dist - width * 0.26) < (width * 0.025);
    const isVerticalBar = Math.abs(dx) < (width * 0.02) && Math.abs(dy) < (width * 0.22);
    const isCenterS = Math.abs(dx) < (width * 0.1) && Math.abs(dy) < (width * 0.16);

    if (isRing || isVerticalBar) {
      rawData[pxOffset] = 255;
      rawData[pxOffset + 1] = 255;
      rawData[pxOffset + 2] = 255;
      rawData[pxOffset + 3] = 255;
    } else {
      // Emerald gradient: #059669 -> #047857
      const factor = y / height;
      rawData[pxOffset] = Math.round(5 * (1 - factor) + 4 * factor);
      rawData[pxOffset + 1] = Math.round(150 * (1 - factor) + 120 * factor);
      rawData[pxOffset + 2] = Math.round(105 * (1 - factor) + 87 * factor);
      rawData[pxOffset + 3] = 255;
    }
  }
}
