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

const VAPI_BASE_URL = "https://vapi.vnappmob.com/api/v2/";

// Định nghĩa kiểu dữ liệu trả về từ VAPI để code sạch hơn
interface VApiProvince {
  province_id: string;
  province_name: string;
}

interface VApiDistrict {
  district_id: string;
  district_name: string;
  province_id: string;
}

/**
 * Lấy danh sách tất cả các tỉnh/thành phố của Việt Nam (V2 - ĐÃ SỬA).
 */
export const fetchProvinces_V2 = async (): Promise<Province[]> => {
  try {
    const response = await fetch(`${VAPI_BASE_URL}province/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // BIẾN ĐỔI (MAP) DỮ LIỆU:
    // Chuyển { province_id, province_name } -> { code, name, districts }
    const provinces: Province[] = (data.results || []).map((p: VApiProvince) => ({
      code: parseInt(p.province_id, 10), // Chuyển string "01" -> number 1
      name: p.province_name,
      districts: [] // Thêm mảng rỗng để khớp với interface Province
    }));

    return provinces;

  } catch (error) {
    console.error("fetchProvinces_V2 error:", error);
    return []; // Trả về mảng rỗng khi lỗi
  }
};

/**
 * Lấy chi tiết quận/huyện của một tỉnh (V2 - ĐÃ SỬA).
 * @param provinceId Mã ID của tỉnh (ví dụ: 79)
 */
export const fetchDistrictsByProvinceId = async (provinceId: string | number): Promise<District[]> => {
  if (!provinceId) {
    console.warn("Chưa cung cấp provinceId");
    return []; // Trả về mảng rỗng nếu không có ID
  }

  const API_URL = `${VAPI_BASE_URL}province/district/${provinceId}`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // BIẾN ĐỔI (MAP) DỮ LIỆU:
    // Chuyển { district_id, district_name } -> { code, name }
    const districts: District[] = (data.results || []).map((d: VApiDistrict) => ({
      code: parseInt(d.district_id, 10), // Chuyển string "760" -> number 760
      name: d.district_name
    }));

    return districts;

  } catch (error) {
    console.error("fetchDistricts error:", error);
    return []; // Trả về mảng rỗng khi lỗi
  }
};
