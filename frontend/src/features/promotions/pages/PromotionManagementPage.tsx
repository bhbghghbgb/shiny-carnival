import { PromotionHeader } from '../components/PromotionHeader'
import { PromotionStatistics } from '../components/PromotionStatistics'
import { PromotionSearchFilter } from '../components/PromotionSearchFilter'
import { usePromotionManagementPage } from '../hooks/usePromotionManagementPage'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { promotionPageConfig } from '../config/promotionPageConfig'
import type { PromotionEntity } from '../types/entity'
import type { CreatePromotionRequest, UpdatePromotionRequest } from '../types/api'

export function PromotionManagementPage() {
    const {
        promotions,
        total,
        activePromotionCount,

        searchText,
        sortField,
        sortOrder,
        status,
        page,
        pageSize,

        handleSearch,
        handleSort,
        handleStatusChange,
        handlePageChange,
        clearFilters,

        handleCreate,
        handleUpdate,
        handleDelete,

        createPromotion,
        updatePromotion,
        deletePromotion,
        pageErrorMessage,
        formErrorMessage,
        clearPageError,
        clearFormError,
    } = usePromotionManagementPage()

    // activePromotionCount lấy từ API /api/admin/promotions/active-count trong hook

    return (
        <div style={{ padding: '24px' }}>
            <GenericPage<PromotionEntity, CreatePromotionRequest, UpdatePromotionRequest>
                config={promotionPageConfig}
                data={promotions}
                total={total}
                loading={createPromotion.isPending || updatePromotion.isPending || deletePromotion.isPending}
                page={page}
                pageSize={pageSize}
                sortField={sortField}
                sortOrder={sortOrder}
                onPageChange={handlePageChange}
                onSortChange={handleSort}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                createLoading={createPromotion.isPending}
                updateLoading={updatePromotion.isPending}
                deleteLoading={deletePromotion.isPending}
                pageErrorMessage={pageErrorMessage}
                onClearPageError={clearPageError}
                formErrorMessage={formErrorMessage}
                onClearFormError={clearFormError}
                renderHeader={({ openCreate }) => <PromotionHeader onAddPromotion={openCreate} />}
                statisticsSlot={
                    <PromotionStatistics
                        totalPromotions={total}
                        activePromotions={activePromotionCount}
                    />
                }
                filtersSlot={
                    <PromotionSearchFilter
                        searchText={searchText}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        status={status}
                        onSearchChange={handleSearch}
                        onSortChange={handleSort}
                        onStatusChange={handleStatusChange}
                        onClearFilters={clearFilters}
                    />
                }
            />
        </div>
    )
}
