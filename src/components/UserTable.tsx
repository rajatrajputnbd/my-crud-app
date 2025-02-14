import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface UserTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg px-2 md:px-4 py-4">
      <div className="overflow-x-auto max-w-full">
        <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2 md:p-3 border whitespace-nowrap min-w-[50px]">
                S. No.
              </th>
              <th className="p-2 md:p-3 border whitespace-nowrap min-w-[120px]">
                Name
              </th>
              <th className="p-2 md:p-3 border whitespace-nowrap min-w-[200px]">
                Email
              </th>
              <th className="p-2 md:p-3 border text-center whitespace-nowrap min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="border">
                  <td className="p-2 md:p-3 whitespace-nowrap">{index + 1}</td>
                  <td className="p-2 md:p-3 whitespace-nowrap">{user.name}</td>
                  <td className="p-2 md:p-3 whitespace-nowrap">{user.email}</td>
                  <td className="p-2 md:p-3 text-center flex gap-2 justify-center">
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => onEdit(user)}
                    >
                      <FaEdit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => onDelete(user)}
                    >
                      <FaTrash size={16} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
