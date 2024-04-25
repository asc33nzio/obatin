export type Category = {
  id: number;
  name: string;
  categorySlug: string;
  imageUrl: string;
  catagoryLevel: string;
  hasChild: string;
  parentId: number;
};

export type ProductType = {
  id: number;
  manufacturer_id: string;
  name: string;
  product_slug: string;
  general_indication: string;
  dosage: string;
  how_to_use: string;
  side_effects: string;
  contraindication: string;
  warning: string;
  bpom_number: string;
  generic_name: string;
  content: string;
  description: string;
  classification: string;
  packaging: string;
  selling_unit: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  image_url: string;
  thumbnail_url: string;
  is_active: boolean;
  is_prescription_required: boolean;
  min_price: number;
  max_price: number;
  size: string;
};

export type CategoryType = {
  id: string;
  name: string;
  category_slug: string;
  image_url: string;
  has_child: boolean;
  category_level: number;
  children: [];
};

export const Product = [
  {
    name: 'Paracetamol',
    size: 'Per Botol',
    price: 'Rp 69.420 - Rp 420.069',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6eXYSXZYsUPN9LtP0Si15PhrBlr7WakLDrA0MrXEZw&s',
  },
  {
    name: 'Paracetamol',
    size: 'Per Botol',
    price: 'Rp 69.420 - Rp 420.069',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6eXYSXZYsUPN9LtP0Si15PhrBlr7WakLDrA0MrXEZw&s',
  },
  {
    name: 'Paracetamol',
    size: 'Per Botol',
    price: 'Rp 69.420 - Rp 420.069',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6eXYSXZYsUPN9LtP0Si15PhrBlr7WakLDrA0MrXEZw&s',
  },
  {
    name: 'Paracetamol',
    size: 'Per Botol',
    price: 'Rp 69.420 - Rp 420.069',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6eXYSXZYsUPN9LtP0Si15PhrBlr7WakLDrA0MrXEZw&s',
  },
  {
    name: 'Paracetamol',
    size: 'Per Botol',
    price: 'Rp 69.420 - Rp 420.069',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6eXYSXZYsUPN9LtP0Si15PhrBlr7WakLDrA0MrXEZw&s',
  },
];
