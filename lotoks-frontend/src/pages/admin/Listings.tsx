import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAdminAuth } from "@/store/adminAuth";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Globe, 
  Users, 
  List, 
  Clock, 
  CheckCircle, 
  X, 
  AlertTriangle,
  Info,
  Loader2,
  Check,
  Settings,
  Trash2,
  MessageSquare,
  DollarSign,
  MapPin,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/shared/Modal";

interface Listing {
  id: number;
  title: string;
  country: string;
  sponsorshipType: string;
  salaryRange: string;
  requirements: string;
  active: boolean;
  applicants?: number;
  createdAt?: string;
}

export function AdminListingsPage() {
  const { admin } = useAdminAuth();
  const [filters, setFilters] = useState({
    type: "",
    country: "",
    active: ""
  });
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    sponsorshipType: "",
    salaryRange: "",
    requirements: "",
    active: false
  });

  const { data: listings, isLoading, error, refetch } = useQuery({
    queryKey: ["adminListings", filters],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (filters.type) query.set("type", filters.type);
      if (filters.country) query.set("country", filters.country);
      if (filters.active) query.set("active", filters.active);
      const response = await apiFetch(`/admin/listings?${query.toString()}`);
      return response.json();
    }
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({
      title: "",
      description: "",
      country: "",
      sponsorshipType: "",
      salaryRange: "",
      requirements: "",
      active: false
    });
    setModalIsOpen(true);
  };

  const handleOpenEditModal = (listing: Listing) => {
    setSelectedListing(listing);
    setModalMode('edit');
    setFormData({
      title: listing.title || "",
      description: listing.requirements || "",
      country: listing.country || "",
      sponsorshipType: listing.sponsorshipType || "",
      salaryRange: listing.salaryRange || "",
      requirements: listing.requirements || "",
      active: listing.active || false
    });
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
    setModalIsOpen(false);
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response: Response | undefined;
      if (modalMode === 'create') {
        response = await apiFetch("/admin/listings", {
          method: "POST",
          body: JSON.stringify(formData)
        });
      } else if (modalMode === 'edit' && selectedListing) {
        response = await apiFetch(`/admin/listings/${(selectedListing as Listing).id}`, {
          method: "PUT",
          body: JSON.stringify(formData)
        });
      }
      if (response && response.ok) {
        refetch();
        handleCloseModal();
      } else if (response) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to save listing");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save listing. Please try again.");
    }
  };

  const handleDelete = async (listingId: number) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const response = await apiFetch(`/admin/listings/${listingId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        refetch();
      } else {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to delete listing");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[20vh]"
      >
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700"
      >
        <AlertTriangle className="w-5 h-5 mr-2" /> Failed to load listings.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-navy/50"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-heading font-bold text-white">
              Manage Listings
            </h1>
            <Button variant="secondary" size="sm" onClick={handleOpenCreateModal}>
              Add New Listing
            </Button>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Type
              </label>
              <Select
                value={filters.type}
                onValueChange={value => handleFilterChange("type", value)}
                options={[
                  { label: "All Types", value: "" },
                  { label: "Visa Sponsorship", value: "visa" },
                  { label: "Education Scholarship", value: "education" },
                  { label: "Job Placement", value: "job" },
                  { label: "Permanent Residence", value: "residence" }
                ]}
                placeholder="Filter by type"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Country
              </label>
              <Input
                value={filters.country}
                onChange={(e) => handleFilterChange("country", e.target.value)}
                placeholder="Filter by country"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Active Status
              </label>
              <Select
                value={filters.active}
                onValueChange={value => handleFilterChange("active", value)}
                options={[
                  { label: "All", value: "" },
                  { label: "Active", value: "true" },
                  { label: "Inactive", value: "false" }
                ]}
                placeholder="Filter by active status"
              />
            </div>
          </div>
          
          {/* Listings Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
              <thead>
                <tr className="bg-navy/20">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Salary Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Requirements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {listings && listings.length > 0 ? (
                  listings.map((listing: Listing) => (
                    <tr key={listing.id} className="border-t border-white/5 hover:bg-white/10">
                      <td className="px-6 py-4 text-white">
                        {listing.title}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {listing.country}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {listing.sponsorshipType}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {listing.salaryRange || "Not specified"}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {listing.requirements || "Not specified"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${listing.active ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                          {listing.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEditModal(listing)}
                        >
                          Edit
                        </Button>
                        <button
                          className="px-3 py-1.5 rounded-md border border-red/40 text-red/80 hover:bg-red/10 hover:text-red text-sm font-medium transition-all"
                          onClick={() => handleDelete(listing.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-white/50">
                      No listings match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Modal */}
          <Modal
            isOpen={modalIsOpen}
            onClose={handleCloseModal}
          >
            <div className="space-y-4">
              {modalMode === 'create' ? (
                <h2 className="text-xl font-heading font-bold text-white">
                  Create New Listing
                </h2>
              ) : (
                <h2 className="text-xl font-heading font-bold text-white">
                  Edit Listing
                </h2>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="Enter title"
                    className="w-full"
                    disabled={false}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Description
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Enter description"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Country
                  </label>
                  <Input
                    value={formData.country}
                    onChange={(e) => handleFormChange("country", e.target.value)}
                    placeholder="Enter country"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Sponsorship Type
                  </label>
                  <Input
                    value={formData.sponsorshipType}
                    onChange={(e) => handleFormChange("sponsorshipType", e.target.value)}
                    placeholder="Enter sponsorship type (e.g., Visa, Job, Education)"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Salary Range (optional)
                  </label>
                  <Input
                    value={formData.salaryRange}
                    onChange={(e) => handleFormChange("salaryRange", e.target.value)}
                    placeholder="Enter salary range (e.g., $50,000 - $70,000)"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Requirements (optional)
                  </label>
                  <Input
                    value={formData.requirements}
                    onChange={(e) => handleFormChange("requirements", e.target.value)}
                    placeholder="Enter requirements (e.g., Bachelor's degree, 2 years experience)"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => handleFormChange("active", e.target.checked)}
                    className="h-4 w-4 text-gold focus:ring-gold border-white/30 rounded"
                  />
                  <label className="text-white/60 text-sm">
                    Active
                  </label>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {modalMode === 'create' ? "Create Listing" : "Update Listing"}
                </Button>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </motion.div>
  );
}