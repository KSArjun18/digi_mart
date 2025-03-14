export const correctSpeechErrors = (transcript) => { 
    return transcript
      .replace(/amozon/i, "Amazon")
      .replace(/i phone/i, "iPhone")
      .replace(/galaxy/i, "Samsung Galaxy")
      .replace(/air pods/i, "AirPods")
      .replace(/mac book/i, "MacBook")
      .replace(/play station/i, "PlayStation")
      .replace(/ps five|ps 5/i, "PS5")
      .replace(/xbox series x/i, "Xbox Series X")
      .replace(/xbox series s/i, "Xbox Series S")
      .replace(/samsung tab/i, "Samsung Tablet")
      .replace(/ipad pro/i, "iPad Pro")
      .replace(/ipad air/i, "iPad Air")
      .replace(/kindle paper white/i, "Kindle Paperwhite")
      .replace(/fire stick/i, "Fire TV Stick")
      .replace(/echo dot/i, "Echo Dot")
      .replace(/google pixel/i, "Google Pixel")
      .replace(/mi band/i, "Mi Band")
      .replace(/fitbit versa/i, "Fitbit Versa")
      .replace(/air conditioner/i, "Air Conditioner")
      .replace(/led tv/i, "LED TV")
      .replace(/oled tv/i, "OLED TV")
      .replace(/smart watch/i, "Smartwatch")
      .replace(/noise buds/i, "Noise Buds")
      .replace(/boat rockerz/i, "boAt Rockerz")
      .replace(/boat air dopes/i, "boAt Airdopes")
      .replace(/sony bravia/i, "Sony Bravia")
      .replace(/realme buds/i, "Realme Buds")
      .replace(/jbl speakers/i, "JBL Speakers")
      .replace(/anker soundcore/i, "Anker Soundcore")
      .replace(/logitech mouse/i, "Logitech Mouse")
      .replace(/hp pavilion/i, "HP Pavilion")
      .replace(/dell inspiron/i, "Dell Inspiron")
      .replace(/asus rog/i, "ASUS ROG")
      .replace(/msi gaming/i, "MSI Gaming")
      .replace(/razer blade/i, "Razer Blade")
      .replace(/corsair keyboard/i, "Corsair Keyboard")
      .replace(/mechanical keyboard/i, "Mechanical Keyboard");
};
