import { MENU_ITEMS } from '@/assets/data/menu-items';
import { hasAnyPermission } from '@/constants/access';

const buildEventLeadMenuItems = (events = []) =>
  events
    .filter((event) => event?.slug && event?.title)
    .map((event) => {
      const key = `event-lead-${event._id || event.slug}`;
      const encodedSlug = encodeURIComponent(event.slug);

      return {
        key,
        label: event.title,
        parentKey: 'leads',
        children: [
          {
            key: `${key}-list`,
            label: 'All Enquiries',
            url: `/pages/event-leads/${encodedSlug}`,
            parentKey: key,
          },
          {
            key: `${key}-add`,
            label: 'Add New Enquiry',
            url: `/event-lead/${encodedSlug}`,
            parentKey: key,
          },
        ],
      };
    });

const mergeUniqueByUrl = (...groups) => {
  const seen = new Set();

  const collectUrls = (item) => {
    if (item?.url) seen.add(item.url);
    (item?.children || []).forEach(collectUrls);
  };

  return groups
    .flat()
    .filter((item) => {
      if (!item?.url) {
        collectUrls(item);
        return true;
      }
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
};

const withDynamicEventLeads = (items, events = []) =>
  items.map((item) => {
    const children = item.children ? withDynamicEventLeads(item.children, events) : undefined;

    if (item.key !== 'leads') {
      return children ? { ...item, children } : item;
    }

    return {
      ...item,
      children: mergeUniqueByUrl(buildEventLeadMenuItems(events), children || []),
    };
  });

const isAllowed = (item, accessType) =>
  !item.roles || item.roles.includes(accessType);

const filterMenuItem = (item, user, inheritedPermissions = []) => {
  const effectivePermissions = item.permissions || inheritedPermissions;
  const children = (item.children || [])
    .map((child) => filterMenuItem(child, user, effectivePermissions))
    .filter(Boolean);
  const hasPermissionRule = effectivePermissions.length > 0;
  const roleAllowed = item.strictRoles
    ? item.strictRoles.includes(user.accessType)
    : hasPermissionRule || isAllowed(item, user.accessType);
  const permissionAllowed = hasAnyPermission(user, effectivePermissions);

  if (children.length > 0) return { ...item, children };
  if (roleAllowed && permissionAllowed) return { ...item, children: undefined };
  return null;
};

export const getMenuItems = (userOrAccessType, events = []) => {
  const user = typeof userOrAccessType === 'string' ? { accessType: userOrAccessType } : userOrAccessType;
  const menuItems = withDynamicEventLeads(MENU_ITEMS, events);
  if (!user?.accessType) return menuItems;

  return menuItems.map((item) => filterMenuItem(item, user)).filter(Boolean);
};
export const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);
  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
};
export const getMenuItemFromURL = (items, url) => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url);
      if (foundItem) {
        return foundItem;
      }
    }
  } else {
    if (items.url == url) return items;
    if (items.children != null) {
      for (const item of items.children) {
        const foundItem = getMenuItemFromURL(item, url);
        if (foundItem) return foundItem;
      }
    }
  }
};
export const findMenuItem = (menuItems, menuItemKey) => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item;
      }
      const found = findMenuItem(item.children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};
