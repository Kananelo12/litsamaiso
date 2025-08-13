/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CreditCard,
  // FileText,
  Download,
  Upload,
  Search,
  // Filter,
  // MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  role: { name: string };
  createdAt: string;
}

interface Account {
  _id: string;
  fullnames: string;
  contractNumber: string;
  courseOfStudy: string;
  bankName: string;
  accountNumber: string;
  studentId?: string;
  status: "pending" | "confirmed" | "erroneous";
  confirmationDate?: string;
  signature?: string;
  createdAt: string;
}

interface Role {
  _id: string;
  name: string;
}

export default function AdminDashboardClient({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const [activeTab, setActiveTab] = useState<
    "users" | "accounts" | "announcements"
  >("users");
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    confirmedAccounts: 0,
    pendingAccounts: 0,
    erroneousAccounts: 0,
  });

  useEffect(() => {
    fetchRoles();
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "accounts") {
      fetchAccounts();
    }
  }, [activeTab, searchTerm, statusFilter, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (roleFilter) params.append("role", roleFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.data);
        setStats((prev) => ({ ...prev, totalUsers: data.pagination.total }));
      } else {
        toast.error(data.error || "Failed to fetch users");
      }
    } catch (error) {
      toast.error(`Failed to fetch users: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/admin/accounts?${params}`);
      const data = await response.json();

      if (response.ok) {
        setAccounts(data.data);
        setStats((prev) => ({
          ...prev,
          totalAccounts: data.pagination.total,
          confirmedAccounts: data.statusCounts.confirmed || 0,
          pendingAccounts: data.statusCounts.pending || 0,
          erroneousAccounts: data.statusCounts.erroneous || 0,
        }));
      } else {
        toast.error(data.error || "Failed to fetch accounts");
      }
    } catch (error) {
      toast.error(`Failed to fetch accounts: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      const data = await response.json();

      if (response.ok) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error(`Failed to fetch roles: ${error}`);
    }
  };

  const updateUserRole = async (userId: string, roleId: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User role updated successfully");
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to update user role");
      }
    } catch (error) {
      toast.error(`Failed to update user role: ${error}`);
    }
  };

  const updateAccountStatus = async (accountId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/accounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, status }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account status updated successfully");
        fetchAccounts();
      } else {
        toast.error(data.error || "Failed to update account status");
      }
    } catch (error) {
      toast.error(`Failed to update account status: ${error}`);
    }
  };

  const exportData = async (
    type: "users" | "accounts",
    format: "xlsx" | "json" = "xlsx"
  ) => {
    try {
      const url = `/api/admin/export/${type}?format=${format}`;
      const response = await fetch(url);

      if (response.ok) {
        if (format === "json") {
          const data = await response.json();
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${type}_export_${
            new Date().toISOString().split("T")[0]
          }.json`;
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${type}_export_${
            new Date().toISOString().split("T")[0]
          }.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
        toast.success(`${type} exported successfully`);
      } else {
        toast.error(`Failed to export ${type}`);
      }
    } catch (error) {
      toast.error(`Failed to export ${type}`);
      console.log("Error: ", error);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const response = await fetch("/api/spreadsheet/import/accounts", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Successfully imported ${data.imported} records`);
        setShowImportModal(false);
        setImportFile(null);
        if (activeTab === "accounts") {
          fetchAccounts();
        }
      } else {
        toast.error(data.error || "Import failed");
      }
    } catch (error) {
      toast.error(`Import failed: ${error}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "erroneous":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "erroneous":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userName}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Accounts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAccounts}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.confirmedAccounts}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingAccounts}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Erroneous</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.erroneousAccounts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                User Management
              </button>
              <button
                onClick={() => setActiveTab("accounts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "accounts"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Account Records
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {activeTab === "users" && (
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              )}

              {activeTab === "accounts" && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="erroneous">Erroneous</option>
                </select>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    exportData(activeTab === "users" ? "users" : "accounts")
                  }
                  variant="outline"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>

                {activeTab === "accounts" && (
                  <Button
                    onClick={() => setShowImportModal(true)}
                    variant="outline"
                    size="lg"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                )}
              </div>
            </div>

            {/* Users Table */}
            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role?.name || ""}
                              onChange={(e) => {
                                const selectedRole = roles.find(
                                  (r) => r.name === e.target.value
                                );
                                if (selectedRole) {
                                  updateUserRole(user._id, selectedRole._id);
                                }
                              }}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              {roles.map((role) => (
                                <option key={role._id} value={role.name}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Accounts Table */}
            {activeTab === "accounts" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Names
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contract Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bank Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : accounts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No accounts found
                        </td>
                      </tr>
                    ) : (
                      accounts.map((account) => (
                        <tr key={account._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {account.fullnames}
                            </div>
                            <div className="text-sm text-gray-500">
                              {account.courseOfStudy}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {account.contractNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {account.bankName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {account.accountNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(account.status)}
                              <select
                                value={account.status}
                                onChange={(e) =>
                                  updateAccountStatus(
                                    account._id,
                                    e.target.value
                                  )
                                }
                                className={`ml-2 text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(
                                  account.status
                                )}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="erroneous">Erroneous</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {account.studentId || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Import Account Records
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Excel file
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={!importFile}>
                Import
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
