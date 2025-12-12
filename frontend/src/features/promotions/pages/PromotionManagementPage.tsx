import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { API_CONFIG } from '../../../config/api.config'
import { PromotionHeader } from '../components/PromotionHeader'
import { PromotionSearchFilter } from '../components/PromotionSearchFilter'
import { PromotionStatistics } from '../components/PromotionStatistics'
import { promotionPageConfig } from '../config/promotionPageConfig'
import { usePromotionManagementPage } from '../hooks/usePromotionManagementPage'
import type { CreatePromotionRequest, UpdatePromotionRequest } from '../types/api'
import type { PromotionEntity } from '../types/entity'

export function PromotionManagementPage() {
    const {
        promotions,
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

        createPromotion,
        updatePromotion,
        deletePromotion,
        pageErrorMessage,
        formErrorMessage,
        clearPageError,
        clearFormError,
    } = usePromotionManagementPage()

    // Tính số khuyến mãi đang hoạt động
    const activePromotions = promotions.filter(p => p.status === API_CONFIG.PROMOTION_STATUS.ACTIVE).length

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
                renderHeader={() => <PromotionHeader promotions={promotions} />}
                statisticsSlot={
                    <PromotionStatistics
                        totalPromotions={total}
                        activePromotions={activePromotions}
                    />
                }
                filtersSlot={
                    <PromotionSearchFilter
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
