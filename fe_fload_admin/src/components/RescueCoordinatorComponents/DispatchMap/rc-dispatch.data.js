export const INCIDENT_LOCATION = {
  lat: 10.7436,
  lng: 106.7017,
  address: "Khu dân cư Tân Hưng, Quận 7, TP.HCM",
};

export const rescueTeams = [
  {
    id: "team-01",
    name: "🚤 Đội cứu hộ 01",
    specialty: "Cứu hộ đường thủy",
    members: 5,
    eta: "8 phút",
    distance: "3.2 km",
    lat: 10.76452,
    lng: 106.69694,
    address:
      "Cầu Ông Lãnh, Phường Nguyễn Thái Bình, Quận 1, TP. Hồ Chí Minh",
  },

  {
    id: "team-02",
    name: "🚑 Đội y tế phản ứng",
    specialty: "Cấp cứu hồi sức",
    members: 3,
    eta: "12 phút",
    distance: "5.1 km",
    lat: 10.73784,
    lng: 106.70152,
    address:
      "Trạm Y tế Phường Phú Mỹ, Đường Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh",
  },

  {
    id: "team-03",
    name: "🚒 Đội PCCC cơ động",
    specialty: "Cháy nổ & cứu nạn",
    members: 6,
    eta: "10 phút",
    distance: "4.3 km",
    lat: 10.75983,
    lng: 106.70076,
    address:
      "Đội Cảnh sát PCCC & CNCH Quận 4, Đường Khánh Hội, TP. Hồ Chí Minh",
  },

  {
    id: "team-04",
    name: "🛟 Đội cứu hộ ven sông",
    specialty: "Cứu nạn vùng ngập",
    members: 4,
    eta: "6 phút",
    distance: "2.0 km",
    lat: 10.75511,
    lng: 106.69842,
    address:
      "Bến thuyền Rạch Ông Lớn, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh",
  },

  {
    id: "team-05",
    name: "🚁 Đội cứu hộ đường không",
    specialty: "Cứu hộ trên cao",
    members: 3,
    eta: "15 phút",
    distance: "12 km",
    lat: 10.81877,
    lng: 106.65588,
    address:
      "Sân bay Tân Sơn Nhất, Phường 2, Quận Tân Bình, TP. Hồ Chí Minh",
  },

  {
    id: "team-06",
    name: "🧑‍⚕️ Đội y tế lưu động",
    specialty: "Sơ cứu & cấp cứu",
    members: 5,
    eta: "9 phút",
    distance: "3.8 km",
    lat: 10.75341,
    lng: 106.69988,
    address:
      "Bệnh viện Quận 4, Đường Đoàn Như Hài, TP. Hồ Chí Minh",
  },

  {
    id: "team-07",
    name: "👷 Đội công binh cứu nạn",
    specialty: "Sập nhà & sạt lở",
    members: 7,
    eta: "14 phút",
    distance: "6.5 km",
    lat: 10.77012,
    lng: 106.68955,
    address:
      "Bộ Tư lệnh Công binh TP.HCM, Đường Trần Hưng Đạo, Quận 5",
  },

  {
    id: "team-08",
    name: "🛥 Đội ca-nô phản ứng nhanh",
    specialty: "Di tản khẩn cấp",
    members: 4,
    eta: "5 phút",
    distance: "1.5 km",
    lat: 10.75684,
    lng: 106.69712,
    address:
      "Bến ca-nô Khánh Hội, Phường 6, Quận 4, TP. Hồ Chí Minh",
  },

  {
    id: "team-09",
    name: "🧭 Đội tìm kiếm & cứu nạn",
    specialty: "Mất tích & tìm kiếm",
    members: 6,
    eta: "11 phút",
    distance: "4.9 km",
    lat: 10.75129,
    lng: 106.70344,
    address:
      "Trụ sở Ban Chỉ huy Quân sự Quận 7, Đường Tân Trào, TP.HCM",
  },

  {
    id: "team-10",
    name: "🏥 Đội hỗ trợ y tế thảm họa",
    specialty: "Y tế thảm họa",
    members: 8,
    eta: "18 phút",
    distance: "9.2 km",
    lat: 10.75565,
    lng: 106.66488,
    address:
      "Bệnh viện Nguyễn Tri Phương, Đường Trần Phú, Quận 5, TP.HCM",
  },

  {
    id: "team-11",
    name: "🛠 Đội kỹ thuật cứu hộ",
    specialty: "Cắt phá & giải cứu",
    members: 5,
    eta: "13 phút",
    distance: "5.7 km",
    lat: 10.74892,
    lng: 106.69433,
    address:
      "Xưởng Kỹ thuật CNCH, Đường Nguyễn Hữu Thọ, Quận 7, TP.HCM",
  },

  {
    id: "team-12",
    name: "🚓 Đội an ninh hỗ trợ",
    specialty: "Phong tỏa & điều phối",
    members: 4,
    eta: "7 phút",
    distance: "2.6 km",
    lat: 10.76014,
    lng: 106.70281,
    address:
      "Công an Phường Tân Hưng, Quận 7, TP.HCM",
  },
];
export const vehicles = [
  {
    id: "vehicle-01",
    name: "🚤 Ca-nô cứu nạn",
    type: "Đường thủy",
    capacity: 8,
  },
  {
    id: "vehicle-02",
    name: "🚑 Xe cứu thương",
    type: "Y tế",
    capacity: 4,
  },
  {
    id: "vehicle-03",
    name: "🚒 Xe cứu hỏa",
    type: "PCCC",
    capacity: 6,
  },
];

