export interface District {
  code: number;
  name: string;
}

export interface Province {
  code: number;
  name: string;
  districts: District[];
}

/**
 * Lấy danh sách tỉnh/thành phố + quận/huyện Việt Nam
 */
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    // Lấy depth=2 để có cả quận/huyện
    const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
    if (!res.ok) throw new Error("Failed to fetch provinces");

    const data = await res.json();

    return data.map((p: any) => ({
      code: p.code,
      name: p.name,
      districts: p.districts.map((d: any) => ({
        code: d.code,
        name: d.name,
      })),
    }));
  } catch (err) {
    console.error("fetchProvinces error:", err);
    return [];
  }
};
