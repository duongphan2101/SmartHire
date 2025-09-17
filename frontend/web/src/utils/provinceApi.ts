export interface Province {
  code: number;
  name: string;
}

/**
 * Lấy danh sách tỉnh/thành phố Việt Nam
 */
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    const res = await fetch("https://provinces.open-api.vn/api/v1/?depth=2");
    if (!res.ok) throw new Error("Failed to fetch provinces");

    const data = await res.json();
    return data.map((p: any) => ({
      code: p.code,
      name: p.name,
    }));
  } catch (err) {
    console.error("fetchProvinces error:", err);
    return [];
  }
};
