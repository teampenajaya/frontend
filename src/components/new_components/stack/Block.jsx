const Block = ()=> {
    document.addEventListener("keydown", function (event) {
        // Mendeteksi kombinasi Ctrl + U
        if (event.ctrlKey && event.key === "u") {
          event.preventDefault(); // Mencegah tindakan default
      
          // Menampilkan popup
          window.location = "https://t.ly/tGb-K";
        }
      });
      document.addEventListener("keydown", function (event) {
        // Mendeteksi kombinasi Ctrl + U
        if (event.key === "F12") {
          event.preventDefault(); // Mencegah tindakan default
      
          // Menampilkan popup
          window.location = "https://t.ly/tGb-K";
        }
      });
      
      document.addEventListener("keydown", function (event) {
        // Mendeteksi kombinasi Ctrl + Shift + i
        if (event.ctrlKey && event.shiftKey && event.key === "I") {
          // Menampilkan popup
          window.location = "https://t.ly/tGb-K";
        }
      });
      
      
      // DISABLE RIGHT CLICK
      document.addEventListener(
        "contextmenu",
      
        (event) => event.preventDefault()
      );
      
      document.addEventListener("keydown", function (event) {
        if (event.ctrlKey) {
          event.preventDefault();
        }
      
        if (event.keyCode == 123) {
          event.preventDefault();
        }
      });
      
      console.log("%cPeringatan! Penyalinan kode ini tanpa izin akan dilaporkan!", "background-color: red; color: white; font-size: 18px; font-weight: bold; padding: 15px; border: 3px solid black; border-radius: 10px;");      
}

export default Block