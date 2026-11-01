"use client";

import * as React from "react";
import { UserPlus, Trash2, Shield, Loader2, Eye, EyeOff, RefreshCw, Mail, Key, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  created_at: string;
}

interface RoleInfo {
  value: string;
  label: string;
  description: string;
}

const ROLES: RoleInfo[] = [
  {
    value: "ADMIN",
    label: "Admin (Full Access)",
    description: "Can manage everything: products, orders, customers, settings, AND create new users.",
  },
  {
    value: "MANAGER",
    label: "Manager (Limited Access)",
    description: "Can manage products, categories, orders, and blog posts. Cannot access settings or create users.",
  },
  {
    value: "STAFF",
    label: "Staff (Orders Only)",
    description: "Can only view and manage orders. No access to products, settings, or user management.",
  },
];

/**
 * AdminUserManager
 *
 * Self-contained component for the admin to:
 *  - View all admin/staff users
 *  - Create new users with email + password + role
 *  - Change an existing user's role (full access ↔ limited access)
 *  - Remove a user's admin access (demote to CUSTOMER)
 *
 * Fetches its own data from /api/admin/customers (which returns all profiles).
 * No parent prop wiring needed.
 */
export function AdminUserManager() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [newUser, setNewUser] = React.useState({
    email: "",
    name: "",
    password: "",
    role: "STAFF",
  });

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleCreate() {
    if (!newUser.email || !newUser.password || !newUser.name) {
      toast.error("Please fill all fields");
      return;
    }
    if (newUser.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`${newUser.name} added as ${newUser.role}`);
        setOpen(false);
        setNewUser({ email: "", name: "", password: "", role: "STAFF" });
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to create user");
      }
    } catch {
      toast.error("Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      const res = await fetch("/api/admin/update-user-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Role updated");
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to update role");
      }
    } catch {
      toast.error("Failed to update role");
    }
  }

  async function handleRemove(userId: string, email: string) {
    if (!confirm(`Remove admin access for ${email}? They will become a regular customer.`)) {
      return;
    }
    await handleRoleChange(userId, "CUSTOMER");
  }

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-700",
    ADMIN: "bg-purple-100 text-purple-700",
    MANAGER: "bg-blue-100 text-blue-700",
    STAFF: "bg-green-100 text-green-700",
    CUSTOMER: "bg-muted text-muted-foreground",
  };

  const adminUsers = users.filter((u) =>
    ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].includes(u.role)
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {adminUsers.length} admin/staff member{adminUsers.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Role legend */}
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        {ROLES.map((r) => (
          <div
            key={r.value}
            className="rounded-lg border border-border/60 bg-muted/30 p-3"
          >
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="secondary" className={roleColors[r.value]}>
                {r.label.split(" ")[0]}
              </Badge>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {r.description}
            </p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : adminUsers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <Shield className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">No admin users yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add staff members or admins to help manage products and orders.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {adminUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent-text">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name || "Unnamed"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-[10px] text-muted-foreground/70">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={user.role}
                  onValueChange={(v) => handleRoleChange(user.id, v)}
                  disabled={user.role === "SUPER_ADMIN"}
                >
                  <SelectTrigger size="sm" className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN" disabled>Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin (Full)</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="CUSTOMER">Remove Access</SelectItem>
                  </SelectContent>
                </Select>

                <Badge variant="secondary" className={roleColors[user.role]}>
                  {user.role.replace("_", " ")}
                </Badge>

                {user.role !== "SUPER_ADMIN" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => handleRemove(user.id, user.email)}
                    aria-label="Remove admin access"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create New User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">
                <UserPlus className="mr-1 inline h-3.5 w-3.5" />
                Full Name *
              </Label>
              <Input
                id="new-name"
                placeholder="e.g. Mahmud Hasan"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">
                <Mail className="mr-1 inline h-3.5 w-3.5" />
                Login Email *
              </Label>
              <Input
                id="new-email"
                type="email"
                placeholder="staff@alrakib.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This email will be used to log in to the admin dashboard.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">
                <Key className="mr-1 inline h-3.5 w-3.5" />
                Temporary Password *
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                The user can change this password after first login via Settings → Change Password.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Access Level *</Label>
              <Select
                value={newUser.role}
                onValueChange={(v) => setNewUser({ ...newUser, role: v })}
              >
                <SelectTrigger id="new-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="rounded-md bg-muted/40 p-2">
                <p className="text-xs text-muted-foreground">
                  {ROLES.find((r) => r.value === newUser.role)?.description}
                </p>
              </div>
              <div className="flex items-start gap-1.5 rounded-md bg-amber-50 p-2 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p className="text-xs">
                  Super Admin cannot be created here. Only an existing Super Admin can promote users to Super Admin.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
