import { LocalVideoTrack, Room } from 'twilio-video';
import { useCallback, useState } from 'react';
import { BackgroundProcessor, GaussianBlurBackgroundProcessor, ImageFit, VirtualBackgroundProcessor } from '@twilio/video-processors';

let virtualBackground: VirtualBackgroundProcessor;
let blur = new GaussianBlurBackgroundProcessor();
const img = new Image();
img.onload = () => {
  virtualBackground = new VirtualBackgroundProcessor({ backgroundImage: img, fitType: ImageFit.Cover });
};
img.src = '/office.jpg';

export enum Filters {
  VirtualBackground = 'VirtualBackground',
  Blur = 'blur',
  None = 'none',
}

export function useFilters(room: Room) {
  const [currentFilter, setCurrentFilter] = useState(Filters.None);
  const [processor, setProcessor] = useState<GaussianBlurBackgroundProcessor | VirtualBackgroundProcessor | null>(null);

  const setFilter = useCallback((filter?: Filters, track?: LocalVideoTrack) => {
    const videoTrack = track || Array.from(room.localParticipant.videoTracks.values())[0].track;
    filter = filter || currentFilter;
    setCurrentFilter(filter);

    (window as any).track = videoTrack;

    if (videoTrack.processor) {
      videoTrack.removeProcessor(videoTrack.processor);
    }
    if (filter === Filters.VirtualBackground) {
      videoTrack.addProcessor(virtualBackground);
      setProcessor(virtualBackground);
      (window as any).processor = virtualBackground;
    } else if (filter === Filters.Blur) {
      videoTrack.addProcessor(blur);
      setProcessor(blur);
      (window as any).processor = blur;
    }
  }, [currentFilter, setCurrentFilter, room]);

  return [processor, setFilter] as const;
}