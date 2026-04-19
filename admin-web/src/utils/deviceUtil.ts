import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { v4 as uuidv4 } from "uuid";

const DEVICE_IMEI_KEY = "secure_device_imei";

// visitorId từ FingerprintJS dựa trên Canvas fingerprint, WebGL, Timezone, CPU cores...
// uuidv4 random
// từ 2 cái này tạo ra deviceId
export const getDeviceId = async (): Promise<string> => {
  const existing = localStorage.getItem(DEVICE_IMEI_KEY);
  if (existing) return existing;

  let id: string;
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    id = `${result.visitorId}-${uuidv4()}`;
  } catch {
    id = `fallback-${uuidv4()}`;
  }

  localStorage.setItem(DEVICE_IMEI_KEY, id);
  return id;
};
