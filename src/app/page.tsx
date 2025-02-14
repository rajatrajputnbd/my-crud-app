"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import UpdateUserForm from "@/components/UpdateUserForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import UserTable from "@/components/UserTable";
import Footer from "@/components/Footer";
import toast, { Toaster } from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Error fetching users");
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async (user: any) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to add user");
      }
  
      fetchUsers();
      toast.success("User added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add user");
      console.error("Error adding user:", error);
      throw error;
    }
  };  

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }
  
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setConfirmDelete(null);
      toast.success(data.message || "User deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };  

  const handleEdit = (user: any) => {
    setEditingUser(null);
    setTimeout(() => setEditingUser(user), 0);
  };  

  const handleUpdateUser = async (updatedUser: any) => {
    try {
      const response = await fetch(`/api/users/${updatedUser._id}`, {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }
  
      fetchUsers();
      setEditingUser(null);
      toast.success("User updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Logout failed");

      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-4 flex items-center">
        <h1 className="text-2xl font-bold text-gray-800 ml-4 lg:ml-40">User Management</h1>

        <button
          className="ml-auto flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
          onClick={logout}
        >
          <FaSignOutAlt size={16} />
          <span>Logout</span>
        </button>
      </nav>

      <div className="px-2 sm:px-4 p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 p-1">
          {editingUser ? (
            <UpdateUserForm
              user={editingUser}
              onUpdate={handleUpdateUser}
              onCancel={() => setEditingUser(null)}
            />
          ) : (
            <UserForm onSubmit={addUser} />
          )}
        </div>

        <UserTable users={users} onEdit={handleEdit} onDelete={setConfirmDelete} />
      </div>

      <Footer />

      {confirmDelete && <DeleteConfirmation user={confirmDelete} onConfirm={() => deleteUser(confirmDelete._id)} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
}
