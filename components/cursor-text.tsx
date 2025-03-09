import { CURSOR_IMAGES } from "@/lib/constants";
import { Cursor } from "./motion-primitives/cursor";

export function CursorText({ text }: { text: string }) {
  const regex = /<cursor:([^>]+)>([^<]+)<\/cursor>/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const cursorId = match[1];
    const cursorContent = match[2];
    const imageData = CURSOR_IMAGES[cursorId as keyof typeof CURSOR_IMAGES];
    
    if (imageData) {
      parts.push(
        <span key={`cursor-${parts.length}`} 
          className="relative cursor-pointer group"
        >
          <span className="underline underline-offset-6 decoration-dotted">{cursorContent}</span>
          <Cursor
            attachToParent
            variants={{
              initial: { height: 0, opacity: 0, scale: 0.3 },
              animate: { height: 'auto', opacity: 1, scale: 1 },
              exit: { height: 0, opacity: 0, scale: 0.3 },
            }}
            transition={{
              type: 'spring',
              duration: 0.3,
              bounce: 0.1,
            }}
            // className='overflow-hidden absolute top-0 left-0 -translate-y-full z-10'
            // className="overflow-hidden absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 hidden group-hover:block"
            springConfig={{ bounce: 0.01 }}
          >
            <img
              src={imageData.src}
              alt={imageData.alt}
              className='h-40 w-40 object-cover'
            />
          </Cursor>
        </span>
      );
    } else {
      parts.push(cursorContent);
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return <>{parts}</>;
}