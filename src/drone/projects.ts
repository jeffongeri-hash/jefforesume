import type { Project } from '@/drone/types';

export type DroneCategory = 'real-estate' | 'rooftop' | 'weddings' | 'landscape' | 'commercial';

export const projects: Project[] = [
  {
    id: '5',
    title: 'Midwest Landscapes',
    category: 'landscapes',
    year: '2025',
    slug: 'midwest-landscapes',
    coverImage: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/Timeline_1_cdz63u.jpg',
    coverVideo: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/Timeline_1_cdz63u.mp4',
    description: 'The rolling farmlands and natural beauty of the Midwest captured from stunning aerial perspectives, showcasing the vastness and patterns of the heartland.',
    camera: 'DJI Avata 2 and Mini 4K',
    location: 'Waterloo, IA',
    images: [
      { id: '5-0', src: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/Timeline_1_cdz63u.jpg', alt: 'Midwest landscapes — Timeline 1', aspectRatio: 'landscape', videoSrc: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/Timeline_1_cdz63u.mp4' },
      { id: '5-2', src: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/River_4_ykzyjs.jpg', alt: 'Midwest landscapes — River', aspectRatio: 'landscape', videoSrc: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/River_4_ykzyjs.mp4' },
      { id: '5-3', src: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/Avanta_6_n66qt6.jpg', alt: 'Midwest landscapes — Avanta', aspectRatio: 'landscape', videoSrc: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/Avanta_6_n66qt6.mp4' },
      { id: '5-4', src: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/Avanta_2_wlxwnk.jpg', alt: 'Midwest landscapes — Avanta 2', aspectRatio: 'landscape', videoSrc: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/Avanta_2_wlxwnk.mp4' },
      { id: '5-5', src: '/embeds/drone/videos/midwest-avanta-poster.jpg', alt: 'Midwest aerial — Avanta clip', aspectRatio: 'landscape', videoSrc: '/embeds/drone/videos/midwest-avanta.mp4' },
      { id: '5-6', src: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/dji_fly_20260613_125434_199_1781654664196_video_de4sht.jpg', alt: 'Midwest landscapes — DJI flyover', aspectRatio: 'landscape', videoSrc: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/dji_fly_20260613_125434_199_1781654664196_video_de4sht.mp4' }
    ]
  },
  {
    id: '6',
    title: 'Neighborhood Aerials',
    category: 'architecture',
    year: '2025',
    slug: 'neighborhood-aerials',
    coverImage: 'https://res.cloudinary.com/dxrwuu6d4/image/upload/f_auto,q_auto,w_1280/v1779839252/dji_export_20260521_photo_0001_ta84oy.jpg',
    coverVideo: '/embeds/drone/videos/rooftop.mp4',
    description: 'Comprehensive aerial documentation of residential neighborhoods, perfect for real estate marketing and community showcase.',
    client: 'Real Estate',
    camera: 'DJI Avata 2 and Mini 4K',
    location: 'Waterloo, IA',
    images: [
      { id: '6-5', src: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/Avanta_4_u1dubk.jpg', alt: 'Neighborhood aerials — Avanta 4', aspectRatio: 'landscape', videoSrc: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/Avanta_4_u1dubk.mp4' },
      { id: '6-6', src: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/Avanta_3_c8cbsl.jpg', alt: 'Neighborhood aerials — Avanta 3', aspectRatio: 'landscape', videoSrc: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/Avanta_3_c8cbsl.mp4' },
      { id: '6-7', src: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/Avanta_1_kbu7wd.jpg', alt: 'Neighborhood aerials — Avanta 1', aspectRatio: 'landscape', videoSrc: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/Avanta_1_kbu7wd.mp4' },
      { id: '6-8', src: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/so_0,f_jpg,q_auto,w_1280/Aerial_view_lbzwpy.jpg', alt: 'Neighborhood aerials — Aerial view', aspectRatio: 'landscape', videoSrc: 'https://res.cloudinary.com/dxrwuu6d4/video/upload/f_auto,q_auto,vc_auto,w_1280/Aerial_view_lbzwpy.mp4' }
    ]
  },
  {
    id: '3',
    title: 'First Person View',
    category: 'architecture',
    year: '2025',
    slug: 'rooftop-perspectives',
    coverImage: '/embeds/drone/videos/rooftop-poster.jpg',
    coverVideo: '/embeds/drone/videos/rooftop.mp4',
    description: 'Immersive first-person-view drone footage that puts you in the pilot seat, capturing dynamic low-altitude flights and acrobatic maneuvers with cinematic fluidity.',
    client: 'Commercial',
    camera: 'DJI Avata 2 and Mini 4K',
    location: 'Waterloo, IA',
    images: [
      { id: '3-0', src: 'https://res.cloudinary.com/dxrwuu6d4/image/upload/f_auto,q_auto,w_1280/v1779839252/dji_export_20260521_photo_0001_ta84oy.jpg', alt: 'FPV aerial — DJI export', aspectRatio: 'landscape' },
      { id: '3-1', src: '/embeds/drone/videos/rooftop-poster.jpg', alt: 'FPV perspective clip', aspectRatio: 'landscape', videoSrc: '/embeds/drone/videos/rooftop.mp4' }
    ]
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projects;
  return projects.filter(project => project.category === category);
};

export const getFeaturedProjects = (): Project[] => {
  // Strictly drone work on the homepage carousel
  return projects.filter(p => p.category !== 'botanical' && p.category !== 'edits' && p.category !== 'travel');
};

export const getEdits = (): Project[] => {
  return projects.filter(p => p.category === 'edits' || p.category === 'travel');
};

export const getAdjacentProjects = (currentSlug: string): { prev: Project | null; next: Project | null } => {
  const currentIndex = projects.findIndex(p => p.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null
  };
};
