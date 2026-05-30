"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  country: string;
  email_verified: boolean;
  status: string;
  created_at: string;
}

async function fetchUsers(search: string, status: string): Promise<User[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  const res = await fetch(`/api/admin/users?${params}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

async function patchUser(body: Record<string, unknown>): Promise<void> {
  const res = await fetch("/api/admin/users", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["admin", "users", search, statusFilter],
    queryFn: () => fetchUsers(search, statusFilter),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ userId, verified }: { userId: number; verified: boolean }) =>
      patchUser({ userId, email_verified: !verified }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: string }) =>
      patchUser({ userId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-3">
        <AlertCircle size={32} />
        <p className="text-sm font-medium">Failed to load users</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "users"] })}
          className="text-xs px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users?.length ?? 0} registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Country</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Verified</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{user.name?.charAt(0).toUpperCase() ?? "?"}</span>
                      </div>
                      <span className="font-medium text-sm text-navy">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.email}</td>
                  <td className="p-4 text-sm text-gray-600">{user.country || "—"}</td>
                  <td className="p-4">
                    {user.email_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                        <XCircle size={12} /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      user.status === "active" ? "text-green-600 bg-green-50" :
                      user.status === "suspended" ? "text-red-600 bg-red-50" :
                      "text-gray-600 bg-gray-50"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => verifyMutation.mutate({ userId: user.id, verified: user.email_verified })}
                        disabled={verifyMutation.isPending}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                      >
                        {user.email_verified ? "Unverify" : "Verify"}
                      </button>
                      <button
                        onClick={() => statusMutation.mutate({ userId: user.id, status: user.status === "active" ? "suspended" : "active" })}
                        disabled={statusMutation.isPending}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                          user.status === "suspended"
                            ? "border-green-500/30 text-green-600 hover:bg-green-50"
                            : "border-red-500/30 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {user.status === "suspended" ? "Activate" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
