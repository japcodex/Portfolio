document.querySelectorAll(".skills-track").forEach((track) => {
    const clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("img").forEach((img) => (img.alt = ""));
    track.after(clone);
});