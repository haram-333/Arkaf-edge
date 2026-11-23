"""Extract high-quality, ultra-small WebP scroll-frame sequences from generated MP4 videos."""
import os
import subprocess
import glob

FFMPEG = r"C:\Program Files\Softdeluxe\Free Download Manager\ffmpeg.exe"
BASE = r"c:\Users\Haram\Desktop\Arkaf-edge"

JOBS = [
    {
        "name": "hero",
        "src": os.path.join(BASE, "media", "videos", "hero_vortex.mp4"),
        "out": os.path.join(BASE, "public", "frames", "hero"),
        "fps": 20,  # 6s * 20fps = 120 crisp scroll frames
        "vf": "fps=20,scale=1280:-2:flags=lanczos",
        "quality": 78,
    },
    {
        "name": "flower",
        "src": os.path.join(BASE, "media", "videos", "glass_flower.mp4"),
        "out": os.path.join(BASE, "public", "frames", "flower"),
        "fps": 20,
        # Crush near-black compression noise straight to pure #000000 for seamless blending
        "vf": "fps=20,scale=1280:-2:flags=lanczos,curves=all='0/0 0.045/0 1/1'",
        "quality": 80,
    },
    {
        "name": "wave",
        "src": os.path.join(BASE, "media", "videos", "approach_wave.mp4"),
        "out": os.path.join(BASE, "public", "frames", "wave"),
        "fps": 20,
        "vf": "fps=20,scale=1280:-2:flags=lanczos",
        "quality": 78,
    },
]


def main():
    if not os.path.exists(FFMPEG):
        raise FileNotFoundError(f"FFmpeg not found at {FFMPEG}")

    for job in JOBS:
        if not os.path.exists(job["src"]):
            print(f"[SKIP] Missing source video: {job['src']}")
            continue

        os.makedirs(job["out"], exist_ok=True)
        for old in glob.glob(os.path.join(job["out"], "*.webp")):
            os.remove(old)

        pattern = os.path.join(job["out"], "frame_%04d.webp")
        cmd = [
            FFMPEG,
            "-y",
            "-i", job["src"],
            "-vf", job["vf"],
            "-c:v", "libwebp",
            "-quality", str(job["quality"]),
            "-compression_level", "6",
            "-an",
            pattern,
        ]
        print(f"[RUN] Extracting {job['name']} -> {job['out']}")
        subprocess.run(cmd, check=True)

        frames = sorted(glob.glob(os.path.join(job["out"], "*.webp")))
        total_bytes = sum(os.path.getsize(f) for f in frames)
        avg_kb = (total_bytes / len(frames) / 1024) if frames else 0
        print(
            f"[DONE] {job['name']}: {len(frames)} frames | "
            f"{total_bytes / (1024 * 1024):.2f} MB total ({avg_kb:.1f} KB/frame)"
        )


if __name__ == "__main__":
    main()
