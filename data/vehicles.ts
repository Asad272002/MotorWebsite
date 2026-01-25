export interface VehicleSpec {
  label: string;
  value: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: 'TARO' | 'LIFAN' | 'Other';
  tagline: string;
  price: string;
  description: string;
  category: string;
  specs: VehicleSpec[];
  modelPath?: string; // Optional path to .glb file
  imagePath?: string; // Optional path to .png/.jpg file
}

export const vehiclesData: Record<string, Vehicle> = {
  // TARO MODELS
  'taro-gp1-401': {
    id: 'taro-gp1-401',
    name: 'TARO GP1 401',
    brand: 'TARO',
    tagline: 'Racing DNA, Street Soul',
    price: 'Contact for Price',
    description: 'The TARO GP1 401 combines aggressive racing aesthetics with street-tuned performance. Featuring a powerful ~401cc engine and premium components like inverted forks and a TFT digital cluster, it is built for riders who demand presence and power.',
    category: 'Racing / Street',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled, 4-stroke' },
      { label: 'Displacement', value: '~401 cc' },
      { label: 'Power', value: '~27 kW @ ~7500 rpm' },
      { label: 'Torque', value: '~35 Nm @ ~5500 rpm' },
      { label: 'Transmission', value: '6-speed' },
      { label: 'Brakes', value: 'Disc front & rear, Dual-channel ABS' },
      { label: 'Top Speed', value: '~135–140 km/h' },
    ],
    imagePath: '/models/tarogp1_400cc.png'
  },
  'taro-gp1-250': {
    id: 'taro-gp1-250',
    name: 'TARO GP1 250',
    brand: 'TARO',
    tagline: 'Entry-Level Aggression',
    price: 'Contact for Price',
    description: 'An entry-level sportbike that punches above its weight. The GP1 250 offers the look and feel of a larger machine with manageable power for developing riders.',
    category: 'Racing / Street',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled, 4-valve' },
      { label: 'Displacement', value: '~250 cc' },
      { label: 'Power', value: '~18–19 kW' },
      { label: 'Torque', value: '~22–23 Nm' },
      { label: 'Brakes', value: 'Disc front & rear, ABS' },
      { label: 'Suspension', value: 'Inverted front, rear monoshock' },
    ],
    imagePath: '/models/tarogp1_250cc.png'
  },
  'taro-gp2-200': {
    id: 'taro-gp2-200',
    name: 'TARO GP2 200',
    brand: 'TARO',
    tagline: 'Sport Riding Simplified',
    price: 'Contact for Price',
    description: 'Perfect for beginner to intermediate riders, the GP2 200 delivers sport styling in an accessible package.',
    category: 'Racing / Street',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled' },
      { label: 'Displacement', value: '~200 cc' },
      { label: 'Power', value: '~15–16 kW' },
      { label: 'Brakes', value: 'Disc front & rear, ABS' },
    ],
    imagePath: '/models/tarogp2_200.png'
  },
  'taro-gp2-250': {
    id: 'taro-gp2-250',
    name: 'TARO GP2 250',
    brand: 'TARO',
    tagline: 'Precision & Performance',
    price: 'Contact for Price',
    description: 'Upgrading the GP2 platform with more power and tech, including a TFT display and a refined sport chassis.',
    category: 'Racing / Street',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled, 4-valve' },
      { label: 'Displacement', value: '~250 cc' },
      { label: 'Power', value: '~18–19 kW' },
      { label: 'Torque', value: '~22 Nm' },
      { label: 'Features', value: 'TFT display, Sport chassis' },
    ],
    imagePath: '/models/tarogp2_250.png'
  },
  'taro-c6-fe-250': {
    id: 'taro-c6-fe-250',
    name: 'TARO C6 FE 250',
    brand: 'TARO',
    tagline: 'Street Fighter Attitude',
    price: 'Contact for Price',
    description: 'A naked street bike designed for urban environments. The C6 FE 250 offers a comfortable upright riding position with aggressive styling.',
    category: 'Street / Naked',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, oil-cooled' },
      { label: 'Displacement', value: '249 cc' },
      { label: 'Power', value: '17 kW @ 7500 rpm' },
      { label: 'Torque', value: '23 Nm @ 6000 rpm' },
      { label: 'Suspension', value: 'Dual shock rear' },
    ],
    imagePath: '/models/taroC6_250.png'
  },
  'taro-c6-fe-300': {
    id: 'taro-c6-fe-300',
    name: 'TARO C6 FE 300',
    brand: 'TARO',
    tagline: 'Mid-Weight Master',
    price: 'Contact for Price',
    description: 'More power for the open road. The C6 FE 300 steps up the performance for riders who need that extra punch.',
    category: 'Street / Naked',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, oil-cooled' },
      { label: 'Displacement', value: '299 cc' },
      { label: 'Power', value: '19.5 kW @ 7500 rpm' },
      { label: 'Torque', value: '27.5 Nm @ 5500 rpm' },
      { label: 'Brakes', value: 'Dual-channel ABS' },
    ]
  },
  'taro-c5-401': {
    id: 'taro-c5-401',
    name: 'TARO C5 401',
    brand: 'TARO',
    tagline: 'The Modern Naked',
    price: 'Contact for Price',
    description: 'With aggressive naked styling, LED lighting, and a TFT display, the C5 401 is a modern machine for the modern rider.',
    category: 'Street / Naked',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled' },
      { label: 'Displacement', value: '~401 cc' },
      { label: 'Power', value: '~27 kW' },
      { label: 'Torque', value: '~35 Nm' },
      { label: 'Features', value: 'TFT display, LED lighting' },
    ],
    imagePath: '/models/taroC5_401.png'
  },

  // LIFAN MODELS
  'lifan-kpt-250': {
    id: 'lifan-kpt-250',
    name: 'LIFAN KPT 250',
    brand: 'LIFAN',
    tagline: 'Adventure Awaits',
    price: 'Contact for Price',
    description: 'Designed for touring and light off-road use, the KPT 250 features long-travel suspension and an ADV-tuned engine.',
    category: 'Adventure / Touring',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled, 4-valve' },
      { label: 'Displacement', value: '250 cc' },
      { label: 'Power', value: '~19 kW' },
      { label: 'Torque', value: '~22 Nm' },
      { label: 'Suspension', value: 'Long-travel, ADV-tuned' },
    ],
    imagePath: '/models/kpt200.png'
  },
  'lifan-kpt-400': {
    id: 'lifan-kpt-400',
    name: 'LIFAN KPT 400',
    brand: 'LIFAN',
    tagline: 'Touring Redefined',
    price: 'Contact for Price',
    description: 'A serious touring machine with a twin-cylinder engine, large windscreen, and comfortable seating for long hauls.',
    category: 'Adventure / Touring',
    specs: [
      { label: 'Engine', value: 'Twin-cylinder, liquid-cooled' },
      { label: 'Displacement', value: '~400 cc' },
      { label: 'Power', value: '~29 kW' },
      { label: 'Torque', value: '~37 Nm' },
      { label: 'Features', value: 'Large windscreen, Touring seat' },
    ],
    imagePath: '/models/lifankpt_400cc.png'
  },
  'lifan-kpm-200': {
    id: 'lifan-kpm-200',
    name: 'LIFAN KPM 200',
    brand: 'LIFAN',
    tagline: 'City Slicker',
    price: 'Contact for Price',
    description: 'A stylish street bike perfect for daily commuting and navigating city traffic.',
    category: 'Street / Naked',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, air/liquid-cooled' },
      { label: 'Displacement', value: '200 cc' },
      { label: 'Power', value: '~15 kW' },
      { label: 'Use Case', value: 'Daily commuting' },
    ],
    imagePath: '/models/lifankpm_200.png'
  },
  'lifan-k19-200': {
    id: 'lifan-k19-200',
    name: 'LIFAN K19 200',
    brand: 'LIFAN',
    tagline: 'Reliable Cruiser',
    price: 'Contact for Price',
    description: 'Focused on fuel efficiency and reliability, the K19 200 is a practical choice for everyday riding.',
    category: 'Street',
    specs: [
      { label: 'Engine', value: 'Single-cylinder' },
      { label: 'Displacement', value: '200 cc' },
      { label: 'Focus', value: 'Fuel efficiency + reliability' },
    ],
    imagePath: '/models/lifanK19_200.png'
  },
  'lifan-k29-250': {
    id: 'lifan-k29-250',
    name: 'LIFAN K29 250',
    brand: 'LIFAN',
    tagline: 'Sport-Naked Style',
    price: 'Contact for Price',
    description: 'Combining sport performance with naked bike aesthetics.',
    category: 'Street / Sport',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled' },
      { label: 'Displacement', value: '250 cc' },
      { label: 'Power', value: '~18–19 kW' },
      { label: 'Brakes', value: 'Disc with ABS' },
    ],
    imagePath: '/models/LifanK29_250.png'
  },
  'lifan-ss2-250': {
    id: 'lifan-ss2-250',
    name: 'LIFAN SS2 250',
    brand: 'LIFAN',
    tagline: 'Sport Entry',
    price: 'Contact for Price',
    description: 'An accessible entry point into the world of sportbikes.',
    category: 'Sport',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled' },
      { label: 'Displacement', value: '250 cc' },
      { label: 'Power', value: '~19 kW' },
      { label: 'Brakes', value: 'Disc front & rear, ABS' },
    ],
    imagePath: '/models/LifanSS2_250.png'
  },
  'lifan-kps-250': {
    id: 'lifan-kps-250',
    name: 'LIFAN KPS 250',
    brand: 'LIFAN',
    tagline: 'Modern Sport',
    price: 'Contact for Price',
    description: 'Featuring modern styling and sport ergonomics for a dynamic riding experience.',
    category: 'Street / Sport',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled' },
      { label: 'Displacement', value: '250 cc' },
      { label: 'Power', value: '~19 kW' },
      { label: 'Features', value: 'Sport ergonomics' },
    ],
    imagePath: '/models/LifanKPS_250.png'
  },
  'lifan-v16s': {
    id: 'lifan-v16s',
    name: 'LIFAN V16S',
    brand: 'LIFAN',
    tagline: 'Classic Cruiser',
    price: 'Contact for Price',
    description: 'A V-twin cruiser with classic styling and air-cooled character.',
    category: 'Cruiser',
    specs: [
      { label: 'Engine', value: 'V-twin, air-cooled' },
      { label: 'Displacement', value: '~250 cc' },
      { label: 'Style', value: 'Classic cruiser' },
    ],
    imagePath: '/models/LifanV16s.png'
  },
  'lifan-v400': {
    id: 'lifan-v400',
    name: 'LIFAN V400',
    brand: 'LIFAN',
    tagline: 'Highway Star',
    price: 'Contact for Price',
    description: 'A powerful liquid-cooled V-twin cruiser built for the open highway.',
    category: 'Cruiser',
    specs: [
      { label: 'Engine', value: 'V-twin, liquid-cooled' },
      { label: 'Displacement', value: '~400 cc' },
      { label: 'Power', value: '~29 kW' },
      { label: 'Torque', value: '~37 Nm' },
    ],
    imagePath: '/models/LifanV400.png'
  },
  'lifan-ss3-200': {
    id: 'lifan-ss3-200',
    name: 'LIFAN SS3 200',
    brand: 'LIFAN',
    tagline: 'Beginner Sport',
    price: 'Contact for Price',
    description: 'Targeted at beginner sport riders, offering a friendly introduction to performance riding.',
    category: 'Sport',
    specs: [
      { label: 'Engine', value: 'Single-cylinder' },
      { label: 'Displacement', value: '200 cc' },
      { label: 'Target', value: 'Beginner sport riders' },
    ],
    imagePath: '/models/LifanSS3_200.png'
  },
  'lifan-x-pect-250': {
    id: 'lifan-x-pect-250',
    name: 'LIFAN X-PECT 250',
    brand: 'LIFAN',
    tagline: 'Go Anywhere',
    price: 'Contact for Price',
    description: 'A dual-sport machine ready for both on-road commuting and off-road adventures.',
    category: 'Dual-Sport / Adventure',
    specs: [
      { label: 'Engine', value: 'Single-cylinder, liquid-cooled' },
      { label: 'Displacement', value: '250 cc' },
      { label: 'Suspension', value: 'Long-travel' },
    ],
    imagePath: '/models/LifanXpect_250.png'
  },
};
