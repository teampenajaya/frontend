import React, { useState } from "react";

const DirectComplaintForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gameId: "",
    platform: "PENASLOT",
    issueType: "",
    description: "",
    dateOfIssue: "",
    phoneNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);

  const issueTypes = ["Deposit/Penarikan Bermasalah", "Kerusakan Game", "Masalah Akses Akun", "Masalah Bonus/Promosi", "Kesalahan Proses Pembayaran", "Logout Tiba-tiba", "Masalah Pembayaran Jackpot", "Lainnya"];

  // Validasi form
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.length < 3 || formData.username.length > 50) {
      newErrors.username = "Username harus antara 3-50 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username hanya boleh mengandung huruf, angka, dan underscore";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email terlalu panjang (maksimal 100 karakter)";
    }

    // Game ID validation (optional)
    if (formData.gameId && (!/^[a-zA-Z0-9-_]+$/.test(formData.gameId) || formData.gameId.length > 50)) {
      newErrors.gameId = "ID Game tidak valid, hanya huruf, angka, tanda hubung dan underscore";
    }

    // Issue type validation
    if (!formData.issueType) {
      newErrors.issueType = "Jenis masalah wajib dipilih";
    } else if (!issueTypes.includes(formData.issueType)) {
      newErrors.issueType = "Jenis masalah tidak valid";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Deskripsi terlalu panjang (maksimal 2000 karakter)";
    }

    // Date validation
    if (!formData.dateOfIssue) {
      newErrors.dateOfIssue = "Tanggal masalah wajib diisi";
    } else {
      const selectedDate = new Date(formData.dateOfIssue);
      const today = new Date();
      if (isNaN(selectedDate.getTime())) {
        newErrors.dateOfIssue = "Tanggal tidak valid";
      } else if (selectedDate > today) {
        newErrors.dateOfIssue = "Tanggal tidak boleh di masa depan";
      }
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor telepon wajib diisi";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Nomor telepon tidak valid (10-15 digit)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset server errors when user makes changes
    if (serverErrors) {
      setServerErrors(null);
    }

    // Special handling for phone number to ensure it's numeric
    if (name === "phoneNumber") {
      // Allow only numbers and '+' at the beginning
      const sanitizedValue = value.replace(/[^0-9+]/g, "");
      // Ensure '+' only appears at the beginning
      const formattedValue = sanitizedValue.replace(/\+/g, (match, offset) => (offset === 0 ? match : ""));

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle submit form with CSRF protection
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setServerErrors(null);

      try {
        const response = await fetch(`https://backend-iql1.onrender.com/send-complaint`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add CSRF token if you implement it
            // "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify(formData),
          credentials: "include", // For cookies if needed
        });

        const result = await response.json();
        if (response.ok) {
          setReferenceNumber(result.referenceNumber);
          setIsSubmitted(true);
        } else {
          // Handle validation errors from server
          if (result.errors) {
            setErrors(result.errors);
          } else {
            throw new Error(result.message || "Gagal mengirim pengaduan");
          }
        }
      } catch (error) {
        setServerErrors("Terjadi kesalahan saat mengirim pengaduan. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      gameId: "",
      platform: "PENASLOT",
      issueType: "",
      description: "",
      dateOfIssue: "",
      phoneNumber: "",
    });
    setIsSubmitted(false);
    setReferenceNumber("");
    setErrors({});
    setServerErrors(null);
  };

  return (
    <div className="bg-[#0f1923] text-white min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-[#161d27] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Laporan Pengaduan Pelanggan</h1>

        {/* Display server errors if any */}
        {serverErrors && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
            <p>{serverErrors}</p>
          </div>
        )}

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-400 mb-2">Pengaduan Berhasil Dikirim!</h2>
            <p className="text-gray-300 mb-6">Pengaduan Anda telah dikirim ke tim support. Kami akan segera menghubungi Anda.</p>
            <div className="bg-[#0d141d] p-4 rounded-lg mb-6 inline-block">
              <p className="text-yellow-400 font-bold">Nomor Referensi Anda:</p>
              <p className="text-white text-xl">{referenceNumber}</p>
              <p className="text-gray-400 text-sm mt-2">Simpan nomor ini untuk referensi Anda</p>
            </div>
            <button onClick={resetForm} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
              Kirim Pengaduan Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input Username */}
              <div>
                <label className="block text-yellow-400 font-bold mb-2" htmlFor="username">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  maxLength={50}
                  className={`w-full bg-[#0d141d] border ${errors.username ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                  placeholder="Username PENASLOT Anda"
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>

              {/* Input Email */}
              <div>
                <label className="block text-yellow-400 font-bold mb-2" htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={100}
                  className={`w-full bg-[#0d141d] border ${errors.email ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                  placeholder="Alamat email Anda"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input Nomor Telepon */}
              <div>
                <label className="block text-yellow-400 font-bold mb-2" htmlFor="phoneNumber">
                  Nomor WA Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={16} // +62 and 13 digits
                  className={`w-full bg-[#0d141d] border ${errors.phoneNumber ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                  placeholder="contoh: +628123456789"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Input Game ID */}
              <div>
                <label className="block text-yellow-400 font-bold mb-2" htmlFor="gameId">
                  ID Game (opsional)
                </label>
                <input
                  id="gameId"
                  name="gameId"
                  type="text"
                  value={formData.gameId}
                  onChange={handleChange}
                  maxLength={50}
                  className={`w-full bg-[#0d141d] border ${errors.gameId ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                  placeholder="ID Game"
                />
                {errors.gameId && <p className="text-red-500 text-sm mt-1">{errors.gameId}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pilih Jenis Masalah */}
              <div>
                <label className="block text-yellow-400 font-bold mb-2" htmlFor="issueType">
                  Jenis Masalah <span className="text-red-500">*</span>
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  className={`w-full bg-[#0d141d] border ${errors.issueType ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                >
                  <option value="">Pilih Jenis Masalah</option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.issueType && <p className="text-red-500 text-sm mt-1">{errors.issueType}</p>}
              </div>

              {/* Input Tanggal Masalah */}
              <div>
                <label className="block text-yellow-400 font-bold mb-2" htmlFor="dateOfIssue">
                  Tanggal Masalah <span className="text-red-500">*</span>
                </label>
                <input
                  id="dateOfIssue"
                  name="dateOfIssue"
                  type="date"
                  max={new Date().toISOString().split("T")[0]} // Prevents future dates
                  value={formData.dateOfIssue}
                  onChange={handleChange}
                  className={`w-full bg-[#0d141d] border ${errors.dateOfIssue ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                />
                {errors.dateOfIssue && <p className="text-red-500 text-sm mt-1">{errors.dateOfIssue}</p>}
              </div>
            </div>

            {/* Input Deskripsi Masalah */}
            <div>
              <label className="block text-yellow-400 font-bold mb-2" htmlFor="description">
                Deskripsi Masalah <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                maxLength={2000}
                className={`w-full bg-[#0d141d] border ${errors.description ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                placeholder="Jelaskan masalah Anda secara detail..."
              ></textarea>
              <div className="flex justify-between">
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                <p className="text-gray-400 text-sm mt-1">{formData.description.length}/2000</p>
              </div>
            </div>

            <div className="bg-[#0d141d] p-4 rounded-lg border border-yellow-400 border-opacity-30">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-300">
                    Dengan mengisi formulir ini, masalah Anda akan segera diteruskan ke tim dukungan kami dan akan segera mendapatkan tanggapan.
                    <br />
                    Tim kami akan merespon melalui WhatsApp, silakan masukkan nomor WA yang valid.
                  </p>
                  <p className="text-sm text-gray-300 mt-2">Keluhan Anda akan diberikan nomor referensi unik untuk pelacakan.</p>
                </div>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-black rounded-full animate-spin mr-2"></div>
                    <span>Mengirim...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Kirim Pengaduan</span>
                    <span className="absolute bottom-0 left-0 w-0 h-full bg-yellow-600 transition-all duration-300 group-hover:w-full -z-0"></span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        <div className="mt-8 text-sm text-gray-400 border-t border-gray-700 pt-4">
          <p className="font-bold text-yellow-400">Butuh Bantuan Segera?</p>
          <p>
            Untuk masalah mendesak, silakan hubungi kami langsung melalui Telegram:{" "}
            <a href="https://t.me/lussypena">
              <span className="text-yellow-400">@lussypena</span>
            </a>
          </p>
          <p className="mt-2">
            Bantuan Livechat: 24 Jam →{" "}
            <a href="https://t.ly/livechattt" className="text-yellow-400">
              Klik disini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default DirectComplaintForm;