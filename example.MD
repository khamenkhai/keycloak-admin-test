To build a dynamic, scalable CRUD system for your 3 modules (Sale, Report, and Manager) using Keycloak's Authorization Services, the "exact" number of entities depends on how you group them.

Following the **Best Practice (DRY - Don't Repeat Yourself)** approach, here is the exact breakdown:

### 1. Scopes (The Actions)

**Total: 4**
Instead of creating `create-sale`, `create-report`, etc., you create **Global Scopes**. This allows you to reuse the same "Action" definition across every module you ever build.

- `scope:create`
- `scope:read`
- `scope:update`
- `scope:delete`

### 2. Resources (The "Things")

**Total: 3**
Each module is a unique resource. When you create these, you "attach" the 4 global scopes to each one.

- `res:sale-module` (Attached Scopes: create, read, update, delete)
- `res:report-module` (Attached Scopes: create, read, update, delete)
- `res:manager-module` (Attached Scopes: create, read, update, delete)

### 3. Policies (The "Who")

**Total: 3**
Policies represent your User Roles. They are "Logic Containers" that check if a user has a specific role.

- **Policy A:** `role:admin-policy` (Checks for `admin` role)
- **Policy B:** `role:manager-policy` (Checks for `manager` role)
- **Policy C:** `role:cashier-policy` (Checks for `cashier` role)

---

### 4. Permissions (The "Rules")

**Total: 3 (Resource-Based)**
Instead of 12 individual permissions, you create **one Permission per Resource**. Inside that permission, you map which **Scope** is allowed for which **Policy**.

| Permission Name        | Resource             | Scope                        | Associated Policies     |
| :--------------------- | :------------------- | :--------------------------- | :---------------------- |
| **Sale Permission**    | `res:sale-module`    | `read`, `create`             | Admin, Manager, Cashier |
|                        |                      | `update`, `delete`           | Admin, Manager          |
| **Report Permission**  | `res:report-module`  | `read`                       | Admin, Manager, Cashier |
|                        |                      | `create`, `update`, `delete` | Admin Only              |
| **Manager Permission** | `res:manager-module` | `ALL`                        | Admin Only              |

---

### The Final Tally

If you use the **Resource-Based Permission** strategy (grouping by module), your total "Object Count" in Keycloak for 3 modules is:

- **4** Scopes
- **3** Resources
- **3** Policies
- **3** Permissions
- **TOTAL: 13 Entities**

> **Note:** If you added a 4th module (e.g., `Inventory`), you would only need to add **1** new Resource and **1** new Permission. The Scopes and Policies stay the same!

### Why this is better than "12 Permissions"

If you did "Scope-Based Permissions" (e.g., a unique permission for _Sale-Create_, _Sale-Read_, etc.), you would indeed have 12 permissions.

**By grouping by Resource:**

1.  **Cleaner UI:** In the Keycloak admin console, you only see 3 permissions to manage.
2.  **Dynamic Control:** Your `PermissionsController` can simply update the `policies` array inside the `Sale Permission` to instantly change who can "Update" a sale across the whole system.

### Implementation Tip

In your `assignToRole` method in the `PermissionsController`, you are currently creating a "Policy wrapper" for every role. To keep it "Exact" as listed above, you should:

1.  Check if a `role:admin-policy` already exists.
2.  If it does, just link it to the new `Resource Permission` you are creating.

Does this "13 entity" structure make sense for the Retail POS system you are architecting?
