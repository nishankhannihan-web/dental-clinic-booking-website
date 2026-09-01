import React, { useState } from 'react';
import { 
  Stethoscope, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Clock, 
  DollarSign, 
  ToggleLeft, 
  ToggleRight, 
  AlertCircle, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import type { Service } from '../../types/database';

export const AdminServices: React.FC = () => {
  const { services, addService, updateService, toggleServiceStatus } = useClinic();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [price, setPrice] = useState<number>(100);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setDurationMinutes(30);
    setPrice(120);
    setIsActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description || '');
    setDurationMinutes(service.duration_minutes || 30);
    setPrice(Number(service.price) || 0);
    setIsActive(service.is_active);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please provide a service name.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    const payload = {
      name: name.trim(),
      description: description.trim() ? description.trim() : null,
      duration_minutes: Number(durationMinutes) || 30,
      price: Number(price) || 0,
      is_active: isActive,
    };

    let result;
    if (editingService) {
      result = await updateService(editingService.id, payload);
    } else {
      result = await addService(payload);
    }

    setIsSaving(false);

    if (result.success) {
      setModalOpen(false);
    } else {
      setFormError(result.error || 'Failed to save service.');
    }
  };

  const handleToggle = async (service: Service) => {
    await toggleServiceStatus(service.id, !service.is_active);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Dental Treatments & Services</h2>
          <p className="text-xs text-slate-500">
            Manage practice services, durations, pricing, and online booking availability.
          </p>
        </div>

        <button
          id="add-new-service-btn"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-all shrink-0 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                <th className="py-3.5 px-4 sm:px-6">Service Name & Description</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Name & Desc */}
                  <td className="py-4 px-4 sm:px-6 max-w-sm">
                    <div className="font-bold text-slate-900 text-sm">{srv.name}</div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {srv.description || 'No description provided.'}
                    </p>
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5 font-medium text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{srv.duration_minutes} mins</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900 text-sm">
                      ${Number(srv.price).toFixed(2)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(srv)}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        srv.is_active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                      title={srv.is_active ? 'Click to deactivate' : 'Click to activate'}
                    >
                      <span className={`w-2 h-2 rounded-full ${srv.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{srv.is_active ? 'Active (Public)' : 'Inactive (Hidden)'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleToggle(srv)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                          srv.is_active 
                            ? 'text-amber-700 hover:bg-amber-50' 
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {srv.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 text-left">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingService ? 'Edit Dental Service' : 'Add New Dental Service'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure service details for online patient booking</p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="service-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ultrasonic Dental Cleaning"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Description
                </label>
                <textarea
                  id="service-desc-input"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the clinical procedures and benefits included..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Duration (Minutes)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="service-duration-input"
                      type="number"
                      min={10}
                      max={240}
                      step={5}
                      required
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 30)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Price ($ USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="service-price-input"
                      type="number"
                      min={0}
                      step={1}
                      required
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Active (Visible on public booking website)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Uncheck to temporarily hide from patients without deleting appointment records.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  id="save-service-submit-btn"
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
