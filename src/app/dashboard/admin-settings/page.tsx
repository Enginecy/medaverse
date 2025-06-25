import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourcesTable } from "@/features/dashboard/admin-settings/components/tables/resources-table";
import { PermissionsTable } from "@/features/dashboard/admin-settings/components/tables/permissions-table";
import { RolesTable } from "@/features/dashboard/admin-settings/components/tables/roles-table";
import { UserRolesTable } from "@/features/dashboard/admin-settings/components/tables/user-roles-table";
import { UserPermissionsTable } from "@/features/dashboard/admin-settings/components/tables/user-permissions-table";
import { Shield, Users, Lock, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Admin Settings</h1>

      <Tabs defaultValue="resources" className="flex-1">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResourcesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                System Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PermissionsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                User Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RolesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserRolesTable />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  User Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserPermissionsTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
