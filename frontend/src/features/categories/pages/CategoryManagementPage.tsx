import { CategoryHeader } from '../components/CategoryHeader'
import { CategoryStatistics } from '../components/CategoryStatistics'
import { CategorySearchFilter } from '../components/CategorySearchFilter'
import { useCategoryManagementPage } from '../hooks/useCategoryManagementPage'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { categoryPageConfig } from '../config/categoryPageConfig'
import type { CategoryEntity } from '../types/entity'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types/api'

export function CategoryManagementPage() {
    const {
        categories,
        total,

        searchText,
        sortField,
        sortOrder,
        page,
        pageSize,

        handleSearch,
        handleSort,
        handlePageChange,
        clearFilters,

        handleCreate,
        handleUpdate,
        handleDelete,

        createCategory,
        updateCategory,
        deleteCategory,
        pageErrorMessage,
        formErrorMessage,
        clearPageError,
        clearFormError,
    } = useCategoryManagementPage()

    return (
        <div style={{ padding: '24px' }}>
            <GenericPage<CategoryEntity, CreateCategoryRequest, UpdateCategoryRequest>
                config={categoryPageConfig}
                data={categories}
                total={total}
                loading={createCategory.isPending || updateCategory.isPending || deleteCategory.isPending}
                page={page}
                pageSize={pageSize}
                sortField={sortField}
                sortOrder={sortOrder}
                onPageChange={handlePageChange}
                onSortChange={handleSort}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                createLoading={createCategory.isPending}
                updateLoading={updateCategory.isPending}
                deleteLoading={deleteCategory.isPending}
                pageErrorMessage={pageErrorMessage}
                onClearPageError={clearPageError}
                formErrorMessage={formErrorMessage}
                onClearFormError={clearFormError}
                renderHeader={({ openCreate }) => <CategoryHeader onAddCategory={openCreate} />}
                statisticsSlot={
                    <CategoryStatistics
                        totalCategories={total}
                    />
                }
                filtersSlot={
                    <CategorySearchFilter
                        searchText={searchText}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSearchChange={handleSearch}
                        onSortChange={handleSort}
                        onClearFilters={clearFilters}
                    />
                }
            />
        </div>
    )
}
