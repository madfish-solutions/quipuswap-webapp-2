import { useUiStore } from '@shared/hooks/use-ui-store';

export const useCookiesNotificationViewModel = () => {
  const uiStore = useUiStore();
  const { cookieApprovalModel } = uiStore;

  const approvalValue = cookieApprovalModel.model;

  const handleApproveClick = () => {
    cookieApprovalModel.update(true);
  };

  return { handleApproveClick, approvalValue };
};
