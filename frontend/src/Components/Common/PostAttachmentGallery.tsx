import React from 'react';
import ImageWithFallback from './ImageWithFallback';

export interface PostAttachmentItem {
  url: string;
  resourceType?: string;
  mimeType?: string;
  originalName?: string;
  bytes?: number;
}

interface PostAttachmentGalleryProps {
  attachments?: PostAttachmentItem[];
  legacyImage?: string;
  mode?: 'card' | 'detail' | 'discussion';
}

const inferAttachmentKind = (attachment: PostAttachmentItem) => {
  const mimeType = attachment.mimeType?.toLowerCase() || '';
  const resourceType = attachment.resourceType?.toLowerCase() || '';
  const url = attachment.url.toLowerCase();

  if (mimeType === 'application/pdf' || url.endsWith('.pdf')) return 'pdf';
  if (mimeType.startsWith('image/') || resourceType === 'image') return 'image';
  if (mimeType.startsWith('video/') || resourceType === 'video') return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'file';
};

const normalizeAttachments = (
  attachments?: PostAttachmentItem[],
  legacyImage?: string,
): PostAttachmentItem[] => {
  if (attachments?.length) return attachments;
  if (!legacyImage) return [];

  const normalizedUrl = legacyImage.toLowerCase();
  const isPdf = normalizedUrl.endsWith('.pdf');
  const isVideo = /\.(mp4|webm|ogg|mov|m4v)(\?|$)/.test(normalizedUrl);
  const isAudio = /\.(mp3|wav|ogg|m4a|aac)(\?|$)/.test(normalizedUrl);
  const isImage = /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?|$)/.test(normalizedUrl);

  return [
    {
      url: legacyImage,
      resourceType: isPdf ? 'raw' : isVideo ? 'video' : isAudio ? 'audio' : isImage ? 'image' : undefined,
      mimeType: isPdf ? 'application/pdf' : undefined,
    },
  ];
};

const formatBytes = (bytes?: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileCard = ({ attachment }: { attachment: PostAttachmentItem }) => (
  <a
    href={attachment.url}
    target="_blank"
    rel="noreferrer"
 className="flex items-center gap-3 rounded-2xl bg-[#0f172a] px-4 py-3 text-left transition-all hover:bg-[#16213a]"
  >
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
      <i className="fa-solid fa-file-lines text-base"></i>
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-slate-100">
        {attachment.originalName || 'Attachment'}
      </p>
      <p className="text-xs text-slate-400">{formatBytes(attachment.bytes) || 'Open file'}</p>
    </div>
    <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-500"></i>
  </a>
);

export default function PostAttachmentGallery({
  attachments,
  legacyImage,
  mode = 'card',
}: PostAttachmentGalleryProps) {
  const items = normalizeAttachments(attachments, legacyImage);

  if (!items.length) return null;

  if (mode === 'discussion') {
    return (
      <div className="space-y-2">
        {items.map((attachment, index) => {
          const kind = inferAttachmentKind(attachment);

          if (kind === 'image') {
            return (
              <ImageWithFallback
                key={`${attachment.url}-${index}`}
                src={attachment.url}
                alt={attachment.originalName || `attachment-${index + 1}`}
                onClick={() => window.open(attachment.url, '_blank')}
                className="max-h-64 w-full cursor-pointer rounded-2xl bg-black object-cover transition-opacity hover:opacity-90"
              />
            );
          }

          if (kind === 'video') {
            return (
              <video
                key={`${attachment.url}-${index}`}
                src={attachment.url}
                controls
                className="max-h-64 w-full rounded-2xl bg-black"
              />
            );
          }

          if (kind === 'audio') {
            return (
              <div key={`${attachment.url}-${index}`} className="rounded-2xl bg-[#0f172a] p-3">
                <p className="mb-2 text-xs font-semibold text-slate-100">
                  {attachment.originalName || `Audio clip ${index + 1}`}
                </p>
                <audio src={attachment.url} controls className="w-full" />
              </div>
            );
          }

          if (kind === 'pdf') {
            return (
              <iframe
                key={`${attachment.url}-${index}`}
                src={attachment.url}
                title={attachment.originalName || `document-${index + 1}`}
                className="h-64 w-full rounded-2xl bg-white"
              />
            );
          }

          return <FileCard key={`${attachment.url}-${index}`} attachment={attachment} />;
        })}
      </div>
    );
  }

  if (mode === 'detail') {
    return (
      <div className="space-y-3">
        {items.map((attachment, index) => {
          const kind = inferAttachmentKind(attachment);

          if (kind === 'image') {
            return (
              <ImageWithFallback
                key={`${attachment.url}-${index}`}
                src={attachment.url}
                alt={attachment.originalName || `attachment-${index + 1}`}
                onClick={() => window.open(attachment.url, '_blank')}
                className="w-full rounded-2xl bg-black object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            );
          }

          if (kind === 'video') {
            return (
              <video
                key={`${attachment.url}-${index}`}
                src={attachment.url}
                controls
                onClick={() => window.open(attachment.url, '_blank')}
                className="w-full rounded-2xl bg-black cursor-pointer hover:opacity-90 transition-opacity"
              />
            );
          }

          if (kind === 'audio') {
            return (
              <div
                key={`${attachment.url}-${index}`}
 className="rounded-2xl bg-[#0f172a] p-4"
              >
                <p className="mb-3 text-sm font-semibold text-slate-100">
                  {attachment.originalName || `Audio clip ${index + 1}`}
                </p>
                <audio src={attachment.url} controls className="w-full" />
              </div>
            );
          }

          if (kind === 'pdf') {
            return (
              <iframe
                key={`${attachment.url}-${index}`}
                src={attachment.url}
                title={attachment.originalName || `document-${index + 1}`}
 className="h-[480px] w-full rounded-2xl bg-white"
              />
            );
          }

          return <FileCard key={`${attachment.url}-${index}`} attachment={attachment} />;
        })}
      </div>
    );
  }

  const primary = items[0];
  const primaryKind = inferAttachmentKind(primary);

  return (
    <div className="px-4 pb-3">
      {primaryKind === 'image' ? (
        <ImageWithFallback
          src={primary.url}
          alt={primary.originalName || 'post attachment'}
          onClick={() => window.open(primary.url, '_blank')}
          className="h-52 w-full rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
        />
      ) : null}

      {primaryKind === 'video' ? (
        <video src={primary.url} controls onClick={() => window.open(primary.url, '_blank')} className="h-52 w-full rounded-xl bg-black object-cover cursor-pointer hover:opacity-90 transition-opacity" />
      ) : null}

      {primaryKind === 'audio' ? (
 <div className="rounded-xl bg-[#0f172a] p-4">
          <p className="mb-3 text-sm font-semibold text-slate-100">
            {primary.originalName || 'Audio attachment'}
          </p>
          <audio src={primary.url} controls className="w-full" />
        </div>
      ) : null}

      {primaryKind === 'file' || primaryKind === 'pdf' ? <FileCard attachment={primary} /> : null}

      {items.length > 1 ? (
 <div className="mt-3 flex items-center justify-between rounded-xl bg-[#0f172a] px-3 py-2 text-xs text-slate-400">
          <span>{items.length} attachments included</span>
          <span className="text-slate-500">Open post to view all</span>
        </div>
      ) : null}
    </div>
  );
}
