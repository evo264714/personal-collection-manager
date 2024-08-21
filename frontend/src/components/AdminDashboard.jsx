import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FaUserEdit, FaTrash, FaBan, FaUnlock } from "react-icons/fa";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const { currentUser, logout } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!currentUser?.token) return;

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Swal.fire(
            t("unauthorized"),
            t("not_authorized_access_resource"),
            "error"
          );
          logout();
          window.location.href = "/login";
        } else {
          Swal.fire(t("error"), t("failed_to_fetch_users"), "error");
        }
      }
    };

    fetchUsers();
  }, [currentUser, logout, t]);

  const handleRoleChange = async (id, role) => {
    try {
      await axios.put(
        `/api/admin/users/${id}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      if (id === currentUser.uid && role === "user") {
        Swal.fire({
          icon: "success",
          title: t("role_changed"),
          text: t("demoted_to_user"),
        }).then(() => {
          logout();
          window.location.href = "/login";
        });
      } else {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === id ? { ...user, role } : user))
        );
        Swal.fire("Success", t("user_role_updated"), "success");
      }
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_update_role"), "error");
    }
  };

  const handleStatusToggle = async (id, isActive) => {
    try {
      await axios.put(
        `/api/admin/users/${id}/status`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isActive } : user
        )
      );
      Swal.fire(
        "Success",
        t("user_status_updated", {
          isActive: isActive ? t("unblocked") : t("blocked"),
        }),
        "success"
      );
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_update_status"), "error");
    }
  };

  const handleRemoveAdmin = async (uid) => {
    try {
      await axios.put(
        `/api/admin/users/${uid}/remove-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      if (uid === currentUser.uid) {
        Swal.fire({
          icon: "success",
          title: t("admin_privileges_removed"),
          text: t("admin_no_longer"),
          timer: 6000,
          showConfirmButton: true,
        }).then(() => {
          logout();
        });
      } else {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.uid === uid ? { ...user, role: "user" } : user
          )
        );
        Swal.fire("Success", t("admin_privileges_removed"), "success");
      }
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_remove_admin_privileges"), "error");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      } p-6`}
    >
      <h2
        className={`text-4xl font-bold text-center mb-8 ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        {t("admin_dashboard")}
      </h2>
      <div className="overflow-x-auto">
        <table
          className={`min-w-full ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          } shadow-lg rounded-lg overflow-hidden`}
        >
          <thead
            className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
          >
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("email")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("role")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody
            className={`${
              theme === "dark"
                ? "bg-gray-800 divide-gray-700"
                : "bg-white divide-gray-200"
            } divide-y`}
          >
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? t("active") : t("blocked")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-between">
                  <button
                    onClick={() =>
                      handleRoleChange(
                        user._id,
                        user.role === "admin" ? "user" : "admin"
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center justify-center transition duration-300"
                  >
                    <FaUserEdit />
                    <span className="ml-2">
                      {user.role === "admin" ? t("demote") : t("promote")}
                    </span>
                  </button>
                  <button
                    onClick={() => handleStatusToggle(user._id, !user.isActive)}
                    className={`${
                      user.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white px-3 py-1 rounded-lg flex items-center justify-center transition duration-300`}
                  >
                    {user.isActive ? <FaBan /> : <FaUnlock />}
                    <span className="ml-2">
                      {user.isActive ? t("block") : t("unblock")}
                    </span>
                  </button>
                  <button
                    onClick={() => handleRemoveAdmin(user.uid)}
                    className="bg-gray-500 hover:bg-black text-white px-3 py-1 rounded-lg flex items-center justify-center transition duration-300"
                  >
                    <FaTrash />
                    <span className="ml-2">{t("remove_admin")}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
