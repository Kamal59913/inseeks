export interface Subcategory {
  _id: string;
  name: string;
  canEdit: boolean;
  canDelete: boolean;
}

export interface CategoryData {
  _id: string;
  name: string;
  subcategories: Subcategory[];
  canEdit: boolean;
  canDelete: boolean;
}

export interface CategoryState {
  categoryData: CategoryData | null;
}

export const initialState: CategoryState = {
  categoryData: null,
};

