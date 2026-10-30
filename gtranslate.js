document.addEventListener("DOMContentLoaded", function() {
    // 1. Cek apakah halaman ini memiliki tempat khusus untuk bahasa (yang cuma kita taruh di UserSettings.html)
    let wrapper = document.querySelector('.gtranslate_wrapper');
    
    if (!wrapper) {
        // 2. Jika di halaman lain (Index, Login, dll), kita tetap buat elemennya agar script terjemahan bekerja...
        wrapper = document.createElement('div');
        wrapper.className = 'gtranslate_wrapper';
        
        // ...TAPI kita sembunyikan secara visual agar tidak mengotori desain UI kamu.
        wrapper.style.position = 'absolute';
        wrapper.style.width = '0px';
        wrapper.style.height = '0px';
        wrapper.style.overflow = 'hidden';
        wrapper.style.opacity = '0';
        document.body.appendChild(wrapper);
    }

    // 3. Konfigurasi GTranslate (Indonesia, Inggris, Mandarin)
    window.gtranslateSettings = {
        "default_language": "id",
        "languages": ["id", "en", "zh-CN"],
        "wrapper_selector": ".gtranslate_wrapper"
    };

    // 4. Eksekusi Engine GTranslate
    const script = document.createElement('script');
    script.src = "https://cdn.gtranslate.net/widgets/latest/dropdown.js";
    script.defer = true;
    document.body.appendChild(script);
});