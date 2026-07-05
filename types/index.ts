export interface TikTokDownloadData {
  title: string;
  author: {
    username: string;
    nickname: string;
    avatar: string;
  };
  cover: string;
  duration: number;
  video: {
    hd: string;
    sd: string;
    watermark: string;
  };
  music: string;
  images: string[];
  isSlideshow: boolean;
}

export interface ApiSuccessResponse {
  success: true;
  data: TikTokDownloadData;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export type AppState = "idle" | "loading" | "success" | "error";

export type LoadingStep =
  | "Đang lấy dữ liệu..."
  | "Đang phân tích luồng video..."
  | "Đang chuẩn bị liên kết tải xuống..."
  | "Sắp hoàn tất...";
