import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";
import type { DeviceData } from "../types/type";

const DEVICE_IMEI_KEY = "device_imei";

export const getDeviceData = async (): Promise<DeviceData> => {
  let imei = localStorage.getItem(DEVICE_IMEI_KEY);

  const parser = new UAParser(navigator.userAgent);
  const browser = parser.getBrowser().name ?? "Unknown Browser";
  const os = parser.getOS();
  const osName = os.name ?? "Unknown OS";
  const osVersion = `${osName} ${os.version ?? ""}`.trim();

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    if (!imei) {
      imei = `${result.visitorId}-${uuidv4()}`;
      localStorage.setItem(DEVICE_IMEI_KEY, imei);
    }

    const data = {
      deviceIMEI: imei,
      deviceName: `${browser} on ${osName}`,
      platform: "Web",
      osVersion,
      userAgent: navigator.userAgent,
    };

    return data;
  } catch {
    if (!imei) {
      imei = `fallback-${uuidv4()}`;
      localStorage.setItem(DEVICE_IMEI_KEY, imei);
    }

    const data = {
      deviceIMEI: imei,
      deviceName: `${browser} on ${osName}`,
      platform: "Web",
      osVersion,
      userAgent: navigator.userAgent,
    };

    return data;
  }
};
