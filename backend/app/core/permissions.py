ROLE_PERMISSIONS: dict[str, set[str]] = {
    "citizen": {"report:create", "report:read_own", "alert:read"},
    "officer": {"report:read_assigned", "report:verify", "incident:update", "alert:read"},
    "researcher": {"dataset:read", "research:create", "alert:read"},
    "ngo": {"project:manage", "volunteer:manage", "alert:read"},
    "super_admin": {"*"},
}


def has_permission(roles: list[str], permission: str) -> bool:
    for r in roles:
        perms = ROLE_PERMISSIONS.get(r, set())
        if "*" in perms or permission in perms:
            return True
    return False
