import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage/GenericPageConfig';

/**
 * reportPageConfig - Config cho ReportManagementPage
 * 
 * Vì trang này chỉ hiển thị statistics nên config này chỉ là placeholder
 * GenericPage sẽ không render Table vì không có onCreate/onUpdate/onDelete
 */
export const reportPageConfig: GenericPageConfig<
  { id: number },
  never,
  never
> = {
  entity: {
    name: 'report',
    displayName: 'Báo cáo',
    displayNamePlural: 'Báo cáo',
  },
  table: {
    rowKey: 'id',
    columns: [],
  },
  form: {
    create: [],
    update: [],
  },
  features: {
    enableCreate: false,
    enableEdit: false,
    enableDelete: false,
  },
};

