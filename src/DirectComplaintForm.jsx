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

  const issueTypes = ["Deposit/Penarikan Bermasalah", "Kerusakan Game", "Masalah Akses Akun", "Masalah Bonus/Promosi", "Kesalahan Proses Pembayaran", "Logout Tiba-tiba", "Masalah Pembayaran Jackpot", "Lainnya"];

  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username wajib diisi";
    if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email tidak valid";
    if (!formData.issueType) newErrors.issueType = "Jenis masalah wajib dipilih";
    if (!formData.description.trim()) newErrors.description = "Deskripsi wajib diisi";
    if (!formData.dateOfIssue) newErrors.dateOfIssue = "Tanggal masalah wajib diisi";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Nomor telepon wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/send-complaint`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          setReferenceNumber(result.referenceNumber);
          setIsSubmitted(true);
        } else {
          throw new Error(result.message || "Gagal mengirim pengaduan");
        }
      } catch (error) {
        alert("Terjadi kesalahan saat mengirim pengaduan. Silakan coba lagi.");
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
  };

  return (
    <div className="bg-[#0f1923] text-white min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-[#161d27] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Laporan Pengaduan Pelanggan</h1>

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
                className={`w-full bg-[#0d141d] border ${errors.email ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                placeholder="Alamat email Anda"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Input Nomor Telepon */}
            <div>
              <label className="block text-yellow-400 font-bold mb-2" htmlFor="phoneNumber">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full bg-[#0d141d] border ${errors.phoneNumber ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                placeholder="Nomor telepon Anda"
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Input Game ID */}
            <div>
              <label className="block text-yellow-400 font-bold mb-2" htmlFor="gameId">
                Game ID (opsional)
              </label>
              <input
                id="gameId"
                name="gameId"
                type="text"
                value={formData.gameId}
                onChange={handleChange}
                className="w-full bg-[#0d141d] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400"
                placeholder="Game ID tempat masalah terjadi"
              />
            </div>

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
                value={formData.dateOfIssue}
                onChange={handleChange}
                className={`w-full bg-[#0d141d] border ${errors.dateOfIssue ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
              />
              {errors.dateOfIssue && <p className="text-red-500 text-sm mt-1">{errors.dateOfIssue}</p>}
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
                className={`w-full bg-[#0d141d] border ${errors.description ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                placeholder="Jelaskan masalah Anda secara detail..."
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
      </div>
    </div>
  );
};

export default DirectComplaintForm;
