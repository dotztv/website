// not gonna lie, this entire file is made by AI
async function fetchAPI(value) {
    try {
        const res = await fetch(`/api/${value}`);
        const contentType = res.headers.get("content-type");

        if (!res.ok) {
            if (contentType && contentType.includes("application/json")) {
                const err = await res.json();
                throw new Error(err.error || JSON.stringify(err));
            } else {
                throw new Error(await res.text());
            }
        }

        if (contentType && contentType.includes("application/json")) {
            return await res.json();
        } else {
            return await res.text();
        }
    } catch (err) {
        console.error("API Error:", err);
        return { error: err.message || "Unknown error" };
    }
}

async function updateParagraphById(id, endpoint, label = "", suffix = "") {
    const data = await fetchAPI(endpoint);
    const el = document.getElementById(id);

    if (!el) return;

    if (data && !data.error) {
        if (endpoint === "net") {
            el.textContent = `${label}Upload: ${data.upload_kbps} kbps, Download: ${data.download_kbps} kbps${suffix}`;
        } else if (typeof data === "object") {
            const keys = Object.keys(data);
            if (keys.length === 1) {
                el.textContent = `${label}${data[keys[0]]}${suffix}`;
            } else {
                el.textContent = `${label}${JSON.stringify(data)}${suffix}`;
            }
        } else {
            el.textContent = `${label}${data}${suffix}`;
        }
    } else {
        el.textContent = "Failed to fetch data.";
    }
}

async function updateAll() {
    await updateParagraphById("load", "cpu/percent", "usage: ", "%");
    await updateParagraphById("uptime", "uptime", "uptime: ", "");
    await updateParagraphById("temp", "cpu/temp", "temp: ", "°C");
}

// Initial update
updateAll();
// Update every second
setInterval(updateAll, 1000);