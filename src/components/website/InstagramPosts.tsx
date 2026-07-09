'use client';

import { Instagram, Heart, ExternalLink } from 'lucide-react';

interface PostItem { id: string; postUrl: string; imageUrl: string; caption: string; }

interface InstagramPostsProps {
  posts: PostItem[];
  instagramUrl?: string;
}

export default function InstagramPosts({ posts, instagramUrl }: InstagramPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="py-20 sm:py-28 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
            Instagram
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Latest Posts
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Follow us on Instagram for daily updates, behind-the-scenes, and creative content.
          </p>
        </div>

        {/* 3-row grid: 4 cols on lg, 3 on md, 2 on sm */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {posts.slice(0, 12).map((post, idx) => (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200"
            >
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.caption || `Instagram post ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                  <Instagram size={40} className="text-white/40" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 text-white">
                  <div className="flex items-center gap-1.5">
                    <Heart size={18} />
                    <span className="text-sm font-semibold">Like</span>
                  </div>
                  <ExternalLink size={16} />
                </div>
              </div>

              {/* Instagram icon badge */}
              <div className="absolute top-2.5 left-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <Instagram size={14} className="text-white" />
                </div>
              </div>

              {/* Caption at bottom */}
              {post.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs line-clamp-2">{post.caption}</p>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Follow button */}
        {instagramUrl && (
          <div className="text-center mt-10">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
            >
              <Instagram size={18} />
              Follow @aurexstudio_pk
            </a>
          </div>
        )}
      </div>
    </section>
  );
}