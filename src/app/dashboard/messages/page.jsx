"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaEnvelope, FaCheck, FaTrash, FaEye } from "react-icons/fa";
import { Tooltip, IconButton, CircularProgress, Dialog, DialogContent, DialogTitle } from "@mui/material";
import api from "@/features/api";

const MessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch messages from the server
  const fetchMessages = async () => {
    try {
      const response = await api().get("/messages");
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  // Mark a message as read
  const handleMarkAsRead = async (id) => {
    try {
      await api().patch(`/messages/${id}`, { read: true });
      toast.success("Message marked as read");
      fetchMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Failed to mark message as read");
    }
  };

  // Delete a message
  const handleDeleteMessage = async (id) => {
    try {
      await api().delete(`/messages/${id}`);
      toast.success("Message deleted successfully");
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  // View a message
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-sm">
        <div className="p-3 bg-[#0b3c5d] rounded-lg text-white">
          <FaEnvelope className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Management</h1>
          <p className="text-gray-600">{messages?.length || 0} total messages</p>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <CircularProgress style={{ color: "#0b3c5d" }} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gradient-to-r from-[#0b3c5d] to-[#235789] text-white font-semibold">
            <div>Name</div>
            <div>Email</div>
            <div>Message</div>
            <div>Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <div key={message._id} className={`grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${message.read ? "opacity-50" : ""}`}>
                {/* Name */}
                <div className="font-medium text-gray-900">{message.name}</div>
                
                {/* Email */}
                <div className="text-gray-600">{message.email}</div>
                
                {/* Message */}
                <div className="text-gray-600">{message.message.length > 50 ? `${message.message.substring(0, 50)}...` : message.message}</div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <Tooltip title="View Message">
                    <IconButton
                      onClick={() => handleViewMessage(message)}
                      className="text-[#0b3c5d] hover:bg-[#0b3c5d]/10"
                    >
                      <FaEye />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Mark as Read">
                    <span>
                      <IconButton
                        onClick={() => handleMarkAsRead(message._id)}
                        className="text-[#235789] hover:bg-[#235789]/10"
                        disabled={message.read}
                      >
                        <FaCheck />
                      </IconButton>
                    </span>
                  </Tooltip>
                  
                  <Tooltip title="Delete Message">
                    <IconButton
                      onClick={() => handleDeleteMessage(message._id)}
                      className="text-red-600 hover:bg-[#ffcb05]/10"
                    >
                      <FaTrash />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {messages.length === 0 && !loading && (
            <div className="p-6 text-center text-gray-600">
              <p>No messages found.</p>
            </div>
          )}
        </div>
      )}

      {/* Message Details Modal */}
      <Dialog open={showMessageModal} onClose={() => setShowMessageModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-gradient-to-r from-[#0b3c5d] to-[#235789] text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Message Details</h2>
          </div>
        </DialogTitle>

        <DialogContent className="p-6 space-y-6">
          {selectedMessage && (
            <div className="space-y-4 py-3">
              <div>
                <h3 className="text-lg font-semibold text-[#0b3c5d]">Name</h3>
                <p className="text-gray-700">{selectedMessage.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0b3c5d]">Email</h3>
                <p className="text-gray-700">{selectedMessage.email}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0b3c5d]">Message</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedMessage.message}</p>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowMessageModal(false)}
              className="px-5 py-2.5 bg-[#0b3c5d] text-white rounded-lg hover:bg-[#0b3c5d]/90 transition-all"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageManagement;