type CookieOptions = {
  expires?: number; // ngày
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
};

export const cookieUtil = {
  // set cookie
  set: (name: string, value: string, options: CookieOptions = {}) => {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookie += `; expires=${date.toUTCString()}`;
    }

    if (options.path) cookie += `; path=${options.path}`;
    else cookie += `; path=/`;

    if (options.domain) cookie += `; domain=${options.domain}`;
    if (options.secure) cookie += `; secure`;
    if (options.sameSite) cookie += `; samesite=${options.sameSite}`;

    document.cookie = cookie;
  },

  // get cookie
  get: (name: string): string | null => {
    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split("; ");

    for (const c of cookies) {
      if (c.startsWith(nameEQ)) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }

    return null;
  },

  // remove cookie
  remove: (name: string, path: string = "/") => {
    document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; path=${path}`;
  },
};
