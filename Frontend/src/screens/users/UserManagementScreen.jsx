import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, Search, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { useOutletContext } from "react-router-dom";
import ManageUserTableRow from "./components/ManageUserTableRow";
import { SERVER_URL } from "../../router";

const SkeletonRow = () => (
  <tr className="border-b border-white/[0.06]">
    {[40, 64, 24, 24].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div className={`skeleton h-3 rounded-full w-${w}`} />
      </td>
    ))}
  </tr>
);

function UserManagementScreen() {
  const [data, user] = useOutletContext();
  const [isLoading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    getDataFromApi();
  }, [currentPage, itemsPerPage, searchTerm, roleFilter]);

  async function getDataFromApi() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${SERVER_URL}/api/v1/users/all`, {
        withCredentials: true,
        params: {
          page: currentPage,
          itemsPerPage,
          search: searchTerm,
          role: roleFilter,
        },
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePrevPage() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  function handleNextPage() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={22} className="text-brand-400" />
            User Management
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Modify user privileges and roles
          </p>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <ShowErrorMessage
          message={error}
          children={
            <span
              className="underline cursor-pointer hover:text-red-300 transition-colors"
              onClick={getDataFromApi}
            >
              Retry
            </span>
          }
        />
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="flex flex-wrap gap-3 items-center"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            type="text"
            className="input-dark w-full pl-9 pr-3 py-2 text-sm"
            placeholder="Search users…"
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        {/* Role filter */}
        <div className="relative">
          <Shield
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <select
            className="input-dark pl-9 pr-8 py-2 text-sm appearance-none"
            value={roleFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setRoleFilter(e.target.value);
            }}
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="table-dark w-full">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Role
                </th>
                {user && user.role === "admin" && (
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(itemsPerPage > 6 ? 6 : itemsPerPage)
                  .fill(0)
                  .map((_, i) => <SkeletonRow key={i} />)
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={user?.role === "admin" ? 4 : 3}
                    className="px-5 py-14 text-center text-white/30 text-sm"
                  >
                    <Users size={28} className="mx-auto mb-2 opacity-30" />
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((_user) => (
                  <ManageUserTableRow
                    key={_user._id}
                    role={user.role}
                    user={_user}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-sm text-white/40">
            <input
              type="number"
              min={1}
              className="input-dark w-14 text-center py-1 px-2 text-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setCurrentPage(1);
                setItemsPerPage(Number(e.target.value));
              }}
            />
            <span>per page</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="btn-ghost py-1.5 px-3 text-sm flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} />
              Prev
            </button>

            <div className="flex items-center gap-1.5 text-sm text-white/50">
              <input
                type="number"
                min={1}
                max={totalPages}
                className="input-dark w-12 text-center py-1 px-1 text-sm"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
              />
              <span>/ {totalPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="btn-ghost py-1.5 px-3 text-sm flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default UserManagementScreen;
