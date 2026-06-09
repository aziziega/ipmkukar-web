// Daftar Kecamatan di Kutai Kartanegara
// Source: Data administratif Kabupaten Kutai Kartanegara

export const kukarDistricts = [
  "Anggana",
  "Muara Badak",
  "Marang Kayu",
  "Muara Jawa",
  "Loa Janan",
  "Loa Kulu",
  "Samboja",
  "Samboja Barat",
  "Sanga-Sanga",
  "Muara Muntai",
  "Kota Bangun",
  "Kenohan",
  "Kembang Janggut",
  "Tenggarong",
  "Tenggarong Seberang",
  "Sebulu",
  "Muara Wis",
  "Tabang",
  "Elong Hulu",
] as const

export type KukarDistrict = typeof kukarDistricts[number]
