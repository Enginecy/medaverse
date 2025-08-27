import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourcesTable } from "@/features/dashboard/admin-settings/components/tables/resources-table";
import { PermissionsTable } from "@/features/dashboard/admin-settings/components/tables/permissions-table";
import { RolesTable } from "@/features/dashboard/admin-settings/components/tables/roles-table";
import { UserRolesTable } from "@/features/dashboard/admin-settings/components/tables/user-roles-table";
import { UserPermissionsTable } from "@/features/dashboard/admin-settings/components/tables/user-permissions-table";
import { Shield, Users, Lock, Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
title: "Admin Settings - Dashboard",
description: "Manage system resources, permissions, roles, and user access.",
};
export default function AdminSettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      <h1 className="text-xl md:text-2xl font-bold">Admin Settings</h1>

      <Tabs defaultValue="resources" className="flex-1">
        <TabsList className="grid w-full max-w-none md:max-w-2xl grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="resources" className="flex items-center gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
            <Settings className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Resources</span>
            <span className="sm:hidden">Res</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
            <Lock className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Permissions</span>
            <span className="sm:hidden">Perm</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
            <Shield className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Roles</span>
            <span className="sm:hidden">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1 md:gap-2 min-h-[44px] text-xs md:text-sm">
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">User Access</span>
            <span className="sm:hidden">Users</span>
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
          <div className="flex flex-col gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  User Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <UserRolesTable />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Lock className="h-4 w-4 md:h-5 md:w-5" />
                  User Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <UserPermissionsTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
