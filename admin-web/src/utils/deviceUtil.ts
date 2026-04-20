import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { v4 as uuidv4 } from "uuid";

const DEVICE_IMEI_KEY = "device_imei";

// visitorId từ FingerprintJS dựa trên Canvas/WebGL/Fonts, Hardware/Timezone, Số core CPU...
// uuidv4 random
// từ 2 cái này tạo ra deviceIMEI cho web
export const getDeviceIMEI = async (): Promise<string> => {
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
