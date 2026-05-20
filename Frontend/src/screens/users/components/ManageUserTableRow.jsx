import axios from "axios";
import React, { useState } from "react";
import { SERVER_URL } from "../../../router";
import { Shield, ShieldOff } from "lucide-react";

function ManageUserTableRow({ user, role }) {
  const [userRole, setUserRole] = useState(user.role);
  const [isLoading, setLoading] = useState(false);

  async function changeRoleAPicall() {
    try {
      setLoading(true);
      await axios.patch(
        `${SERVER_URL}/api/v1/users/change-role`,
        {
          targetUserId: user._id,
          role: userRole === "user" ? "admin" : "user",
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUserRole((s) => (s === "admin" ? "user" : "admin"));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function changeRole() {
    await changeRoleAPicall();
  }

  const isAdmin = userRole === "admin";

  return (
    <tr className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
      {/* Name */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
          >
            {user.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-medium text-white/80 truncate">{user.name}</span>
        </div>
      </td>

      {/* Email */}
      <td className="px-5 py-4">
        <span className="text-sm text-white/50 truncate">{user.email}</span>
      </td>

      {/* Role badge */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
            isLoading ? "animate-pulse opacity-60" : ""
          } ${
            isAdmin
              ? "badge-purple"
              : "badge-green"
          }`}
        >
          {isAdmin ? <Shield size={11} /> : <ShieldOff size={11} />}
          {userRole}
        </span>
      </td>

      {/* Actions — admin only */}
      {user && role === "admin" && (
        <td className="px-5 py-4">
          <button
            onClick={changeRole}
            disabled={isLoading}
            className="btn-ghost py-1.5 px-3 text-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div
                className="w-3.5 h-3.5 rounded-full animate-spin"
                style={{
                  border: "1.5px solid rgba(139,92,246,0.2)",
                  borderTopColor: "#a78bfa",
                }}
              />
            ) : isAdmin ? (
              <ShieldOff size={13} />
            ) : (
              <Shield size={13} />
            )}
            Make {isAdmin ? "user" : "admin"}
          </button>
        </td>
      )}
    </tr>
  );
}

export default ManageUserTableRow;
