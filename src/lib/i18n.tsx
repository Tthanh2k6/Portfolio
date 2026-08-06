import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "vi" | "en";

const STORAGE_KEY = "site_lang";

type LangValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Chọn chuỗi theo ngôn ngữ hiện tại. Thiếu bản tiếng Anh thì rơi về tiếng Việt. */
  t: <T>(vi: T, en?: T) => T;
  /**
   * Lấy một trường của object dữ liệu theo ngôn ngữ: `pick(proj, "desc")` sẽ trả về
   * `proj.descEn` khi đang ở tiếng Anh và trường đó tồn tại, ngược lại trả `proj.desc`.
   * Nhờ vậy dữ liệu dự án / kỹ năng chỉ cần thêm hậu tố "En" là xong, không phải
   * tách thành hai mảng song song rồi lo hai bên lệch nhau.
   */
  pick: (obj: any, key: string) => any;
};

const LangContext = createContext<LangValue>({
  lang: "vi",
  setLang: () => {},
  t: (vi) => vi,
  pick: (obj, key) => obj?.[key],
});

export function LangProvider({ children }: { children: ReactNode }) {
  // LUÔN khởi tạo "vi" để HTML server dựng khớp lần render đầu ở client (không lệch
  // hydrate). Ngôn ngữ đã lưu được áp ngay sau khi mount.
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "vi") setLangState(saved);
    } catch {
      // localStorage bị chặn (chế độ riêng tư) — cứ dùng tiếng Việt.
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* bỏ qua */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  const t = useCallback(
    <T,>(vi: T, en?: T): T => (lang === "en" && en !== undefined ? en : vi),
    [lang]
  );

  const pick = useCallback(
    (obj: any, key: string) => {
      if (!obj) return undefined;
      if (lang === "en") {
        const en = obj[`${key}En`];
        if (en !== undefined && en !== null && en !== "") return en;
      }
      return obj[key];
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t, pick }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
