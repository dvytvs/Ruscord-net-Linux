export async function initWebRTC() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.srcObject = stream;
    video.style.position = "fixed";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.zIndex = "-1"; // чтобы видео не перекрывало рускорду
    document.body.appendChild(video);

    console.log("[WebRTC/info] поток инициализирован");
    return stream;
  } catch (err) {
    console.error("[WebRTC/ERR] ошибка при инициализации:", err);
    return null;
  }
}
