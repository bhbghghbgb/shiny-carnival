import type { CategoryEntity } from "./entity.ts";

export type CreateCategoryRequest = Omit<CategoryEntity, 'id'>

export type UpdateCategoryRequest = Omit<CategoryEntity, 'id'>
