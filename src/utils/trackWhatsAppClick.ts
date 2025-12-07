"use client";

export async function trackWhatsAppClick(section: string) {
  try {
    const userAgent = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);

    let os = "Desconhecido";
    if (userAgent.includes("Win")) os = "Windows";
    else if (userAgent.includes("Mac")) os = "macOS";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      os = "iOS";

    let browser = "Desconhecido";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
      browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      browser = "Safari";
    else if (userAgent.includes("Edg")) browser = "Edge";

    const urlParams = new URLSearchParams(window.location.search);

    const payload = {
      section,
      date: new Date().toISOString(),
      browser,
      deviceType: isMobile ? "Mobile" : "Desktop",
      os,
      referrer: document.referrer || "Direct Traffic",
      screenHeight: window.innerHeight || 0,
      screenWidth: window.innerWidth || 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "N/A",
      userLanguage: navigator.language || "N/A",
      utmCampaign: urlParams.get("utm_campaign") || "N/A",
      utmMedium: urlParams.get("utm_medium") || "N/A",
      utmSource: urlParams.get("utm_source") || "N/A",
    };

    fetch("/api/metrics/conversion/whatsapp/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((error) =>
      console.error("Erro ao enviar tracking do WhatsApp:", error)
    );
  } catch (error) {
    console.error("Erro ao coletar dados do clique no WhatsApp:", error);
  }
}
