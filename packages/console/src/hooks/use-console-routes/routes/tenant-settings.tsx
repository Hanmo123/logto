import { condArray } from '@silverhand/essentials';
import { lazy, useContext, useMemo } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import { TenantSettingsTabs } from '@/consts';
import { TenantsContext } from '@/contexts/TenantsProvider';
import useCurrentTenantScopes from '@/hooks/use-current-tenant-scopes';
import NotFound from '@/pages/NotFound';

const TenantSettings = lazy(async () => import('@/pages/TenantSettings'));
const TenantBasicSettings = lazy(async () => import('@/pages/TenantSettings/TenantBasicSettings'));
const TenantDomainSettings = lazy(
  async () => import('@/pages/TenantSettings/TenantDomainSettings')
);
const TenantMembers = lazy(async () => import('@/pages/TenantSettings/TenantMembers'));
const Invitations = lazy(async () => import('@/pages/TenantSettings/TenantMembers/Invitations'));
const Members = lazy(async () => import('@/pages/TenantSettings/TenantMembers/Members'));
const BillingHistory = lazy(async () => import('@/pages/TenantSettings/BillingHistory'));
const Subscription = lazy(async () => import('@/pages/TenantSettings/Subscription'));

export const useTenantSettings = () => {
  const { isDevTenant } = useContext(TenantsContext);
  const {
    access: { canInviteMember, canManageTenant },
  } = useCurrentTenantScopes();

  const tenantSettings: RouteObject = useMemo(
    () => ({
      path: 'tenant-settings',
      element: <TenantSettings />,
      children: condArray(
        {
          index: true,
          element: (
            <Navigate
              replace
              to={canManageTenant ? TenantSettingsTabs.Settings : TenantSettingsTabs.Members}
            />
          ),
        },
        { path: TenantSettingsTabs.Settings, element: <TenantBasicSettings /> },
        {
          path: `${TenantSettingsTabs.Members}/*`,
          element: <TenantMembers />,
          children: [
            { path: '*', element: <NotFound /> },
            { index: true, element: <Members /> },
            ...condArray(canInviteMember && [{ path: 'invitations', element: <Invitations /> }]),
          ],
        },
        { path: TenantSettingsTabs.Domains, element: <TenantDomainSettings /> },
        !isDevTenant &&
          canManageTenant && [
            { path: TenantSettingsTabs.Subscription, element: <Subscription /> },
            { path: TenantSettingsTabs.BillingHistory, element: <BillingHistory /> },
          ]
      ),
    }),
    [canInviteMember, canManageTenant, isDevTenant]
  );

  return tenantSettings;
};
