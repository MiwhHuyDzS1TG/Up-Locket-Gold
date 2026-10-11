"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Heart,
  Info,
  LockKeyhole,
  MessageCircle,
  PlayCircle,
  RefreshCcw,
  RotateCcw,
  ShieldAlert,
  Smartphone,
  Store,
  Wifi,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  APP_STORE_INSTRUCTIONS,
  APPSTORE_EMAIL,
  APPSTORE_PASSWORD,
  CONFIG_DOWNLOAD_URL,
  DNS_VIDEO_URL,
  MODULE_URL,
  SUPPORT_URL,
  YOUTUBE_EMBED_URL,
  YOUTUBE_URL,
} from "@/config/site";
import { CopyField } from "./copy-field";
import { StepCard } from "./step-card";

const STORAGE_KEY = "locket-gold-guide-progress-v1";

type Progress = [boolean, boolean, boolean];
type FileState = "checking" | "available" | "missing";
type ToastState = { message: string; error: boolean } | null;

const initialProgress: Progress = [false, false, false];

function usePublicFile(url: string) {
  const [state, setState] = useState<FileState>("checking");

  useEffect(() => {
    let active = true;

    fetch(url, { method: "HEAD", cache: "no-store" })
      .then((response) => {
        if (active) setState(response.ok ? "available" : "missing");
      })
      .catch(() => {
        if (active) setState("missing");
      });

    return () => {
      active = false;
    };
  }, [url]);

  return state;
}

export function GuideExperience() {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [youtubeReady, setYoutubeReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const configFile = usePublicFile(CONFIG_DOWNLOAD_URL);
  const videoFile = usePublicFile(DNS_VIDEO_URL);

  useEffect(() => {
    let restoredProgress = initialProgress;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.length === 3 &&
          parsed.every((item) => typeof item === "boolean")
        ) {
          restoredProgress = parsed as Progress;
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    const frame = window.requestAnimationFrame(() => {
      setProgress(restoredProgress);
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [hydrated, progress]);

  const completedCount = progress.filter(Boolean).length;
  const percent = Math.round((completedCount / 3) * 100);
  const allComplete = completedCount === 3;

  const progressLabel = useMemo(() => {
    if (allComplete) return "Đã hoàn thành cả 3 bước";
    if (completedCount === 0) return "Sẵn sàng bắt đầu";
    return `Đã hoàn thành ${completedCount} trong 3 bước`;
  }, [allComplete, completedCount]);

  const updateStep = (index: number, value: boolean) => {
    setProgress((current) => {
      const next = [...current] as Progress;
      next[index] = value;
      return next;
    });
  };

  const showToast = (message: string, error = false) => {
    setToast({ message, error });
    window.setTimeout(() => setToast(null), 2600);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const resetProgress = () => {
    setProgress(initialProgress);
    window.localStorage.removeItem(STORAGE_KEY);
    showToast("Đã đặt lại tiến trình.");
    window.setTimeout(() => scrollTo("hero"), 100);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="nav-row page-width">
          <button className="brand" type="button" onClick={() => scrollTo("hero")}>
            <span className="brand__mark" aria-hidden="true">
              <Heart size={21} fill="currentColor" />
              <LockKeyhole size={12} />
            </span>
            <span className="brand__copy">
              <strong>LOCKET GOLD</strong>
              <small>Hướng dẫn chi tiết cho iPhone</small>
            </span>
          </button>

          <span className="guide-badge">
            <Smartphone size={15} />
            <span>Hướng dẫn từng bước</span>
          </span>
        </div>

        <div className="progress-line" aria-label={`Tiến trình ${percent}%`}>
          <motion.span
            initial={false}
            animate={{ scaleX: percent / 100 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 20 }}
          />
        </div>
      </header>

      <main>
        <section className="hero page-width" id="hero">
          <motion.div
            className="hero__copy"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero__badge">
              <CheckCircle2 size={16} />
              {progressLabel}
            </span>
            <h1>Cài đặt Locket Gold</h1>
            <p>Làm theo 3 bước hướng dẫn bên dưới để hoàn tất.</p>

            <div className="hero__actions">
              <button className="primary-button" type="button" onClick={() => scrollTo("step-1")}>
                Bắt đầu hướng dẫn
                <ArrowRight size={19} />
              </button>
              <span className="hero__count">
                <strong>{percent}%</strong>
                tiến trình
              </span>
            </div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/assets/locket-gold-hero.webp"
              alt="Khóa trái tim màu vàng nằm trong lớp kính trong suốt"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 50vw"
            />
            <div className="hero__visual-note">
              <LockKeyhole size={18} />
              <span>3 bước rõ ràng</span>
            </div>
          </motion.div>
        </section>

        <section className="journey page-width" aria-label="Ba bước hướng dẫn">
          <div className="journey__intro">
            <h2>Một lộ trình, ba thao tác</h2>
            <p>Tiến trình được lưu trên chính thiết bị này. Thông tin đăng nhập không được lưu hoặc gửi đi.</p>
          </div>

          <div className="timeline">
            <StepCard
              id="step-1"
              step={1}
              title="Đăng nhập tài khoản App Store"
              icon={<Store size={25} />}
              complete={progress[0]}
              completionLabel="Tôi đã hoàn thành bước này"
              nextStepId="step-2"
              onComplete={(value) => updateStep(0, value)}
            >
              <div className="credentials-grid">
                <CopyField label="Email" value={APPSTORE_EMAIL} onCopied={showToast} />
                <CopyField
                  label="Mật khẩu"
                  value={APPSTORE_PASSWORD}
                  secret
                  onCopied={showToast}
                />
              </div>

              <div className="privacy-note">
                <Info size={18} />
                <p>
                  Đây là thông tin hiển thị công khai trên website. Trang chỉ dùng thông tin này để sao chép và
                  không lưu vào tiến trình.
                </p>
              </div>

              <div className="warning-panel warning-panel--strong">
                <ShieldAlert size={24} />
                <div>
                  <strong>CHỈ ĐĂNG NHẬP APP STORE</strong>
                  <span>KHÔNG ĐĂNG NHẬP ICLOUD</span>
                </div>
              </div>

              <div className="instruction-panel">
                <h3>Thao tác trong phần Cài đặt</h3>
                <ol className="instruction-grid">
                  {APP_STORE_INSTRUCTIONS.map((instruction, index) => (
                    <li key={instruction}>
                      <span>{index + 1}</span>
                      <p>{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="warning-panel">
                <CircleAlert size={22} />
                <p>
                  <strong>Lưu ý:</strong> Chỉ sử dụng tài khoản trong mục Phương tiện &amp; Mục mua. Tuyệt đối
                  không đăng xuất iCloud cá nhân.
                </p>
              </div>

              <div className="verification-panel" id="support">
                <div className="verification-panel__icon" aria-hidden="true">
                  <MessageCircle size={25} />
                </div>
                <div className="verification-panel__content">
                  <h3>Nếu iPhone yêu cầu mã xác minh</h3>
                  <div className="settings-path" aria-label="Đường dẫn thao tác">
                    <span>Không nhận được mã?</span>
                    <ArrowRight size={16} />
                    <span>Không thể truy cập thiết bị</span>
                  </div>
                  <p>Nhắn người hỗ trợ để được hướng dẫn lấy mã xác minh hợp lệ.</p>
                  <p className="verification-panel__safety">
                    Không chia sẻ mật khẩu cá nhân hoặc mã xác minh của tài khoản riêng.
                  </p>
                  <a className="secondary-button" href={SUPPORT_URL} target="_blank" rel="noreferrer">
                    <MessageCircle size={18} />
                    Nhắn xin mã
                  </a>
                </div>
              </div>
            </StepCard>

            <StepCard
              id="step-2"
              step={2}
              title="Tải và cài đặt cấu hình"
              description="Tải tệp cấu hình xuống iPhone và xem video hướng dẫn trước khi cài đặt."
              icon={<Wifi size={25} />}
              complete={progress[1]}
              completionLabel="Tôi đã hoàn thành bước này"
              nextStepId="step-3"
              onComplete={(value) => updateStep(1, value)}
            >
              <div className="download-row">
                {configFile === "available" ? (
                  <a className="primary-button" href={CONFIG_DOWNLOAD_URL} download>
                    <ArrowDownToLine size={20} />
                    Tải cấu hình
                  </a>
                ) : configFile === "checking" ? (
                  <button className="primary-button is-loading" type="button" disabled>
                    <RefreshCcw size={19} />
                    Đang kiểm tra tệp
                  </button>
                ) : (
                  <button className="primary-button" type="button" disabled>
                    <CircleAlert size={19} />
                    Chưa có tệp cấu hình
                  </button>
                )}
                <span className={`file-status file-status--${configFile}`}>
                  {configFile === "available" ? "locketgold.mobileconfig đã sẵn sàng" : null}
                  {configFile === "checking" ? "Đang kiểm tra đường dẫn tải xuống" : null}
                  {configFile === "missing" ? "Thêm tệp vào public/downloads để bật nút tải" : null}
                </span>
              </div>

              <figure className="video-figure">
                <div className="video-shell">
                  {videoFile === "checking" || (videoFile === "available" && !videoReady && !videoError) ? (
                    <div className="media-placeholder" aria-live="polite">
                      <PlayCircle size={35} />
                      <span>Đang chuẩn bị video</span>
                    </div>
                  ) : null}

                  {videoFile === "available" && !videoError ? (
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      src={DNS_VIDEO_URL}
                      onLoadedMetadata={() => setVideoReady(true)}
                      onError={() => setVideoError(true)}
                    >
                      Trình duyệt của bạn không hỗ trợ video HTML5.
                    </video>
                  ) : null}

                  {videoFile === "missing" || videoError ? (
                    <div className="media-error" role="status">
                      <CircleAlert size={31} />
                      <strong>Chưa thể tải video</strong>
                      <span>Kiểm tra tệp public/videos/dns.mp4 rồi tải lại trang.</span>
                    </div>
                  ) : null}
                </div>
                <figcaption>Video hướng dẫn cài đặt</figcaption>
              </figure>

              <div className="risk-note">
                <ShieldAlert size={21} />
                <p>
                  Chỉ cài đặt cấu hình khi bạn hiểu rõ nội dung và tin tưởng nguồn cung cấp. Cấu hình DNS/VPN có
                  thể thay đổi cách thiết bị xử lý lưu lượng mạng. Website không tự động cài đặt hoặc yêu cầu thêm
                  quyền trên thiết bị.
                </p>
              </div>
            </StepCard>

            <StepCard
              id="step-3"
              step={3}
              title="Sao chép Module và xem hướng dẫn"
              icon={<LockKeyhole size={25} />}
              complete={progress[2]}
              completionLabel="Tôi đã xem xong hướng dẫn"
              onComplete={(value) => updateStep(2, value)}
            >
              <CopyField label="Liên kết Module" value={MODULE_URL} onCopied={showToast} />
              <a className="text-link" href={MODULE_URL} target="_blank" rel="noreferrer">
                Mở liên kết
                <ExternalLink size={17} />
              </a>

              <div className="youtube-section">
                <h3>Xem video hướng dẫn thực hiện</h3>
                <div className="youtube-shell">
                  {!youtubeReady ? (
                    <div className="media-placeholder">
                      <PlayCircle size={35} />
                      <span>Đang tải trình phát YouTube</span>
                    </div>
                  ) : null}
                  <iframe
                    src={YOUTUBE_EMBED_URL}
                    title="Video hướng dẫn sử dụng Module"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    onLoad={() => setYoutubeReady(true)}
                  />
                </div>
                <p className="embed-fallback">
                  Nếu trình phát không hiển thị, hãy mở video bằng liên kết bên dưới.
                </p>
                <a className="secondary-button" href={YOUTUBE_URL} target="_blank" rel="noreferrer">
                  <ExternalLink size={18} />
                  Xem trên YouTube
                </a>
              </div>

            </StepCard>
          </div>
        </section>

        <AnimatePresence>
          {allComplete ? (
            <motion.section
              className="completion-card page-width"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              aria-live="polite"
            >
              <motion.div
                className="completion-card__check"
                initial={reduceMotion ? false : { scale: 0, rotate: -18 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.12 }}
              >
                <Check size={33} strokeWidth={3} />
              </motion.div>
              <div className="completion-card__copy">
                <h2>Bạn đã hoàn thành 3 bước hướng dẫn!</h2>
                <p>Đây là xác nhận bạn đã xem đủ nội dung, không phải xác nhận thuê bao đã được kích hoạt.</p>
              </div>
              <div className="completion-card__actions">
                <button className="secondary-button" type="button" onClick={() => scrollTo("step-1")}>
                  <RotateCcw size={18} />
                  Xem lại hướng dẫn
                </button>
                <button className="ghost-button" type="button" onClick={resetProgress}>
                  Bắt đầu lại
                </button>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </main>

      <footer className="site-footer page-width">
        <div className="brand brand--footer">
          <span className="brand__mark" aria-hidden="true">
            <Heart size={19} fill="currentColor" />
          </span>
          <span className="brand__copy">
            <strong>LOCKET GOLD</strong>
            <small>Hướng dẫn cài đặt cho iPhone</small>
          </span>
        </div>
        <p>Đọc kỹ cảnh báo bảo mật trước khi cài đặt cấu hình hoặc Module.</p>
      </footer>

      <button className="back-to-top" type="button" onClick={() => scrollTo("hero")} aria-label="Trở về đầu trang">
        <ArrowUp size={20} />
      </button>

      <AnimatePresence>
        {toast ? (
          <motion.div
            className={`toast ${toast.error ? "toast--error" : ""}`}
            role="status"
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast.error ? <CircleAlert size={19} /> : <CheckCircle2 size={19} />}
            {toast.message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
