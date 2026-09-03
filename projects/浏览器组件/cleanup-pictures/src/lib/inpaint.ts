/**
 * 一个纯前端的「内容感知填充」兜底实现。
 *
 * 思路：多分辨率金字塔 + 由外向内的邻域扩散。
 *  1. 把图片和遮罩逐级 1/2 降采样成金字塔；
 *  2. 在最粗的一层把空洞完全填满；
 *  3. 逐层上采样回更细的一层，再用真实邻域像素做几轮平滑。
 *
 * 效果远不如真正的 AI inpainting（会比较糊），
 * 但能在没有后端 API Key 时给出可用的演示结果。
 */

type Level = {
  w: number;
  h: number;
  r: Float32Array;
  g: Float32Array;
  b: Float32Array;
  /** 1 = 已知像素（保留原图），0 = 需要修补 */
  known: Uint8Array;
};

const MAX_WORK_SIZE = 1024;
const MIN_LEVEL_SIZE = 8;
const MAX_LEVELS = 8;

function createLevel(w: number, h: number): Level {
  const size = w * h;
  return {
    w,
    h,
    r: new Float32Array(size),
    g: new Float32Array(size),
    b: new Float32Array(size),
    known: new Uint8Array(size),
  };
}

/** 降采样：2x2 块里只统计已知像素，全未知则整块继续未知 */
function downsample(src: Level): Level {
  const w = Math.max(1, Math.floor(src.w / 2));
  const h = Math.max(1, Math.floor(src.h / 2));
  const dst = createLevel(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let count = 0;

      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const sx = x * 2 + dx;
          const sy = y * 2 + dy;
          if (sx >= src.w || sy >= src.h) continue;
          const i = sy * src.w + sx;
          if (!src.known[i]) continue;
          sr += src.r[i];
          sg += src.g[i];
          sb += src.b[i];
          count++;
        }
      }

      const j = y * w + x;
      if (count > 0) {
        dst.r[j] = sr / count;
        dst.g[j] = sg / count;
        dst.b[j] = sb / count;
        dst.known[j] = 1;
      }
    }
  }

  return dst;
}

/** 未知像素的包围盒，用来把迭代限制在必要区域里 */
function unknownBounds(level: Level) {
  let minX = level.w;
  let minY = level.h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < level.h; y++) {
    for (let x = 0; x < level.w; x++) {
      if (level.known[y * level.w + x]) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  return { minX, minY, maxX, maxY, valid: maxX >= 0 };
}

/**
 * 由外向内填充：每一轮把「有已知邻居」的未知像素设为邻居均值。
 * 扫描范围限制在未知区域的包围盒内，所以大图上也不会卡。
 */
function fillUnknown(level: Level) {
  const bounds = unknownBounds(level);
  if (!bounds.valid) return;

  const { w, h, r, g, b, known } = level;
  const nextR = new Float32Array(w * h);
  const nextG = new Float32Array(w * h);
  const nextB = new Float32Array(w * h);
  const nextKnown = new Uint8Array(w * h);

  const maxIterations = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) + 4;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let changed = false;

    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      for (let x = bounds.minX; x <= bounds.maxX; x++) {
        const i = y * w + x;
        if (known[i]) continue;

        let sr = 0;
        let sg = 0;
        let sb = 0;
        let count = 0;

        if (x > 0 && known[i - 1]) {
          sr += r[i - 1];
          sg += g[i - 1];
          sb += b[i - 1];
          count++;
        }
        if (x < w - 1 && known[i + 1]) {
          sr += r[i + 1];
          sg += g[i + 1];
          sb += b[i + 1];
          count++;
        }
        if (y > 0 && known[i - w]) {
          sr += r[i - w];
          sg += g[i - w];
          sb += b[i - w];
          count++;
        }
        if (y < h - 1 && known[i + w]) {
          sr += r[i + w];
          sg += g[i + w];
          sb += b[i + w];
          count++;
        }

        if (count === 0) continue;
        nextR[i] = sr / count;
        nextG[i] = sg / count;
        nextB[i] = sb / count;
        nextKnown[i] = 1;
        changed = true;
      }
    }

    if (!changed) break;

    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      for (let x = bounds.minX; x <= bounds.maxX; x++) {
        const i = y * w + x;
        if (!nextKnown[i]) continue;
        r[i] = nextR[i];
        g[i] = nextG[i];
        b[i] = nextB[i];
        known[i] = 1;
        nextKnown[i] = 0;
      }
    }
  }

  // 极端情况（比如整张图都被涂满）：兜底填成已知像素的平均值
  let remaining = false;
  let ar = 0;
  let ag = 0;
  let ab = 0;
  let total = 0;

  for (let i = 0; i < known.length; i++) {
    if (known[i]) {
      ar += r[i];
      ag += g[i];
      ab += b[i];
      total++;
    } else {
      remaining = true;
    }
  }

  if (remaining) {
    const fallbackR = total > 0 ? ar / total : 255;
    const fallbackG = total > 0 ? ag / total : 255;
    const fallbackB = total > 0 ? ab / total : 255;
    for (let i = 0; i < known.length; i++) {
      if (known[i]) continue;
      r[i] = fallbackR;
      g[i] = fallbackG;
      b[i] = fallbackB;
    }
  }
}

/** 把粗层的修补结果上采样进细层的未知区域 */
function upsampleTo(coarse: Level, fine: Level) {
  const scaleX = coarse.w / fine.w;
  const scaleY = coarse.h / fine.h;

  for (let y = 0; y < fine.h; y++) {
    for (let x = 0; x < fine.w; x++) {
      const i = y * fine.w + x;
      if (fine.known[i]) continue;

      const fx = Math.min(coarse.w - 1, Math.max(0, (x + 0.5) * scaleX - 0.5));
      const fy = Math.min(coarse.h - 1, Math.max(0, (y + 0.5) * scaleY - 0.5));

      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const x1 = Math.min(coarse.w - 1, x0 + 1);
      const y1 = Math.min(coarse.h - 1, y0 + 1);
      const tx = fx - x0;
      const ty = fy - y0;

      const p00 = y0 * coarse.w + x0;
      const p10 = y0 * coarse.w + x1;
      const p01 = y1 * coarse.w + x0;
      const p11 = y1 * coarse.w + x1;

      const w00 = (1 - tx) * (1 - ty);
      const w10 = tx * (1 - ty);
      const w01 = (1 - tx) * ty;
      const w11 = tx * ty;

      fine.r[i] = coarse.r[p00] * w00 + coarse.r[p10] * w10 + coarse.r[p01] * w01 + coarse.r[p11] * w11;
      fine.g[i] = coarse.g[p00] * w00 + coarse.g[p10] * w10 + coarse.g[p01] * w01 + coarse.g[p11] * w11;
      fine.b[i] = coarse.b[p00] * w00 + coarse.b[p10] * w10 + coarse.b[p01] * w01 + coarse.b[p11] * w11;
    }
  }
}

/** 在工作分辨率上跑完整修补，返回填补好的 ImageData */
function inpaintAtWorkSize(
  workData: Uint8ClampedArray,
  workW: number,
  workH: number,
  workMask: Uint8Array,
): Uint8ClampedArray {
  const base = createLevel(workW, workH);

  for (let i = 0; i < workW * workH; i++) {
    base.r[i] = workData[i * 4];
    base.g[i] = workData[i * 4 + 1];
    base.b[i] = workData[i * 4 + 2];
    base.known[i] = workMask[i] ? 0 : 1;
  }

  const levels: Level[] = [base];
  while (
    levels.length < MAX_LEVELS &&
    Math.min(levels[levels.length - 1].w, levels[levels.length - 1].h) > MIN_LEVEL_SIZE
  ) {
    levels.push(downsample(levels[levels.length - 1]));
  }

  fillUnknown(levels[levels.length - 1]);

  for (let i = levels.length - 1; i > 0; i--) {
    upsampleTo(levels[i], levels[i - 1]);
    fillUnknown(levels[i - 1]);
  }

  const filled = new Uint8ClampedArray(workW * workH * 4);
  for (let i = 0; i < workW * workH; i++) {
    filled[i * 4] = base.r[i];
    filled[i * 4 + 1] = base.g[i];
    filled[i * 4 + 2] = base.b[i];
    filled[i * 4 + 3] = 255;
  }

  return filled;
}

function sampleBilinear(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  fx: number,
  fy: number,
  out: [number, number, number],
) {
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const x1 = Math.min(w - 1, x0 + 1);
  const y1 = Math.min(h - 1, y0 + 1);
  const tx = fx - x0;
  const ty = fy - y0;

  const i00 = (y0 * w + x0) * 4;
  const i10 = (y0 * w + x1) * 4;
  const i01 = (y1 * w + x0) * 4;
  const i11 = (y1 * w + x1) * 4;

  for (let c = 0; c < 3; c++) {
    out[c] =
      data[i00 + c] * (1 - tx) * (1 - ty) +
      data[i10 + c] * tx * (1 - ty) +
      data[i01 + c] * (1 - tx) * ty +
      data[i11 + c] * tx * ty;
  }
}

/**
 * 在浏览器里做一次修补。
 * @param source  原图 ImageData（会被复制，不修改入参）
 * @param mask    Uint8Array，长度 = w*h，非 0 表示「要擦掉的区域」
 * @returns       新的 ImageData，尺寸与 source 一致
 */
export function inpaintLocally(
  source: ImageData,
  mask: Uint8Array,
): ImageData {
  const w = source.width;
  const h = source.height;
  const scale = Math.min(1, MAX_WORK_SIZE / Math.max(w, h));

  const workW = Math.max(1, Math.round(w * scale));
  const workH = Math.max(1, Math.round(h * scale));

  // 先把原图缩到工作分辨率
  const sourceCanvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(w, h)
      : Object.assign(document.createElement("canvas"), { width: w, height: h });
  const sourceCtx = sourceCanvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null;
  if (!sourceCtx) throw new Error("无法创建 2D 上下文");
  sourceCtx.putImageData(source, 0, 0);

  const workCanvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(workW, workH)
      : Object.assign(document.createElement("canvas"), { width: workW, height: workH });
  const workCtx = workCanvas.getContext("2d", { willReadFrequently: true }) as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null;
  if (!workCtx) throw new Error("无法创建 2D 上下文");
  workCtx.drawImage(sourceCanvas as CanvasImageSource, 0, 0, workW, workH);
  const workData = workCtx.getImageData(0, 0, workW, workH);

  // 遮罩同步缩到工作分辨率（取块内最大值，避免细笔刷被吞掉）
  const workMask = new Uint8Array(workW * workH);
  const blockW = w / workW;
  const blockH = h / workH;
  for (let y = 0; y < workH; y++) {
    for (let x = 0; x < workW; x++) {
      const sx0 = Math.floor(x * blockW);
      const sy0 = Math.floor(y * blockH);
      const sx1 = Math.min(w, Math.max(sx0 + 1, Math.floor((x + 1) * blockW)));
      const sy1 = Math.min(h, Math.max(sy0 + 1, Math.floor((y + 1) * blockH)));
      let hit = 0;
      for (let sy = sy0; sy < sy1; sy++) {
        for (let sx = sx0; sx < sx1; sx++) {
          if (mask[sy * w + sx]) {
            hit = 1;
            break;
          }
        }
        if (hit) break;
      }
      workMask[y * workW + x] = hit;
    }
  }

  const filled = inpaintAtWorkSize(workData.data, workW, workH, workMask);

  // 只替换被遮罩覆盖的像素，未涂抹区域保持原图画质
  const output = new Uint8ClampedArray(source.data);
  const rgb: [number, number, number] = [0, 0, 0];
  const scaleX = workW / w;
  const scaleY = workH / h;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!mask[i]) continue;
      const fx = Math.min(workW - 1, Math.max(0, (x + 0.5) * scaleX - 0.5));
      const fy = Math.min(workH - 1, Math.max(0, (y + 0.5) * scaleY - 0.5));
      sampleBilinear(filled, workW, workH, fx, fy, rgb);
      output[i * 4] = rgb[0];
      output[i * 4 + 1] = rgb[1];
      output[i * 4 + 2] = rgb[2];
      output[i * 4 + 3] = 255;
    }
  }

  // 边缘羽化：让修补区域和原图衔接得更自然
  for (let pass = 0; pass < 2; pass++) {
    const snapshot = new Uint8ClampedArray(output);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (!mask[i]) continue;
        let touchesOutside = false;
        if (x > 0 && !mask[i - 1]) touchesOutside = true;
        if (x < w - 1 && !mask[i + 1]) touchesOutside = true;
        if (y > 0 && !mask[i - w]) touchesOutside = true;
        if (y < h - 1 && !mask[i + w]) touchesOutside = true;
        if (!touchesOutside) continue;

        let sr = 0;
        let sg = 0;
        let sb = 0;
        let count = 0;
        const neighbours = [
          i - 1,
          i + 1,
          i - w,
          i + w,
        ];
        for (const n of neighbours) {
          if (n < 0 || n >= w * h) continue;
          sr += snapshot[n * 4];
          sg += snapshot[n * 4 + 1];
          sb += snapshot[n * 4 + 2];
          count++;
        }
        if (count === 0) continue;
        output[i * 4] = (snapshot[i * 4] + sr / count) / 2;
        output[i * 4 + 1] = (snapshot[i * 4 + 1] + sg / count) / 2;
        output[i * 4 + 2] = (snapshot[i * 4 + 2] + sb / count) / 2;
      }
    }
  }

  return new ImageData(output, w, h);
}
