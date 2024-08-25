import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  FaUserPlus,
  FaTrash,
  FaLock,
  FaUnlock,
  FaUserMinus,
} from "react-icons/fa";
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

  const handleMakeAdmin = async (id) => {
    try {
      const response = await axios.put(
        `/api/admin/users/${id}/role`,
        { role: "admin" },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire("Success", t("user_promoted_to_admin"), "success").then(
          () => {
            window.location.reload(); // Reload the page
          }
        );
      }
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_promote_user"), "error");
    }
  };

  const handleRemoveAdmin = async (id) => {
    try {
      const response = await axios.put(
        `/api/admin/users/${id}/role`,
        { role: "user" },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      if (response.status === 200) {
        if (id === currentUser.uid) {
          Swal.fire({
            icon: "success",
            title: t("admin_privileges_removed"),
            text: t("admin_no_longer"),
            timer: 4000,
            showConfirmButton: true,
          }).then(async () => {
            await logout(); 
          });
        } else {
          Swal.fire("Success", t("admin_privileges_removed"), "success").then(
            () => {
              window.location.reload(); 
            }
          );
        }
      }
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_remove_admin_privileges"), "error");
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
      Swal.fire(
        "Success",
        t("user_status_updated", {
          isActive: isActive ? t("unblocked") : t("blocked"),
        }),
        "success"
      ).then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_update_status"), "error");
    }
  };

  const handleDeleteUser = async (id) => {
    console.log("Deleting user with ID:", id);
    Swal.fire({
      title: t("are_you_sure"),
      text: t("this_action_cannot_be_undone"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("yes_delete_it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/admin/users/${id}`, {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          });
          Swal.fire(t("deleted"), t("user_has_been_deleted"), "success").then(
            () => {
              window.location.reload();
            }
          );
        } catch (error) {
          Swal.fire(t("error"), t("failed_to_delete_user"), "error");
        }
      }
    });
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex justify-around space-x-4">
                    {user.role === "user" ? (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center justify-center transition duration-300"
                      >
                        <FaUserPlus />
                        <span className="ml-2">{t("make_admin")}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRemoveAdmin(user._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center transition duration-300"
                        >
                          <FaUserMinus />
                          <span className="ml-2">{t("remove_admin")}</span>
                        </button>
                        {user._id === currentUser.uid && (
                          <button
                            onClick={() => handleRemoveAdmin(user._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center transition duration-300"
                          >
                            <FaTrash />
                            <span className="ml-2">
                              {t("remove_admin_privilege")}
                            </span>
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() =>
                        handleStatusToggle(user._id, !user.isActive)
                      }
                      className={`${
                        user.isActive
                          ? "bg-orange-500 hover:bg-orange-700"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white px-3 py-2 rounded-lg flex items-center justify-center transition duration-300`}
                    >
                      {user.isActive ? <FaLock /> : <FaUnlock />}
                      <span className="ml-2">
                        {user.isActive ? t("block") : t("unblock")}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-800 text-white px-3 py-2 rounded-lg flex items-center justify-center transition duration-300"
                    >
                      <FaTrash />

                      <span className="ml-2">{t("delete")}</span>
                    </button>
                  </div>
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
