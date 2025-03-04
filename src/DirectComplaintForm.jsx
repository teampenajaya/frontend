import React, { useState, useEffect } from "react";

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
  const [csrfTokenValid, setCsrfTokenValid] = useState(false);
  const [csrfTokenError, setCsrfTokenError] = useState(null);

  const API_BASE_URL = "http://localhost:3001";

  const issueTypes = ["Deposit/Withdraw Bermasalah", "Masalah Akses Akun", "Masalah Bonus/Promosi", "Kesalahan Proses Pembayaran", "Logout Tiba-tiba", "Masalah Pembayaran Jackpot", "Lainnya"];

  // Fetch CSRF token saat komponen dimuat
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        setCsrfTokenError(null);

        const response = await fetch(`${API_BASE_URL}/get-csrf-token`, {
          method: "GET",
          credentials: "include", // Penting untuk mengirim cookie
        });

        if (!response.ok) {
          throw new Error("Terjadi kesalahan. Silakan coba lagi.");
        }

        setCsrfTokenValid(true);
      } catch (error) {
        // console.error("Error fetching I LOVE U:", error); // Uncomment untuk debugging
        setCsrfTokenValid(false);
        setCsrfTokenError("Terjadi kesalahan. Silakan muat ulang halaman.");
      }
    };

    fetchCsrfToken();
  }, []);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (serverErrors) {
      setServerErrors(null);
    }

    if (name === "phoneNumber") {
      const sanitizedValue = value.replace(/[^0-9+]/g, "");
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

  // Validasi form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.length < 3 || formData.username.length > 50) {
      newErrors.username = "Username harus antara 3-50 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username hanya boleh mengandung huruf, angka, dan underscore";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email terlalu panjang (maksimal 100 karakter)";
    }

    if (formData.gameId && (!/^[a-zA-Z0-9-_]+$/.test(formData.gameId) || formData.gameId.length > 50)) {
      newErrors.gameId = "ID Game tidak valid, hanya huruf, angka, tanda hubung dan underscore";
    }

    if (!formData.issueType) {
      newErrors.issueType = "Jenis keluhan wajib dipilih";
    } else if (!issueTypes.includes(formData.issueType)) {
      newErrors.issueType = "Jenis keluhan tidak valid";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Deskripsi terlalu panjang (maksimal 2000 karakter)";
    }

    if (!formData.dateOfIssue) {
      newErrors.dateOfIssue = "Tanggal keluhan wajib diisi";
    } else {
      const selectedDate = new Date(formData.dateOfIssue);
      const today = new Date();
      if (isNaN(selectedDate.getTime())) {
        newErrors.dateOfIssue = "Tanggal tidak valid";
      } else if (selectedDate > today) {
        newErrors.dateOfIssue = "Tanggal tidak valid (tidak bisa di masa depan)";
      }
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor telepon wajib diisi";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Nomor telepon tidak valid (10-15 digit)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfTokenValid) {
      // setCsrfTokenError("Token keamanan tidak valid. Silakan muat ulang halaman."); // Uncomment untuk debugging
      setCsrfTokenError("Terjadi kesalahan. Silakan muat ulang halaman.");
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);
      setServerErrors(null);

      try {
        const response = await fetch(`${API_BASE_URL}/send-complaint`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include", // Penting untuk mengirim cookie
        });

        const result = await response.json();

        if (response.ok) {
          setReferenceNumber(result.referenceNumber);
          setIsSubmitted(true);
        } else {
          if (result.errors) {
            setErrors(result.errors);
          } else {
            throw new Error(result.message || "Gagal mengirim keluhan");
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setServerErrors(error.message || "Terjadi kesalahan saat mengirim keluhan. Silakan coba lagi.");
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
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Keluhan Member</h1>
        <marquee className="rounded-lg border border-yellow-400 border-opacity-30">Selamat datang di keluhan member ! Kami siap membantu anda dalam keluhan yang anda alami. Silahkan isi form dibawah ini dengan benar dan jelas.</marquee>

        {csrfTokenError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            <p>{csrfTokenError}</p>
            <button onClick={() => window.location.reload()} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm">
              Coba Lagi
            </button>
          </div>
        )}

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
            <h2 className="text-xl font-bold text-green-400 mb-2">Keluhan Berhasil Dikirim!</h2>
            <p className="text-gray-300 mb-6">Keluhan Anda telah dikirim ke tim support. Kami akan segera menghubungi Anda.</p>
            <div className="bg-[#0d141d] p-4 rounded-lg mb-6 inline-block">
              <p className="text-yellow-400 font-bold">Nomor Referensi Anda:</p>
              <p className="text-white text-xl">{referenceNumber}</p>
              <p className="text-gray-400 text-sm mt-2">Simpan nomor ini untuk referensi Anda</p>
            </div>
            <button onClick={resetForm} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
              Kirim Keluhan Lain
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
                  autoComplete="username"
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
                  placeholder="Alamat email aktif"
                  autoComplete="email"
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
                  maxLength={16}
                  className={`w-full bg-[#0d141d] border ${errors.phoneNumber ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                  placeholder="Contoh: +628123456789"
                  autoComplete="tel"
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
                  placeholder="ID Game (bisa dikosongkan)"
                />
                {errors.gameId && <p className="text-red-500 text-sm mt-1">{errors.gameId}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pilih Jenis Keluhan */}
              <div>
                <label className="block text-yellow-400 font-bold mb-2" htmlFor="issueType">
                  Jenis Keluhan <span className="text-red-500">*</span>
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  className={`w-full bg-[#0d141d] border ${errors.issueType ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                >
                  <option value="">Pilih Jenis Keluhan</option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.issueType && <p className="text-red-500 text-sm mt-1">{errors.issueType}</p>}
              </div>

              {/* Input Tanggal Keluhan */}
              <div>
                <label className="block text-yellow-400 font-bold mb-2" htmlFor="dateOfIssue">
                  Tanggal Keluhan <span className="text-red-500">*</span>
                </label>
                <input
                  id="dateOfIssue"
                  name="dateOfIssue"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.dateOfIssue}
                  onChange={handleChange}
                  className={`w-full bg-[#0d141d] border ${errors.dateOfIssue ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                />
                {errors.dateOfIssue && <p className="text-red-500 text-sm mt-1">{errors.dateOfIssue}</p>}
              </div>
            </div>

            {/* Textarea Deskripsi */}
            <div>
              <label className="block text-yellow-400 font-bold mb-2" htmlFor="description">
                Deskripsi Keluhan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={2000}
                rows={5}
                className={`w-full bg-[#0d141d] border ${errors.description ? "border-red-500" : "border-gray-600"} rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400`}
                placeholder="Jelaskan Keluhan Anda secara detail..."
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-gray-400 text-sm mt-1">{formData.description.length}/2000 karakter</p>
            </div>

            {/* Hidden Platform Field - Default to PENASLOT */}
            <input type="hidden" name="platform" value="PENASLOT" />

            <div className="bg-[#0d141d] p-4 rounded-lg border border-yellow-400 border-opacity-30">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-300">
                    Dengan mengisi formulir ini, keluhan Anda akan segera diteruskan ke tim dukungan kami dan akan segera mendapatkan tanggapan.
                    <br />
                    Tim kami akan merespon melalui WhatsApp, silakan masukkan nomor WhatsApp yang valid.
                  </p>
                  <p className="text-sm text-gray-300 mt-2">Keluhan Anda akan diberikan nomor referensi unik untuk pelacakan.</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting || !csrfTokenValid}
                className={`w-full py-3 rounded-lg font-bold transition duration-300 ${isSubmitting || !csrfTokenValid ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-black"}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Keluhan"
                )}
              </button>
            </div>
          </form>
        )}
        <div className="mt-8 text-sm text-gray-400 border-t border-gray-700 pt-4">
          <p className="font-bold text-yellow-400">Butuh Bantuan Segera?</p>
          <p>
            Untuk keluhan mendesak, silakan hubungi kami langsung melalui Telegram:{" "}
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
          <p className="text-yellow-400 text-center mt-6">&copy; {new Date().getFullYear()} PENASLOT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default DirectComplaintForm;
